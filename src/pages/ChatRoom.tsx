import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../lib/socket';
import { useRecorder } from '../hooks/useRecorder';
import { ChatMessage } from '../types/message';
import { v4 as uuidv4 } from 'uuid';

import {
  ChatHeader,
  ChatWindow,
  ChatInput,
  // AudioControls,
} from '../components/Layout';

// ChatRoom component represents a single chat room
// It handles joining the room, sending messages, receiving updates and managing chat history
// It also manages user typing indicators, online users, and message statuses
const ChatRoom = ({ isServerOnline = true }: { isServerOnline?: boolean }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [userId] = useState(() => localStorage.getItem('userId') || '');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '{}');
    return roomId && history[roomId] ? history[roomId] : [];
  });

  const { isRecording, audioBlob, startRecording, stopRecording, reset } = useRecorder();

  // Sync chat history with localStorage
  // This function updates the chat history in localStorage whenever messages change
  const syncChatHistory = (updated: ChatMessage[]) => {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '{}');
    if (roomId) {
      history[roomId] = updated;
      localStorage.setItem('chatHistory', JSON.stringify(history));
    }
  };

  // Add a new message to the chat
  // This function updates the messages state and syncs the chat history
  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => {
      const updated = [...prev, msg];
      syncChatHistory(updated);
      return updated;
    });
  };

  // Update the status of a message
  // This function updates the status of a specific message and syncs the chat history
  const updateMessageStatus = (messageId: string, status: ChatMessage['status']) => {
    setMessages(prev => {
      const updated = prev.map(msg =>
        msg.id === messageId ? { ...msg, status } : msg
      );
      syncChatHistory(updated);
      return updated;
    });
  };

  // Handle sending a text message
  // This function creates a new message object and emits it to the server
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const now = Date.now();
    const newMsg: ChatMessage = {
      id: uuidv4(),
      type: 'text',
      content: message,
      userId,
      timestamp: now,
      status: 'sent',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`,
      username: ''
    };

    addMessage(newMsg);
    socket.emit('chat-message', { roomId, ...newMsg });
    setMessage('');
  };

  const handleSendAudio = () => {
    if (!audioBlob) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data: ChatMessage = {
        id: uuidv4(),
        type: 'audio',
        content: reader.result as string,
        userId,
        timestamp: Date.now(),
        status: 'sent',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`,
        username: ''
      };
      socket.emit('audio-message', { roomId, ...data });
      addMessage(data);
      reset();
    };
    reader.readAsDataURL(audioBlob);
  };

  // Clear chat handler
  const clearChat = () => {
    // if (!window.confirm('Are you sure you want to clear the chat?')) return;

    // This function clears the chat messages and updates localStorage
    setMessages([]);
    const history = JSON.parse(localStorage.getItem('chatHistory') || '{}');
    if (roomId) {
      history[roomId] = [];
      localStorage.setItem('chatHistory', JSON.stringify(history));
    }
    socket.emit('clear-chat', { roomId });
  };

  // Join the chat room when the component mounts
  // It checks if roomId and userId are available, otherwise redirects to home
  useEffect(() => {
    if (!roomId || !userId) {
      navigate('/');
    } else {
      socket.emit('join-room', roomId, userId);
      setJoined(true);
    }
  }, [roomId, userId, navigate]);

  // Listen for socket events related to the chat room
  // It handles receiving chat history, new messages, typing indicators, message statuses, and online users
  // It also handles clearing the chat when requested
  useEffect(() => {
    socket.on('room-history', (history: ChatMessage[]) => {
      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const combined = [...prev];
        for (const msg of history) {
          if (!existingIds.has(msg.id)) combined.push(msg);
        }
        combined.sort((a, b) => a.timestamp - b.timestamp);
        syncChatHistory(combined);
        return combined;
      });
    });

    socket.on('chat-message', (data: ChatMessage) => {
      if (data.userId !== userId) {
        addMessage(data);
        socket.emit('message-delivered', {
          roomId,
          messageId: data.id,
        });
      }
    });

    socket.on('audio-message', (data: ChatMessage) => {
      if (data.userId !== userId) {
        addMessage(data);
        socket.emit('message-delivered', {
          roomId,
          messageId: data.id,
        });
      }
    });

    socket.on('typing', ({ userId: typer }) => {
      if (typer !== userId) {
        setTypingUser(typer);
        setTimeout(() => setTypingUser(null), 2000);
      }
    });

    socket.on('message-delivered', ({ messageId }) => {
      updateMessageStatus(messageId, 'delivered');
    });

    socket.on('message-seen', ({ userId: seenBy }) => {
      setMessages(prev => {
        const updated = prev.map(msg =>
          msg.userId === userId ? { ...msg, status: 'seen' as ChatMessage['status'] } : msg
        );
        syncChatHistory(updated as ChatMessage[]);
        return updated;
      });
    });

    socket.on('room-users', (users: string[]) => {
      setOnlineUsers(users);
    });

    // Listen for clear-chat event from server
    socket.on('clear-chat', () => {
      setMessages([]);
      syncChatHistory([]);
    });

    // Cleanup socket listeners on unmount
    return () => {
      socket.off('room-history');
      socket.off('chat-message');
      socket.off('audio-message');
      socket.off('typing');
      socket.off('message-delivered');
      socket.off('message-seen');
      socket.off('room-users');
      socket.off('clear-chat');
    };
  }, [roomId, userId]);

  // Handle visibility change to mark messages as seen
  // When the document becomes visible, it updates the status of unseen messages
  useEffect(() => {
    const handleVisibility = () => {
      const isVisible = document.visibilityState === 'visible';
      if (!roomId || !userId || !joined || !isVisible) return;

      const updated = messages.map(msg => {
        if (msg.userId !== userId && msg.status !== 'seen') {
          return { ...msg, status: 'seen' as ChatMessage['status'] };
        }
        return msg;
      });

      const hasChanges = updated.some((msg, i) => msg.status !== messages[i]?.status);

      // Only update messages and sync if there are changes
      if (hasChanges) {
        setMessages(updated);
        syncChatHistory(updated);
        socket.emit('message-seen', { roomId, userId });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    handleVisibility();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [messages, roomId, userId, joined, onlineUsers]);

  // This function emits a leave-room event and navigates to the home page
  const handleBack = () => {
    if (roomId) {
      socket.emit('leave-room', roomId, userId);
    }
    navigate('/');
  };

  return (
    <div className={`flex flex-col ${isServerOnline ? 'h-screen' : 'h-[calc(100vh-2.5rem)]'} py-2 gap-2 bg-gray-900a text-white`}>
      <ChatHeader
        roomId={roomId!}
        onBack={handleBack}
        typingUser={typingUser}
        onlineUsers={onlineUsers}
        userId={userId}
        onClearChat={clearChat}
      />
      <ChatWindow messages={messages} userId={userId} />
      <ChatInput
        value={message}
        onChange={setMessage}
        onSend={handleSendMessage}
        roomId={roomId!}
        userId={userId}
      />
      {/* <AudioControls
        isRecording={isRecording}
        audioBlob={audioBlob}
        onStart={startRecording}
        onStop={stopRecording}
        onSend={handleSendAudio}
      /> */}
    </div>
  );
};

export default ChatRoom;
