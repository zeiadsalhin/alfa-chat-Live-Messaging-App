interface Props {
  isRecording: boolean;
  audioBlob: Blob | null;
  onStart: () => void;
  onStop: () => void;
  onSend: () => void;
}

// Future feature to handle audio playback
const AudioControls = ({ isRecording, audioBlob, onStart, onStop, onSend }: Props) => (
  <div className="flex gap-2">
    {!isRecording ? (
      <button
        className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-500"
        onClick={onStart}
      >
        🎙 Start Recording
      </button>
    ) : (
      <button
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
        onClick={onStop}
      >
        ⏹ Stop Recording
      </button>
    )}

    {audioBlob && (
      <button
        className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-500"
        onClick={onSend}
      >
        📤 Send Voice
      </button>
    )}
  </div>
);

export default AudioControls;
