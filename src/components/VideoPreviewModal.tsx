import React, { useState } from 'react';
import { X, Play, Pause, Volume2, Maximize, RotateCcw } from 'lucide-react';
import screenRecThumb from '../assets/images/screen_recording_thumb_1791421930526.jpg';

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(38);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#1e1e24] text-white rounded-xl shadow-2xl overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="h-10 px-4 bg-[#282830] border-b border-white/10 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Screen Recording: Ghost-text benchmark & inline preview</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Video Screen Area */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
          <img
            src={screenRecThumb}
            alt="Demo Preview"
            className="w-full h-full object-cover filter brightness-95"
          />

          {/* Animated cursor simulation */}
          <div className="absolute top-[35%] left-[45%] flex items-center gap-1.5 pointer-events-none transition-all duration-700 animate-bounce">
            <div className="w-3 h-3 border-2 border-white bg-blue-500 rounded-full shadow-md" />
            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow font-mono">
              latency: 42ms
            </span>
          </div>

          {/* Play/Pause overlay toggle on click */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {!isPlaying && (
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center pl-1 text-white hover:scale-105 transition-transform shadow-lg">
                <Play size={26} fill="white" />
              </div>
            )}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-3 bg-[#1e1e24] space-y-2">
          {/* Progress bar */}
          <div
            className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              setProgress(Math.round((clickX / rect.width) * 100));
            }}
          >
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-300 pt-0.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-white transition-colors"
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button
                onClick={() => setProgress(0)}
                className="hover:text-white transition-colors"
                title="Restart"
              >
                <RotateCcw size={14} />
              </button>
              <span className="text-[11px] font-mono text-neutral-400">
                00:16 / 00:42
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Volume2 size={15} className="text-neutral-400 hover:text-white cursor-pointer" />
              <Maximize size={15} className="text-neutral-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
