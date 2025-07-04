import { ChevronLeft } from 'lucide-react'; 

type Props = {
  roomId: string;
  onlineUsers: string[];
  userId: string;
  onBack: () => void;
  typingUser: string | null;
  onClearChat: () => void; 
};

// ChatHeader component displays the header for the chat room
// It includes the room name, typing indicator, online users, and a back button
const ChatHeader = ({ roomId, onBack, typingUser, onlineUsers, userId, onClearChat }: Props) => {
    const otherUsers = onlineUsers.filter((u) => u !== userId);

  return (
    <div className="sticky top-0 z-10 bg-gray-800a text-white px-4 flex justify-between border-ba border-gray-700 min-h-[2.8rem]">
      {/* Left: Back Button, Room Name */}
      <div className="flex items-center space-x-4">
        <button
          className="px-1.5 py-1.5 rounded-full hover:bg-zinc-700 focus:outline-0 text-white transform transition duration-200"
          onClick={onBack}
        >
          <ChevronLeft size={24} />
        </button>

        <div>
          <h2 className="text-lg font-semibold">{roomId}</h2>

          {typingUser ? (
            <div className="text-xs text-yellow-400/60">{typingUser} is typing...</div>
          ) : (
            <div className="text-xs text-green-400/60">
              {otherUsers.length > 0
                ? otherUsers.map((user, idx) => (
                    <span key={user}>
                      {user} Online{idx < otherUsers.length - 1 && ', '}
                    </span>
                  ))
                : ''}
            </div>
          )}
        </div>
      </div>
      {/* Clear Chat Button */}
      <button
            className="text-sm text-zinc-300 hover:text-white transition"
            onClick={() => {
          if (window.confirm('Are you sure you want to clear the chat?')) {
            onClearChat();
          }
        }}
          >
            Clear
          </button>
    </div>
  );
};

export default ChatHeader;
