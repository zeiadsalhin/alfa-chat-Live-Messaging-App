import { ChevronLeft } from 'lucide-react'; 

type Props = {
  t: (key: string, options?: Record<string, any>) => string;
  isRTL: boolean;
  roomId: string;
  onlineUsers: string[];
  userId: string;
  onBack: () => void;
  typingUser: string | null;
  onClearChat: () => void; 
};

// ChatHeader component displays the header for the chat room
// It includes the room name, typing indicator, online users, and a back button
const ChatHeader = ({
  t,
  isRTL,
  roomId,
  onBack,
  typingUser,
  onlineUsers,
  userId,
  onClearChat,
}: Props) => {

  const otherUsers = onlineUsers.filter((u) => u !== userId);

  return (
    <div
      className={`sticky top-0 z-10 text-white px-4 flex justify-between min-h-[2.8rem] ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Left: Back Button + Room Name */}
      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
        <button
          className="px-1.5 py-1.5 rounded-full hover:bg-zinc-700 focus:outline-0 text-white transform transition duration-200"
          onClick={onBack}
        >
          <ChevronLeft size={24} className={isRTL ? 'rotate-180' : ''} />
        </button>

        <div>
          <h2 className="text-lg font-semibold truncate">{roomId}</h2>

          {typingUser ? (
            <div className="text-xs text-yellow-400/60">
              {t('chat.typing', { user: typingUser })}
            </div>
          ) : (
            <div className="text-xs text-green-400/60">
              {otherUsers.length > 0
                ? otherUsers.map((user, idx) => (
                    <span key={user}>
                      {t('chat.online', { user })}
                      {idx < otherUsers.length - 1 && ', '}
                    </span>
                  ))
                : ''}
            </div>
          )}
        </div>
      </div>

      {/* Clear Chat Button */}
      <button
        className="text-sm text-zinc-300 hover:text-white transition whitespace-nowrap"
        onClick={() => {
          if (window.confirm(t('chat.confirmClear'))) {
            onClearChat();
          }
        }}
      >
        {t('chat.clear')}
      </button>
    </div>
  );
};

export default ChatHeader;
