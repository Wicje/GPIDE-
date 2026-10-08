import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  PanelRightClose,
  Play,
  Copy,
  Check,
  MoreHorizontal,
  Plus,
  ChevronDown,
  Mic,
  MicOff,
  Sparkles,
  Loader2,
  Volume2,
} from 'lucide-react';
import { SessionData, AgentStep } from '../types';
import screenRecThumb from '../assets/images/screen_recording_thumb_1791421930526.jpg';

interface ComposerPaneProps {
  session: SessionData;
  onOpenVideoModal: () => void;
  onCommitPush: () => void;
  onReviewClick: () => void;
  onGenerateEdits: (promptText: string) => void;
  isGenerating?: boolean;
  theme?: 'light' | 'dark';
}

export const ComposerPane: React.FC<ComposerPaneProps> = ({
  session,
  onOpenVideoModal,
  onCommitPush,
  onReviewClick,
  onGenerateEdits,
  isGenerating = false,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [selectedModel, setSelectedModel] = useState(session.model || 'Composer 2.5 Fast');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  // Sync selected model when session changes
  useEffect(() => {
    if (session.model) {
      setSelectedModel(session.model);
    }
  }, [session.id, session.model]);

  const handleCopySummary = () => {
    navigator.clipboard?.writeText(session.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendFollowUp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!followUpText.trim() || isGenerating) return;

    const userText = followUpText.trim();
    setFollowUpText('');
    onGenerateEdits(userText);
  };

  // Toggle voice dictation simulation
  const toggleVoice = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
    } else {
      setIsVoiceRecording(true);
      setTimeout(() => {
        setFollowUpText('Add telemetry event for accepted completions and track p95 latency');
        setIsVoiceRecording(false);
      }, 2400);
    }
  };

  return (
    <div
      className={`w-[370px] shrink-0 border-r flex flex-col justify-between select-none text-[13px] transition-colors ${
        isDark
          ? 'bg-[#18181b] border-neutral-800 text-neutral-200'
          : 'bg-white border-[#e5e5e7] text-[#1e1e24]'
      }`}
    >
      {/* Top Header */}
      <div
        className={`h-10 px-4 border-b flex items-center justify-between ${
          isDark ? 'border-neutral-800 bg-[#161618]' : 'border-[#e5e5e7] bg-white'
        }`}
      >
        <div className="flex items-center gap-1.5 font-medium text-[13px]">
          <span className={isDark ? 'text-white' : 'text-neutral-800'}>
            {session.title}
          </span>
          <GitBranch size={13} className="text-neutral-400 rotate-90" />
        </div>

        <button
          className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-1 rounded cursor-pointer"
          title="Collapse or dock pane"
        >
          <PanelRightClose size={14} />
        </button>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4">
        {/* User Prompt Box */}
        <div
          className={`border rounded-xl p-3 text-[13px] leading-[1.45] shadow-2xs font-normal ${
            isDark
              ? 'bg-[#222227] border-neutral-700 text-neutral-100'
              : 'bg-[#f8f8fa] border-[#e5e5e8] text-neutral-800'
          }`}
        >
          {session.prompt}
        </div>

        {/* AI Action Execution Steps */}
        <div className="space-y-1.5 text-[12.5px]">
          {session.steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-1.5 font-medium">
              <span className={`font-semibold capitalize ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {step.type}
              </span>
              <span className="text-neutral-500 font-normal truncate">
                {step.query}
              </span>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-blue-500 font-medium py-1 animate-pulse">
              <Loader2 size={13} className="animate-spin" />
              <span>Analyzing code and synthesizing diff...</span>
            </div>
          )}
        </div>

        {/* AI Response Text */}
        <div className="text-[13px] leading-[1.45] space-y-2">
          <p className={isDark ? 'text-neutral-300' : 'text-neutral-800'}>
            {session.response}
          </p>
          {session.processedItem && (
            <div className="flex items-center gap-1.5 text-[12.5px]">
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Processed
              </span>
              <span className="text-neutral-500 font-normal">
                {session.processedItem}
              </span>
            </div>
          )}
        </div>

        {/* Screen Recording Video Thumbnail Card */}
        {session.videoPreview && (
          <div
            onClick={onOpenVideoModal}
            className={`relative group rounded-xl overflow-hidden border aspect-[16/10] cursor-pointer shadow-2xs transition-all ${
              isDark
                ? 'border-neutral-700 bg-neutral-900 hover:border-neutral-500'
                : 'border-[#dcdce0] bg-[#f2f2f5] hover:border-neutral-400'
            }`}
          >
            <img
              src={screenRecThumb}
              alt="Processed screen recording"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/15 transition-colors" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-neutral-900/75 backdrop-blur-xs text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110 group-hover:bg-neutral-900/90 pl-0.5">
                <Play size={18} fill="currentColor" />
              </div>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="pt-1">
          <h4 className={`font-semibold text-[13px] mb-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Summary
          </h4>
          <p className={`text-[13px] leading-[1.45] ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>
            {session.summary}
          </p>

          <div className="flex items-center justify-end gap-2.5 mt-2.5 text-neutral-400">
            <button
              onClick={handleCopySummary}
              className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-0.5 cursor-pointer"
              title={copied ? 'Copied!' : 'Copy summary'}
            >
              {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
            </button>
            <button
              className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-0.5 cursor-pointer"
              title="More options"
            >
              <MoreHorizontal size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls & Follow-up Input */}
      <div
        className={`p-3 border-t space-y-2.5 ${
          isDark ? 'border-neutral-800 bg-[#18181b]' : 'border-[#e5e5e7] bg-white'
        }`}
      >
        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          {/* Review Button */}
          <button
            onClick={onReviewClick}
            className={`flex items-center gap-1.5 px-3 py-1 text-[12px] font-medium rounded-full border transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#24242a] hover:bg-[#2c2c34] text-neutral-200 border-neutral-700'
                : 'bg-[#f4f4f6] hover:bg-[#eaeaea] text-neutral-800 border-[#e2e2e6]'
            }`}
          >
            <span>Review</span>
            <span className="text-[#16a34a] font-medium">+{session.diffStats.additions}</span>
            <span className="text-[#dc2626] font-medium">-{session.diffStats.deletions}</span>
          </button>

          {/* Commit & Push Dropdown Button */}
          <button
            onClick={onCommitPush}
            className={`flex items-center gap-1 px-3 py-1 text-[12px] font-medium rounded-full border transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#1e1e24] hover:bg-neutral-800 text-neutral-300 border-neutral-700'
                : 'bg-white hover:bg-neutral-50 text-neutral-700 border-[#d8d8dc]'
            }`}
          >
            <span>Commit & Push</span>
            <ChevronDown size={12} className="text-neutral-500" />
          </button>
        </div>

        {/* Voice Recording Banner if Active */}
        {isVoiceRecording && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Listening to dictation...</span>
            </div>
            <span className="font-mono text-[11px]">REC</span>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSendFollowUp}
          className={`relative flex items-center justify-between pl-2 pr-1.5 py-1.5 rounded-full border shadow-2xs transition-all ${
            isDark
              ? 'bg-[#222227] border-neutral-700 focus-within:border-blue-500'
              : 'bg-white border-[#dcdcde] focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200/50'
          }`}
        >
          {/* Add context button */}
          <button
            type="button"
            className="w-5 h-5 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            title="Add context or file"
          >
            <Plus size={14} />
          </button>

          {/* Input text */}
          <input
            type="text"
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            disabled={isGenerating}
            placeholder={isGenerating ? 'Synthesizing code...' : 'Send follow-up'}
            className={`flex-1 px-2 text-[12.5px] bg-transparent focus:outline-none placeholder-neutral-400 ${
              isDark ? 'text-white' : 'text-neutral-800'
            }`}
          />

          {/* Model selector dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className={`flex items-center gap-1 text-[11.5px] px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>{selectedModel}</span>
              <ChevronDown size={11} className="text-neutral-400" />
            </button>

            {isModelDropdownOpen && (
              <div
                className={`absolute right-0 bottom-full mb-2 w-48 border rounded-lg shadow-xl py-1 z-30 text-[12px] ${
                  isDark ? 'bg-[#222228] border-neutral-700 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-700'
                }`}
              >
                {['Composer 2.5 Fast', 'Claude 3.7 Sonnet', 'GPT-4.5 Preview', 'Claude 3.5 Haiku'].map(
                  (model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model);
                        setIsModelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between cursor-pointer ${
                        isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
                      } ${selectedModel === model ? 'font-medium text-blue-500' : ''}`}
                    >
                      <span>{model}</span>
                      {selectedModel === model && <Check size={12} />}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Mic / send action button */}
          <button
            type="button"
            onClick={followUpText ? handleSendFollowUp : toggleVoice}
            disabled={isGenerating}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-xs ${
              isVoiceRecording
                ? 'bg-red-500 text-white animate-pulse'
                : isDark
                ? 'bg-white text-neutral-900 hover:bg-neutral-200'
                : 'bg-neutral-900 text-white hover:bg-black'
            }`}
            title={followUpText ? 'Send message' : 'Voice dictation'}
          >
            {isGenerating ? (
              <Loader2 size={12} className="animate-spin" />
            ) : followUpText ? (
              <Sparkles size={11} />
            ) : (
              <Mic size={12} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
