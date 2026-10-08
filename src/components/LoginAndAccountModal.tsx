import React, { useState } from 'react';
import {
  X,
  Check,
  Shield,
  Zap,
  Users,
  Key,
  LogOut,
  Mail,
  Github,
  Sparkles,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import avatarImg from '../assets/images/sualeh_avatar_1791421944193.jpg';

interface LoginAndAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    email: string;
    plan: string;
    avatar: string;
    fastRequestsUsed: number;
    fastRequestsLimit: number;
  };
  onLoginSuccess?: (user: { name: string; email: string }) => void;
  onLogout?: () => void;
  theme?: 'light' | 'dark';
  /** Real sign-in channel. Resolves with the signed-in user. */
  onProviderSignIn?: (provider: 'github' | 'google' | 'email', email?: string) => Promise<{ name: string; email: string }>;
  signInError?: string | null;
  teamLine?: string;
  resetLine?: string;
  geminiKeySet?: boolean;
  onSaveGeminiKey?: (key: string) => void;
  onClearGeminiKey?: () => void;
}

export const LoginAndAccountModal: React.FC<LoginAndAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  theme = 'light',
  onProviderSignIn,
  signInError,
  teamLine,
  resetLine,
  geminiKeySet,
  onSaveGeminiKey,
  onClearGeminiKey,
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'account' | 'signin'>('account');
  const [emailInput, setEmailInput] = useState('');
  const [customApiKeyEnabled, setCustomApiKeyEnabled] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const usagePercent = Math.round(
    (currentUser.fastRequestsUsed / Math.max(1, currentUser.fastRequestsLimit)) * 100
  );

  const handleDemoSignIn = (provider: 'github' | 'google' | 'email') => {
    if (!onProviderSignIn) return;
    setBusy(true);
    const email = provider === 'email' ? emailInput.trim() || undefined : undefined;
    void onProviderSignIn(provider, email)
      .then((user) => {
        onLoginSuccess?.(user);
        setActiveTab('account');
      })
      .catch(() => {
        /* error surfaces via signInError prop */
      })
      .finally(() => setBusy(false));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden ${
          isDark
            ? 'bg-[#18181c] border-neutral-700 text-neutral-100'
            : 'bg-white border-neutral-200 text-neutral-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div
          className={`h-11 px-4 border-b flex items-center justify-between ${
            isDark ? 'border-neutral-800 bg-[#1f1f25]' : 'border-neutral-200 bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-3 text-xs font-medium">
            <button
              onClick={() => setActiveTab('account')}
              className={`pb-0.5 transition-colors cursor-pointer ${
                activeTab === 'account'
                  ? 'border-b-2 border-blue-500 font-semibold text-neutral-900 dark:text-white'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Account & Usage
            </button>
            <button
              onClick={() => setActiveTab('signin')}
              className={`pb-0.5 transition-colors cursor-pointer ${
                activeTab === 'signin'
                  ? 'border-b-2 border-blue-500 font-semibold text-neutral-900 dark:text-white'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Sign In Portal
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tab 1: Account & Usage Details */}
        {activeTab === 'account' ? (
          <div className="p-4 space-y-4 text-xs">
            {/* User Profile Card */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-[#222228] border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar || avatarImg}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div>
                  <div className="font-semibold text-sm leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-semibold tracking-wide uppercase">
                {currentUser.plan}
              </span>
            </div>

            {/* Usage Quota Meter */}
            <div className="space-y-1.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-medium">
                  <Zap size={13} className="text-amber-500" />
                  <span>Fast Model Requests</span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                  {currentUser.fastRequestsUsed} / {currentUser.fastRequestsLimit}
                </span>
              </div>

              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10.5px] text-neutral-400 pt-0.5">
                <span>{resetLine ?? 'Resets monthly'}</span>
                <span>{usagePercent}% utilized</span>
              </div>
            </div>

            {/* Team & Workspace */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-neutral-400" />
                <span className="font-medium">Team Workspace</span>
              </div>
              <span className="text-neutral-500 font-mono text-[11px]">
                {teamLine ?? 'Personal workspace'}
              </span>
            </div>

            {/* API Keys Configuration Toggle */}
            <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key size={14} className="text-neutral-400" />
                  <div>
                    <div className="font-medium">Custom API Keys</div>
                    <div className="text-[10px] text-neutral-400">Your Gemini key, stored only in this browser</div>
                  </div>
                </div>
                <button
                  onClick={() => setCustomApiKeyEnabled(!customApiKeyEnabled)}
                  className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                    customApiKeyEnabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                      customApiKeyEnabled ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
              {customApiKeyEnabled && (
                geminiKeySet ? (
                  <div className="flex items-center justify-between rounded-md border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1.5">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Gemini key saved in this browser</span>
                    <button
                      className="text-[11px] text-neutral-500 underline-offset-2 hover:underline"
                      onClick={() => onClearGeminiKey?.()}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="AIza… (Google AI Studio key)"
                      autoComplete="off"
                      className="h-8 flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      className="h-8 px-2.5 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-semibold disabled:opacity-40"
                      disabled={!keyInput.trim()}
                      onClick={() => {
                        onSaveGeminiKey?.(keyInput.trim());
                        setKeyInput('');
                      }}
                    >
                      Save
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  setActiveTab('signin');
                }}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-red-500 transition-colors text-[11.5px] cursor-pointer"
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>

              <button
                onClick={onClose}
                className="px-3.5 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium text-xs shadow-xs cursor-pointer hover:opacity-90"
              >
                Close Settings
              </button>
            </div>
          </div>
        ) : (
          /* Tab 2: Sign In / Authentication Portal */
          <div className="p-5 space-y-4 text-xs">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black mx-auto flex items-center justify-center font-bold text-base shadow-sm">
                C
              </div>
              <h3 className="font-bold text-base mt-2">Sign in to Cursor</h3>
              <p className="text-xs text-neutral-500">
                Synchronize your Composer agent sessions, custom rules, and cloud settings.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleDemoSignIn('github')}
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 font-semibold text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Github size={15} />
                <span>{busy ? 'Working…' : 'Continue with GitHub'}</span>
              </button>

              <button
                disabled={busy}
                onClick={() => handleDemoSignIn('google')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 font-semibold text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-[10.5px] text-neutral-400">or with email</span>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            </div>

            {signInError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-[11px] text-red-600 dark:text-red-400">
                {signInError}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDemoSignIn('email');
              }}
              className="space-y-2"
            >
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              >
                Send Magic Link
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
