import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// RegisterPage component allows users to register by entering a username
// It checks for existing userId in localStorage and redirects to home if found
const RegisterPage = () => {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Check if userId already exists in localStorage
  // If it does, redirect to home page
  useEffect(() => {
    const existingUserId = localStorage.getItem('userId');
    if (existingUserId) {
      navigate('/');
    }
  }, [navigate]);

  // Handle registration by saving userId to localStorage and navigating to home page
  // It trims the userId to avoid empty or whitespace-only usernames
  const handleRegister = () => {
    const trimmed = userId.trim();
    if (!trimmed) return;

    localStorage.setItem('userId', trimmed);
    navigate('/');
  };

  // Handle Enter key press to trigger registration
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleRegister();
  };

    const isRTL = i18n.language.includes('ar');


  return (
    <div
      className={`relative flex min-h-[calc(100svh-10vh)] md:min-h-[91dvh] items-center justify-center px-4 overflow-hidden ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Animated logo background */}
      <div
        className="absolute inset-0 bg-repeat opacity-[0.03] z-0 logo-bg"
        style={{
          backgroundImage: `url('/alfa-chat-logo-lowres.webp')`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Foreground content */}
      <div className="relative bg-zinc-900/40 backdrop-blur-sm p-6 rounded-lg shadow-md w-full max-w-sm text-white z-10">
        <img
          src="/alfa-chat-logo-lowres.webp"
          className="p-3 w-[6rem] rounded-3xl mx-auto"
          alt="logo"
          loading="lazy"
        />
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Alfa Chat
        </h1>

        <label className="block mb-2 text-sm text-gray-300">
          {t('register.username')}
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 rounded bg-zinc-950 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          placeholder={t('register.placeholder')}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleRegister}
          className="mt-4 w-full bg-zinc-600 hover:bg-zinc-500 text-white py-2 rounded text-sm transition"
        >
          {t('register.continue')}
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
