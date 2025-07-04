import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '../types/message';

// StoredChats component displays a list of stored chat rooms
// It allows selecting a room to view its messages
type StoredChatsProps = {
  onSelect?: (roomId: string) => void; // Optional for standalone mode
};

const StoredChats = ({ onSelect }: StoredChatsProps) => {
  const [chatRooms, setChatRooms] = useState<string[]>([]);
  const [lastSeenMap, setLastSeenMap] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || '';

  // Load chat rooms and last seen timestamps from localStorage on mount
  // chat history is stored in localStorage under 'chatHistory'
  useEffect(() => {
    const chatMap = JSON.parse(localStorage.getItem('chatHistory') || '{}');
    setChatRooms(Object.keys(chatMap));

    const seenMap = JSON.parse(localStorage.getItem('lastSeenMap') || '{}');
    setLastSeenMap(seenMap);
  }, []);

  const handleClick = (roomId: string) => {
    const now = Date.now();

    // Update last seen for this room
    const updatedSeen = { ...lastSeenMap, [roomId]: now };
    localStorage.setItem('lastSeenMap', JSON.stringify(updatedSeen));
    setLastSeenMap(updatedSeen);

    if (onSelect) {
      onSelect(roomId); // Optional callback for non-router usage
    } else {
      navigate(`/chat/${roomId}`);
    }
  };

  // Calculate unread messages count for a room
  // Unread messages are those sent by others after the last seen timestamp
  const getUnreadCount = (roomId: string): number => {
    const chatMap = JSON.parse(localStorage.getItem('chatHistory') || '{}');
    const messages: ChatMessage[] = chatMap[roomId] || [];
    const lastSeen = lastSeenMap[roomId] || 0;

    // Filter messages that are sent by others after the last seen timestamp and count them as unread
    // only count messages that the user hasn't seen yet
    return messages.filter(
      (msg) => msg.userId !== userId && msg.timestamp > lastSeen
    ).length;
  };

  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      {chatRooms.length === 0 && (
        <div className="text-gray-400 text-sm">No stored chats yet</div>
      )}
      {chatRooms.map((roomId) => {
        const lastMessage = (() => {
          const chatMap = JSON.parse(localStorage.getItem('chatHistory') || '{}');
          
          // Get the last message in the room
          // If no messages exist, return undefined
          const msgs: ChatMessage[] = chatMap[roomId] || [];
          return msgs[msgs.length - 1];
        })();

        const unreadCount = getUnreadCount(roomId);

        return (
          <button
            key={roomId}
            onClick={() => handleClick(roomId)}
            className="flex items-center justify-between p-3 rounded hover:bg-gray-700 bg-gray-800"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Avatar */}
              <img
                src={
                  lastMessage?.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${roomId}`
                }
                alt="avatar"
                className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0"
              />

              {/* Room Info */}
              <div className="flex flex-col overflow-hidden text-left">
                <span className="font-medium truncate">{roomId}</span>
                {lastMessage && (
                  <span className="text-sm text-gray-400 truncate max-w-[12rem] sm:max-w-[8rem]">
                    {lastMessage.type === 'text'
                      ? lastMessage.content
                      : '🎙️ Voice message'}
                  </span>
                )}
              </div>
            </div>

            {/* Unread badge */}
            {unreadCount > 0 && (
              <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StoredChats;
