import { useEffect, useState, useRef } from 'react';
import socket from '../lib/socket';
import { Send, Mic } from 'lucide-react'; 

type ChatInputProps = {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  roomId: string;
  userId: string;
};

// ChatInput component for sending messages in a chat room
// It includes an input field, emoji button, and send/mic button
// It handles typing indicators and focuses the input on mount
// It also disables the send button when the input is empty
const ChatInput = ({
  value,
  onChange,
  onSend,
  roomId,
  userId,
}: ChatInputProps) => {
  const [canSend, setCanSend] = useState(false);

  // Effect to enable/disable send button based on input value
  useEffect(() => {
    setCanSend(value.trim().length > 0);
  }, [value]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    socket.emit('typing', { roomId, userId });
  };

  return (
    <div className="flex items-center gap-2 bg-zinc-700 px-4 py-2 mx-2 rounded-xl shadow-md">
      {/* Placeholder for emoji button */}
      <button className="text-gray-400 hover:text-white">
        😊
      </button>

      <input
        ref={inputRef}
        className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-2 py-2"
        placeholder="Type a message"
        value={value}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && canSend && onSend()}
      />

      {/* Right side button: mic or send */}
      {canSend ? (
        <button
          onClick={onSend}
          className="text-green-500 hover:text-green-400"
        >
          <Send className="w-5 h-5" />
        </button>
      ) : (
        <button disabled
          onClick={() => socket.emit('typing', { roomId, userId })}
          className="text-gray-400 hover:text-white"
        >
          <Mic className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ChatInput;
