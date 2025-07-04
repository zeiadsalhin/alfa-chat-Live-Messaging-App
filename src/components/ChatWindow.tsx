import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../types/message';

// ChatWindow component displays the chat messages in a scrollable window
// It handles unread message dividers, date separators, and scroll behavior
// It also shows message status (seen, delivered, sent) and formats timestamps
type Props = {
  messages: ChatMessage[];
  userId: string;
};

// Formats the date label for message timestamps
// It returns ex: "Today" for today's messages, "Yesterday" for yesterday's messages,
const formatDateLabel = (timestamp: number) => {
  const msgDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) return 'Today';
  if (msgDate.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return msgDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const ChatWindow = ({ messages, userId }: Props) => {
  const [unreadDividerVisible, setUnreadDividerVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const prevMessagesLength = useRef(0);

  // Initialize last seen timestamp based on the last seen message from other users
  // If no seen messages exist, default to 0 (no messages seen)
  const [initialLastSeen] = useState(() => {
    const lastSeenMsg = [...messages]
      .filter((msg) => msg.userId !== userId && msg.status === 'seen')
      .pop();
    return lastSeenMsg?.timestamp || 0;
  });

  const lastSeen = initialLastSeen;

  // Calculate unread messages count and first unread message index
  // Unread messages are those sent after the last seen timestamp by other users
  const unreadCount = messages.filter(
    (msg) => msg.timestamp > lastSeen && msg.userId !== userId
  ).length;

  // Find the index of the first unread message
  // This is used to show the "Unread messages" divider
  const firstUnreadIndex = messages.findIndex(
    (msg) => msg.timestamp > lastSeen && msg.userId !== userId
  );

  // Show unread divider again if new unread messages arrive
useEffect(() => {
  const hasNewUnread =
    messages.some(msg => msg.timestamp > lastSeen && msg.userId !== userId);

  if (hasNewUnread) {
    setUnreadDividerVisible(true);
  }
}, [messages, lastSeen, userId]);


  // Handle scroll to bottom behavior
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isInitialLoad = prevMessagesLength.current === 0 && messages.length > 0;

    // Check if the user is near the bottom of the chat window
    // If they are, we scroll to the end when new messages arrive
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 200;

      // Scroll to the end if it's the initial load or if user is near bottom
    // This ensures a smooth experience when new messages arrive
    if (isInitialLoad) {
      endRef.current?.scrollIntoView({ behavior: 'auto' });
    } else if (messages.length > prevMessagesLength.current && isNearBottom) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    prevMessagesLength.current = messages.length;
  }, [messages]);

  // Hide unread divider 2s after user scrolls to bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container || firstUnreadIndex === -1) return;


    // Track the timeout to hide the unread divider
    let timeout: NodeJS.Timeout;

    // Handle scroll event to check if user is at the bottom
    // If they are, we hide the unread divider after a delay
    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 50;

      if (isAtBottom && unreadDividerVisible) {
        // Delay hiding by 2 seconds
        timeout = setTimeout(() => setUnreadDividerVisible(false), 2000);
      } else {
        // Clear timeout if user scrolls up again before delay ends
        clearTimeout(timeout);
      }
    };

  container.addEventListener('scroll', handleScroll);
  return () => {
    container.removeEventListener('scroll', handleScroll);
    clearTimeout(timeout);
  };
}, [firstUnreadIndex, unreadDividerVisible]);


  let lastDate = '';

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-2 bg-zinc-900 rounded border border-zinc-700 space-y-2"
    >
      {/* Render messages */}
      {/* use a map to iterate over messages and render each one */}
      {/* also handle date separators and unread message dividers */}
      {messages.map((msg, i) => {
        const isMe = msg.userId === userId;
        const msgDate = new Date(msg.timestamp);
        const dateLabel = formatDateLabel(msg.timestamp);
        const showDateSeparator = dateLabel !== lastDate;
        if (showDateSeparator) lastDate = dateLabel;

        // Determine if should show the unread divider
        // It should be shown only for the first unread message
        const showUnread =
          unreadDividerVisible &&
          i === firstUnreadIndex &&
          unreadCount > 0;

        return (
          <div key={i}>
            {/* Date Separator */}
            {showDateSeparator && (
              <div className="text-center text-xs text-gray-400 my-4 relative">
                <span className="bg-zinc-900 px-2 z-10 relative">{dateLabel}</span>
                <div className="absolute left-0 right-0 top-1/2 border-t border-gray-600 z-0" />
              </div>
            )}

            {/* Unread Divider */}
            {showUnread && (
              <div
                className={`text-center text-xs text-yellow-400 mt-2 transition-opacity duration-500 ${
                  unreadDividerVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Unread messages ({unreadCount})
              </div>
            )}

            {/* Message Bubble */}
            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-gray-400 mb-1">
                {isMe ? 'You' : msg.userId}
              </span>

              <div
                className={`relative max-w-xs px-4 py-2 rounded-lg text-sm shadow ${
                  isMe
                    ? 'bg-green-600/10 text-white rounded-br-none'
                    : 'bg-zinc-700 text-white rounded-bl-none'
                }`}
              >
                {msg.type === 'text' ? (
                  <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <audio controls className="w-full mt-1">
                    <source src={msg.content} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                )}

                <div className="flex justify-end items-center mt-1 text-[10px] space-x-1">
                  <span className="text-gray-300">
                    {msgDate.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {isMe && (
                  <div className="text-right text-[10px] mt-1">
                    {msg.status === 'seen' ? (
                      <span className="text-blue-400">✓✓</span>
                    ) : msg.status === 'delivered' ? (
                      <span className="text-gray-400">✓</span>
                    ) : (
                      <span className="text-gray-400">Sent</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
};

export default ChatWindow;
