import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareDashed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// StoredChatsPage displays a list of stored chat rooms
// It allows users to view, select, and delete chat rooms
// It also provides an option to log out and clear the chat history
type StoredChat = {
  roomId: string;
  lastMessage: string;
  timestamp: number;
};

// Formats the timestamp to time in a 2-digit hour and minute
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const StoredChatsPage = () => {
  const [chats, setChats] = useState<Record<string, StoredChat>>({});
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.includes('ar');

  // Load stored chats from localStorage on component mount
  // It retrieves chat history, maps it to a structured format, and sets it in state 
  // It also formats the last message and timestamp for display
  // If no chats are found, it displays a message indicating no chats available
  useEffect(() => {
    const stored = localStorage.getItem('chatHistory');
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, any[]>;
      const mapped: Record<string, StoredChat> = {};

      Object.entries(parsed).forEach(([roomId, messages]) => {
        if (messages.length) {
          const last = messages[messages.length - 1];
          mapped[roomId] = {
            roomId,
            lastMessage: last.type === 'audio' ? '🎤 ' + t('stored.voiceMessage') : last.content,
            timestamp: last.timestamp,
          };
        }
      });

      setChats(mapped);
    }
  }, [t]);

  // Handles click on a chat room
  // If in edit mode, it toggles selection of the chat room
  // If not in edit mode, it navigates to the chat room
  // It uses a Set to manage selected chat rooms for deletion
  const handleClick = (roomId: string) => {
    if (editMode) {
      setSelectedChats(prev => {
        const updated = new Set(prev);
        updated.has(roomId) ? updated.delete(roomId) : updated.add(roomId);
        return updated;
      });
    } else {
      navigate(`/chat/${roomId}`);
    }
  };

  // Toggles edit mode
  // When toggled, it clears any selected chats
  const toggleEditMode = () => {
    setEditMode(prev => !prev);
    setSelectedChats(new Set()); // clear selections on toggle
  };

  // Handles deletion of selected chat rooms
  // It removes selected chat rooms from both state and localStorage
  const handleDeleteSelected = () => {
    const updatedChats = { ...chats };
    const stored = JSON.parse(localStorage.getItem('chatHistory') || '{}');

    selectedChats.forEach(roomId => {
      delete updatedChats[roomId];
      delete stored[roomId];
    });

    localStorage.setItem('chatHistory', JSON.stringify(stored));
    setChats(updatedChats);
    setSelectedChats(new Set());
    setEditMode(false);
  };

  const hasChats = Object.keys(chats).length > 0;

  // Handles logout
  // It removes the userId from localStorage and navigates to the registration page
  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/register');
  };


  return (
    <div
      className={`min-h-[calc(100svh-10vh)] md:min-h-[91dvh] bg-zinc-900 text-white ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('stored.chats')}</h1>
        <div className="flex items-center gap-2">
          {hasChats && (
            <button
              className="text-sm text-zinc-300 hover:text-white transition px-2 py-1"
              onClick={toggleEditMode}
            >
              {editMode ? t('stored.cancel') : t('stored.edit')}
            </button>
          )}
          <button
            className="text-sm text-red-400 hover:text-red-300 transition px-2 py-1"
            onClick={handleLogout}
          >
            {t('stored.logout')}
          </button>
        </div>
      </div>

      {!hasChats ? (
        <div className="p-6 text-center text-zinc-400 space-y-4 flex flex-col items-center justify-center">
          <MessageSquareDashed size={64} className="text-zinc-500 mb-2" />
          <p className="text-sm">{t('stored.noChats')}</p>
        </div>
      ) : (
        <>
          <ul className="overflow-y-auto divide-y divide-zinc-800">
            {Object.values(chats)
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((chat) => {
                const isSelected = selectedChats.has(chat.roomId);
                return (
                  <li
                    key={chat.roomId}
                    onClick={() => handleClick(chat.roomId)}
                    className={`flex items-center p-4 gap-3 cursor-pointer transition ${
                      isSelected ? 'bg-zinc-800' : 'hover:bg-zinc-800'
                    }`}
                  >
                    {editMode && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleClick(chat.roomId)}
                        className="accent-zinc-400 w-4 h-4"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${chat.roomId}`}
                      alt="avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-white truncate">
                          {chat.roomId}
                        </div>
                        <div dir='ltr' className="text-xs text-gray-400">
                          {formatTime(chat.timestamp)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 max-w-[17rem] truncate">
                        {chat.lastMessage}
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>

          {editMode && selectedChats.size > 0 && (
            <div className="p-4">
              <button
                className="w-full bg-red-600/60 hover:bg-red-500 text-white py-2 rounded"
                onClick={handleDeleteSelected}
              >
                {t('stored.delete')} {selectedChats.size}{' '}
                {t('stored.chat', { count: selectedChats.size })}
              </button>
            </div>
          )}
        </>
      )}

      <button
        className="bg-zinc-600 px-4 py-2 rounded hover:bg-zinc-500 text-white text-center mx-auto justify-center flex mb-4 mt-2"
        onClick={() => navigate('/join')}
      >
        {hasChats ? t('stored.newChat') : t('stored.startChat')}
      </button>
    </div>
  );
};

export default StoredChatsPage;
