// src/pages/JoinPage.tsx
import JoinRoom from '../components/JoinRoom';

// JoinPage renders the JoinRoom component
// It is used to join an existing chat room or create a new one
const JoinPage = () => {
  return (
    <div className="h-screen bg-zinc-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <JoinRoom />
      </div>
    </div>
  );
};

export default JoinPage;
