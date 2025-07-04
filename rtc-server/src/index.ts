import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// Socket.IO RTC server for real-time communication
// Supports rooms, chat messages, audio messages, typing indicators, and message delivery tracking
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*', // allow all requests during dev; restrict in production
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.get('/', (_req, res) => {
  res.send('Socket.IO RTC Server is running!');
});

// Track users in rooms: roomId => Set of userIds
const roomUsers: Record<string, Set<string>> = {};

// Store last 50 messages per room (text + audio)
const roomMessages: Record<string, any[]> = {};

// Track seen messages per room per user
const seenMessages: Record<string, Record<string, Set<string>>> = {};

// Helper to log users in a room with your style
function logUsersInRoom(roomId: string) {
  const users = roomUsers[roomId] ? Array.from(roomUsers[roomId]) : [];
  console.log(`Users in room ${roomId}: [${users.join(', ')}]`);
}

io.on('connection', (socket) => {
  console.log(`⚡ New client connected: ${socket.id}`);

  // Join room event
  socket.on('join-room', (roomId: string, userId: string) => {
    socket.join(roomId);
    socket.data.userId = userId;
    socket.data.roomId = roomId;

    // Initialize room if it doesn't exist
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = new Set();
    }
    roomUsers[roomId].add(userId);

    console.log(`🟢 ${userId} joined room ${roomId}`);
    logUsersInRoom(roomId);

    // Send last 50 messages only to this user
    const history = roomMessages[roomId] || [];
    socket.emit('room-history', history);

    // Notify room of new user joining 
    io.to(roomId).emit('user-joined', userId);
    io.to(roomId).emit('room-users', Array.from(roomUsers[roomId]));
  });

  // Typing indicator
  socket.on('typing', ({ roomId, userId }) => {
    socket.to(roomId).emit('typing', { userId });
  });

  // Chat message
  socket.on('chat-message', (data) => {
    const { roomId } = data;

    // Ensure room exists in messages
    if (!roomMessages[roomId]) roomMessages[roomId] = [];
    roomMessages[roomId].push(data);
    if (roomMessages[roomId].length > 50) {
      roomMessages[roomId].shift();
    }

    io.to(roomId).emit('chat-message', data);

    // Acknowledge delivery only to sender
    socket.emit('message-delivered', {
      messageId: data.id,
    });
  });

  // Audio message
  socket.on('audio-message', (data) => {
    const { roomId } = data;

    // Ensure room exists in messages
    if (!roomMessages[roomId]) roomMessages[roomId] = [];
    roomMessages[roomId].push(data);
    if (roomMessages[roomId].length > 50) {
      roomMessages[roomId].shift();
    }

    io.to(roomId).emit('audio-message', data);
  });

  // Mark as seen
  socket.on('message-seen', ({ roomId, userId }) => {
  if (!seenMessages[roomId]) {
    seenMessages[roomId] = {};
  }

  // Initialize user set if it doesn't exist
  if (!seenMessages[roomId][userId]) {
    seenMessages[roomId][userId] = new Set();
  }

  // Get messages from other users in the room
  const messages = roomMessages[roomId] || [];

  // Filter unseen messages for this user
  const unseen = messages.filter(
    (m) => m.userId !== userId && !seenMessages[roomId][userId].has(m.id)
  );

  // Add unseen messages to the user's seen set
  unseen.forEach((m) => seenMessages[roomId][userId].add(m.id));

  // Notify others
  io.to(roomId).emit('message-seen', {
    userId,
    messageIds: unseen.map((m) => m.id),
  });
});

  // Leave room
  socket.on('leave-room', (roomId: string, userId: string) => {
    socket.leave(roomId);

    // Remove user from roomUsers
    if (roomUsers[roomId]) {
      roomUsers[roomId].delete(userId);

      if (roomUsers[roomId].size === 0) {
        delete roomUsers[roomId];
      } else {
        io.to(roomId).emit('room-users', Array.from(roomUsers[roomId]));
      }
    }

    console.log(`🔴 ${userId} left room ${roomId}`);
    logUsersInRoom(roomId);
  });

  // Disconnect cleanup
  socket.on('disconnect', () => {
    const { userId, roomId } = socket.data || {};

    // If userId and roomId are available, remove user from roomUsers
    if (userId && roomId) {
      console.log(`🔴 ${userId} left room ${roomId}`);

      if (roomUsers[roomId]) {
        roomUsers[roomId].delete(userId);

        // If no users left in room, delete the room
        if (roomUsers[roomId].size === 0) {
          delete roomUsers[roomId];
        } else {
          logUsersInRoom(roomId);
          io.to(roomId).emit('room-users', Array.from(roomUsers[roomId]));
        }
      }
    }
    console.log(`❌ Disconnected: ${socket.id} (${userId ?? 'unknown user'})`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
