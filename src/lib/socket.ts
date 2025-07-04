import { io } from 'socket.io-client';

// This file initializes the Socket.IO client connection
// and exports the socket instance for use in the application.
const SERVER_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3001'
    : import.meta.env.VITE_SOCKET_URL;

// import.meta.env.MODE === 'development'
//     ? console.log('[Socket.IO] Connected to:', SERVER_URL)
//     : console.log('[Socket.IO] Connected to production server');

const socket = io(SERVER_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
