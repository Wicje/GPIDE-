import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Target,
  Sparkles,
  Terminal,
  CheckCircle2,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { DeviceViewport } from '../types';

interface LiveAppPreviewPaneProps {
  onInspectElement: (elementInfo: { component: string; file: string; line: number }) => void;
  onSwitchToDiff: () => void;
  theme?: 'light' | 'dark';
}

export const LiveAppPreviewPane: React.FC<LiveAppPreviewPaneProps> = ({
  onInspectElement,
  onSwitchToDiff,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tab-1');
  const [isCompact, setIsCompact] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[HMR] Connected to Vite development server.',
    '[PaneContainer] Mounted with 3 active pinned tabs.',
    '[GhostTextEngine] Initialized with p50 latency threshold: 42ms.',
  ]);

  const handleElementClick = (component: string, file: string, line: number) => {
    if (isInspectMode) {
      onInspectElement({ component, file, line });
      setIsInspectMode(false);
    }
  };

  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px] h-[640px]';
      case 'tablet':
        return 'max-w-[768px] h-[600px]';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col justify-between overflow-hidden select-none text-[13px] transition-colors ${
        isDark ? 'bg-[#18181b] text-neutral-200' : 'bg-[#f8f8fa] text-neutral-800'
      }`}
    >
      {/* Top Browser Bar */}
      <div
        className={`h-10 px-3.5 border-b flex items-center justify-between ${
          isDark ? 'border-neutral-800 bg-[#161619]' : 'border-[#e5e5e7] bg-white'
        }`}
      >
        {/* Left: URL Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[11.5px] font-mono text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>localhost:3000/preview</span>
          </div>

          <button
            onClick={() => setConsoleLogs((prev) => [...prev, `[HMR] Reloaded at ${new Date().toLocaleTimeString()}`])}
            className="p-1 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer text-neutral-400"
            title="Hot Reload Preview"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1 rounded transition-colors cursor-pointer ${
              viewport === 'desktop'
                ? isDark
                  ? 'bg-neutral-700 text-white'
                  : 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
            title="Desktop (100%)"
          >
            <Monitor size={13} />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1 rounded transition-colors cursor-pointer ${
              viewport === 'tablet'
                ? isDark
                  ? 'bg-neutral-700 text-white'
                  : 'bg-white text-neutral-900 shadow-xs'
            : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
            title="Tablet (768px)"
          >
            <Tablet size={13} />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1 rounded transition-colors cursor-pointer ${
              viewport === 'mobile'
                ? isDark
                  ? 'bg-neutral-700 text-white'
                  : 'bg-white text-neutral-900 shadow-xs'
            : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone size={13} />
          </button>
        </div>

        {/* Right: Inspect Element & Console */}
        <div className="flex items-center gap-2">
          {/* Inspect Mode Toggle */}
          <button
            onClick={() => setIsInspectMode(!isInspectMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors cursor-pointer border ${
              isInspectMode
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm animate-pulse'
                : isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                : 'bg-white border-neutral-300 text-neutral-700 hover:text-neutral-900'
            }`}
            title="Click an element to inspect and send to Composer"
          >
            <Target size={13} />
            <span>{isInspectMode ? 'Click an element...' : 'Inspect'}</span>
          </button>

          <button
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className={`p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer ${
              isConsoleOpen ? 'text-blue-500' : ''
            }`}
            title="Toggle Browser Console"
          >
            <Terminal size={14} />
          </button>
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div
          className={`transition-all duration-300 rounded-xl overflow-hidden shadow-xl border ${
            isDark ? 'bg-[#1e1e24] border-neutral-700' : 'bg-white border-neutral-200'
          } ${getContainerWidth()} flex flex-col`}
        >
          {/* Simulated App Header */}
          <div
            className={`h-11 px-4 border-b flex items-center justify-between transition-colors ${
              isInspectMode && hoveredElement === 'PaneTabBar'
                ? 'ring-2 ring-blue-500 bg-blue-500/10'
                : isDark
                ? 'border-neutral-800 bg-[#222228]'
                : 'border-neutral-200 bg-neutral-50'
            }`}
            onMouseEnter={() => setHoveredElement('PaneTabBar')}
            onMouseLeave={() => setHoveredElement(null)}
            onClick={() => handleElementClick('<PaneTabBar />', 'src/components/PaneContainer/PaneTabBar.tsx', 9)}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs tracking-tight">App Workspace</span>
              <span className="text-[10px] text-neutral-400 font-mono">v0.42.0</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCompact(!isCompact);
                }}
                className="text-[11px] px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {isCompact ? 'Compact: ON' : 'Compact: OFF'}
              </button>
            </div>
          </div>

          {/* Interactive Live Tabs Bar (Reflected component) */}
          <div
            className={`px-3 py-2 border-b flex items-center gap-1.5 overflow-x-auto transition-colors ${
              isInspectMode && hoveredElement === 'PinnedTabItem'
                ? 'ring-2 ring-blue-500 bg-blue-500/10'
                : isDark
                ? 'border-neutral-800 bg-[#1a1a1e]'
                : 'border-neutral-100 bg-[#fafafc]'
            }`}
            onMouseEnter={() => setHoveredElement('PinnedTabItem')}
            onMouseLeave={() => setHoveredElement(null)}
            onClick={() => handleElementClick('<PinnedTabItem />', 'src/components/PaneContainer/PaneTabBar.tsx', 19)}
          >
            {['Overview', 'Ghost Pipeline', 'Benchmark Matrix', 'Settings'].map((title, idx) => {
              const tabKey = `tab-${idx}`;
              const isActive = activeTab === tabKey;
              return (
                <div
                  key={tabKey}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isInspectMode) setActiveTab(tabKey);
                    else handleElementClick(`<PinnedTabItem title="${title}" />`, 'src/components/PaneContainer/PaneTabBar.tsx', 19);
                  }}
                  className={`flex items-center justify-center self-stretch ${
                    isCompact ? 'px-2 py-1' : 'px-3 py-1.5'
                  } rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
                      : isDark
                      ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                  }`}
                >
                  <span>{title}</span>
                </div>
              );
            })}
          </div>

          {/* Tab Content Canvas */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Ghost-Text Latency Benchmarks
              </h2>
              <p className="text-xs text-neutral-500">
                Live rendering of components modified in branch <code className="font-mono text-blue-500">erik/scm-pane-features</code>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#25252c] border-neutral-700' : 'bg-neutral-50 border-neutral-200'}`}>
                <div className="text-neutral-400 text-xs">P50 Latency</div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  42ms (-40%)
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Below 50ms nightly SLA</div>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#25252c] border-neutral-700' : 'bg-neutral-50 border-neutral-200'}`}>
                <div className="text-neutral-400 text-xs">Multi-Line Render</div>
                <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                  60 FPS
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Hardware accelerated</div>
              </div>
            </div>

            {/* Inspect Tooltip Banner */}
            {isInspectMode && (
              <div className="p-3 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-between shadow-lg animate-bounce">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} />
                  <span>Inspect mode active. Click any component above to ask Composer to edit it.</span>
                </div>
                <button
                  onClick={() => setIsInspectMode(false)}
                  className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded text-[11px]"
                >
                  Exit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Console Drawer */}
      {isConsoleOpen && (
        <div
          className={`h-28 border-t p-2.5 font-code text-[11px] space-y-1 overflow-y-auto ${
            isDark ? 'bg-black/80 border-neutral-800 text-neutral-300' : 'bg-neutral-900 text-neutral-200 border-neutral-800'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-400 text-[10px] pb-1 border-b border-neutral-800">
            <span>BROWSER CONSOLE</span>
            <button onClick={() => setConsoleLogs([])} className="hover:text-white">
              Clear
            </button>
          </div>
          {consoleLogs.map((log, i) => (
            <div key={i} className="leading-tight">{log}</div>
          ))}
        </div>
      )}
    </div>
  );
};
