import { ChatMessage } from '../types/message';

interface Props {
  rooms: { [roomId: string]: ChatMessage[] };
  onSelect: (roomId: string) => void;
}

// ChatList component displays a list of chat rooms
// Each room shows the last message, avatar, and timestamp
// It allows selecting a room to view its messages
const ChatList = ({ rooms, onSelect }: Props) => {
  
  // Convert rooms object to an array of entries for rendering
  // Each entry is a tuple of [roomId, messages]
  const entries = Object.entries(rooms);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <div className="space-y-4">
        {entries.map(([roomId, messages]) => {
          const lastMsg = messages[messages.length - 1];
          return (
            <button
              key={roomId}
              onClick={() => onSelect(roomId)}
              className="flex items-center gap-4 w-full bg-gray-800 rounded p-3 hover:bg-gray-700 text-left"
            >
              <img
                src={lastMsg?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${lastMsg?.userId}`}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="font-semibold">{roomId}</div>
                <div className="text-sm text-gray-300 truncate">
                  {lastMsg?.type === 'text' ? lastMsg.content : '🎙 Voice message'}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString() : ''}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
