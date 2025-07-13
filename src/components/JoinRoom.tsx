import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import socket from '../lib/socket';

// JoinRoom component allows users to join a chat room by entering a room ID and username
// It validates the inputs and emits a socket event to join the room
export type JoinRoomProps = {
  onJoin?: (roomId: string, userId: string) => void;
};

const JoinRoom = ({ onJoin }: JoinRoomProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.includes('ar');
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [errors, setErrors] = useState<{ roomId?: string; userId?: string }>({});
  const navigate = useNavigate();

  // Handle joining the room
  // Validates the room ID and user ID, emits a socket event to join the room
  const handleJoin = () => {
    const trimmedRoomId = roomId.trim();
    const trimmedUserId = userId?.trim();
    const newErrors: typeof errors = {};

    if (!trimmedRoomId) newErrors.roomId = t('join.errors.roomIdRequired');
    if (!trimmedUserId) newErrors.userId = t('join.errors.userIdMissing');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors
    setErrors({});

    // Emit join-room socket event
    socket.emit('join-room', trimmedRoomId, trimmedUserId);

    // Optional callback
    onJoin?.(trimmedRoomId, trimmedUserId ? trimmedUserId : '');

    // Redirect
    navigate(`/chat/${trimmedRoomId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center bg-zinc-800/40 text-white p-6 rounded-xl shadow-xl space-y-5 max-w-md w-full mx-auto ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      onKeyDown={handleKeyDown}
    >
      <h2 className="text-2xl font-semibold text-center mb-4">{t('join.title')}</h2>

      <div className="w-full">
        <label className="text-sm text-zinc-300 mb-1 block">
          {t('join.roomLabel')}
        </label>
        <input
          className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder={t('join.placeholder')}
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>}
        {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId}</p>}
      </div>

      <button
        onClick={handleJoin}
        className="w-full bg-zinc-600 hover:bg-zinc-500 text-white py-2 rounded-md transition-all font-medium text-sm tracking-wide"
      >
        {t('join.button')}
      </button>
    </div>

  );
};

export default JoinRoom;
