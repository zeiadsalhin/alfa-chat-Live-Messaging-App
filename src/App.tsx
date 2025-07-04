import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StoredChatsPage from './pages/StoredChatsPage';
import ChatRoom from './pages/ChatRoom';
import JoinPage from './pages/JoinPage';
import Middleware from './middleware/Middleware';
import RegisterPage from './pages/Register';
import Footer from './components/Footer'; 
import socket from './lib/socket';

// Main App component that sets up the routing and connection status, It uses React Router for navigation and Socket.IO for real-time communication, also includes a fixed banner for server offline status and adjusts the layout accordingly
// app consists of a stored chats page, chat room, join page, and registration page
// server connection status is monitored and displayed to the user
// app uses a middleware to check user authentication and redirect
function App() {
  const [isServerOnline, setIsServerOnline] = useState(true);
  const location = useLocation(); 

  // Check if the current page is the chat page to conditionally render the footer and adjust the layout
  const isChatPage = location.pathname.startsWith('/chat');

  // handle socket connection events and heartbeat to check the connection status every 5 seconds ensures that the app remains responsive to server status changes
  useEffect(() => {
  const handleConnect = () => setIsServerOnline(true);
  const handleDisconnect = () => setIsServerOnline(false);
  const handleConnectError = () => setIsServerOnline(false);

  socket.on('connect', handleConnect);
  socket.on('disconnect', handleDisconnect);
  socket.on('connect_error', handleConnectError);

  // Heartbeat: Check connection status every 5 seconds
  const interval = setInterval(() => {
    setIsServerOnline(socket.connected);
  }, 5000); // 5000 ms = 5 seconds

  // Cleanup function to remove event listeners and clear the interval
  // the event listeners are removed when the component unmounts, preventing memory leaks and ensuring that the app does not continue to listen for events after it is no longer in use
  return () => {
    socket.off('connect', handleConnect);
    socket.off('disconnect', handleDisconnect);
    socket.off('connect_error', handleConnectError);
    clearInterval(interval);
  };
}, []);


  return (
    <Middleware>
      {/* Fixed Server Offline Banner */}
      {!isServerOnline && (
        <div className="fixed top-0 left-0 w-full z-50 bg-red-600/50 text-white text-center py-2 text-sm font-light">
          <p>⚠️ Cannot connect to the server at the moment. Retrying...</p>
        </div>
      )}

      {/* Main app container with top padding when banner is shown */}
      <div
        className={`relative overflow-y-auto flex flex-col ${
          !isChatPage
            ? 'min-h-[calc(100svh-10vh)] md:min-h-[90dvh]'
            : 'min-h-[calc(100lvh-50vh)] md:min-h-[90dvh]'
        } ${!isServerOnline ? 'pt-[2.3rem]' : ''}`}
      >
        <Routes>
          <Route path="/" element={<StoredChatsPage />} />
          <Route path="/chat/:roomId" element={<ChatRoom isServerOnline={!isServerOnline ? false : true} />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
      {!isChatPage && <Footer />}
    </Middleware>
  );
}

export default App;
