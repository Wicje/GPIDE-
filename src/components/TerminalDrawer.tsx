import React, { useState } from 'react';
import {
  Terminal,
  Activity,
  FileText,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle,
  Clock,
  Zap,
  TrendingDown,
  Cpu,
} from 'lucide-react';
import { INITIAL_BENCHMARK_DATA } from '../data/mockData';

interface TerminalDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  theme?: 'light' | 'dark';
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  isOpen,
  onToggle,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'terminal' | 'logs'>('benchmarks');
  const [benchmarks, setBenchmarks] = useState(INITIAL_BENCHMARK_DATA);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '❯ vitest run src/components/PaneContainer',
    '✓ src/components/PaneContainer/PaneTabBar.test.tsx (4 tests) 18ms',
    '✓ src/hooks/useResizeObserver.test.ts (2 tests) 8ms',
    '  Test Files  2 passed (2)',
    '       Tests  6 passed (6)',
    '    Duration  142ms',
    '❯ git diff --stat',
    ' 5 files changed, 98 insertions(+), 20 deletions(-)',
  ]);
  const [termInput, setTermInput] = useState('');

  const runBenchmark = () => {
    setIsBenchmarking(true);
    setTimeout(() => {
      const newLatency = Math.floor(38 + Math.random() * 8);
      setBenchmarks({
        ...benchmarks,
        p50Latency: `${newLatency}ms`,
        keystrokeAbortCount: benchmarks.keystrokeAbortCount + 12,
      });
      setIsBenchmarking(false);
    }, 800);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termInput.trim()) return;

    const cmd = termInput.trim();
    setTermInput('');
    setTerminalLogs((prev) => [...prev, `❯ ${cmd}`]);

    setTimeout(() => {
      if (cmd.includes('test') || cmd.includes('vitest')) {
        setTerminalLogs((prev) => [
          ...prev,
          '✓ All tests passing! 6 passed in 118ms.',
        ]);
      } else if (cmd.includes('status')) {
        setTerminalLogs((prev) => [
          ...prev,
          'On branch erik/scm-pane-features',
          'Changes not staged for commit: 5 files',
        ]);
      } else if (cmd.includes('bench')) {
        setTerminalLogs((prev) => [
          ...prev,
          'ghost-text pipeline: p50 42ms (-40%), multi-line preview 60fps.',
        ]);
      } else {
        setTerminalLogs((prev) => [
          ...prev,
          `command executed successfully: ${cmd}`,
        ]);
      }
    }, 400);
  };

  return (
    <div
      className={`border-t transition-all duration-200 select-none ${
        isOpen ? 'h-48' : 'h-7'
      } flex flex-col ${
        isDark ? 'bg-[#18181b] border-neutral-800 text-neutral-300' : 'bg-[#fbfbfd] border-[#e5e5e7] text-neutral-700'
      }`}
    >
      {/* Drawer Header Tabs */}
      <div
        className={`h-7 px-3 flex items-center justify-between border-b text-[11px] font-medium ${
          isDark ? 'border-neutral-800 bg-[#141416]' : 'border-[#e5e5e7] bg-[#f4f4f6]'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setActiveTab('benchmarks');
              if (!isOpen) onToggle();
            }}
            className={`flex items-center gap-1.5 pb-0.5 transition-colors cursor-pointer ${
              activeTab === 'benchmarks' && isOpen
                ? isDark
                  ? 'text-white border-b-2 border-blue-500 font-semibold'
                  : 'text-neutral-900 border-b-2 border-blue-600 font-semibold'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Activity size={12} className="text-emerald-500" />
            <span>Benchmarks & Latency</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('terminal');
              if (!isOpen) onToggle();
            }}
            className={`flex items-center gap-1.5 pb-0.5 transition-colors cursor-pointer ${
              activeTab === 'terminal' && isOpen
                ? isDark
                  ? 'text-white border-b-2 border-blue-500 font-semibold'
                  : 'text-neutral-900 border-b-2 border-blue-600 font-semibold'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Terminal size={12} className="text-blue-500" />
            <span>Terminal (zsh)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('logs');
              if (!isOpen) onToggle();
            }}
            className={`flex items-center gap-1.5 pb-0.5 transition-colors cursor-pointer ${
              activeTab === 'logs' && isOpen
                ? isDark
                  ? 'text-white border-b-2 border-blue-500 font-semibold'
                  : 'text-neutral-900 border-b-2 border-blue-600 font-semibold'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <FileText size={12} className="text-purple-500" />
            <span>Telemetry</span>
          </button>
        </div>

        {/* Toggle Collapse */}
        <button
          onClick={onToggle}
          className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded cursor-pointer"
          title={isOpen ? 'Collapse drawer' : 'Expand drawer'}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {/* Drawer Content */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-3 text-xs">
          {activeTab === 'benchmarks' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                    Ghost-Text Pipeline Telemetry
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-medium">
                    Healthy
                  </span>
                </div>
                <button
                  onClick={runBenchmark}
                  disabled={isBenchmarking}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-xs transition-colors text-[11px]"
                >
                  <Play size={11} className={isBenchmarking ? 'animate-spin' : ''} />
                  <span>{isBenchmarking ? 'Running...' : 'Run Benchmark'}</span>
                </button>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className={`p-2.5 rounded-lg border ${
                  isDark ? 'bg-[#202025] border-neutral-700' : 'bg-white border-neutral-200'
                }`}>
                  <div className="flex items-center justify-between text-neutral-400 text-[10.5px]">
                    <span>p50 Latency</span>
                    <TrendingDown size={12} className="text-emerald-500" />
                  </div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {benchmarks.p50Latency}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Down {benchmarks.latencyReduction} vs baseline
                  </div>
                </div>

                <div className={`p-2.5 rounded-lg border ${
                  isDark ? 'bg-[#202025] border-neutral-700' : 'bg-white border-neutral-200'
                }`}>
                  <div className="flex items-center justify-between text-neutral-400 text-[10.5px]">
                    <span>Preview Render</span>
                    <Zap size={12} className="text-amber-500" />
                  </div>
                  <div className="text-base font-bold text-neutral-800 dark:text-white mt-1">
                    {benchmarks.previewFps}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Zero layout shifts
                  </div>
                </div>

                <div className={`p-2.5 rounded-lg border ${
                  isDark ? 'bg-[#202025] border-neutral-700' : 'bg-white border-neutral-200'
                }`}>
                  <div className="flex items-center justify-between text-neutral-400 text-[10.5px]">
                    <span>Stale Aborts</span>
                    <Clock size={12} className="text-blue-500" />
                  </div>
                  <div className="text-base font-bold text-neutral-800 dark:text-white mt-1">
                    {benchmarks.keystrokeAbortCount}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Clean debounce cleanup
                  </div>
                </div>

                <div className={`p-2.5 rounded-lg border ${
                  isDark ? 'bg-[#202025] border-neutral-700' : 'bg-white border-neutral-200'
                }`}>
                  <div className="flex items-center justify-between text-neutral-400 text-[10.5px]">
                    <span>Memory Footprint</span>
                    <Cpu size={12} className="text-purple-500" />
                  </div>
                  <div className="text-base font-bold text-neutral-800 dark:text-white mt-1">
                    {benchmarks.memoryFootprint}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Cache hit: {benchmarks.cacheHitRatio}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="h-full flex flex-col justify-between font-code text-[11.5px]">
              <div className="space-y-0.5 overflow-y-auto max-h-28">
                {terminalLogs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.startsWith('✓')
                        ? 'text-emerald-500'
                        : log.startsWith('❯')
                        ? 'text-neutral-400 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>

              <form onSubmit={handleCommand} className="flex items-center gap-1.5 pt-1.5 border-t border-neutral-200/50 dark:border-neutral-800">
                <span className="text-emerald-500 font-bold">❯</span>
                <input
                  type="text"
                  value={termInput}
                  onChange={(e) => setTermInput(e.target.value)}
                  placeholder="type 'test', 'status', 'bench' or any command..."
                  className="flex-1 bg-transparent focus:outline-none text-neutral-800 dark:text-neutral-100 placeholder-neutral-400"
                />
              </form>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-1 font-code text-[11px] text-neutral-600 dark:text-neutral-400">
              <div>[18:11:02] [AGENT] Initiated AST parser for PaneTabBar.tsx</div>
              <div>[18:11:04] [PIPELINE] Detected debounce race condition in useGhostCompletion.ts</div>
              <div>[18:11:07] [OPTIMIZER] Replaced multi-line token renderer with virtualized range</div>
              <div>[18:11:09] [BENCHMARK] Suggestion roundtrip: 42.1ms (previous: 70.4ms)</div>
              <div>[18:11:10] [STATUS] Flag `cursor.ghost_pipeline_v2` activated on nightly</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
