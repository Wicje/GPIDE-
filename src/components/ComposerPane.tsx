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
  ChevronRight,
  Mic,
  Sparkles,
  Loader2,
  RotateCcw,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  AtSign,
  Shield,
  Layers,
  Clock,
  Brain,
  Pause,
  X,
} from 'lucide-react';
import { SessionData, AgentStep, AgentPhase, ToolApprovalRequest, AttachedContext } from '../types';
import screenRecThumb from '../assets/images/screen_recording_thumb_1791421930526.jpg';

interface ComposerPaneProps {
  session: SessionData;
  onOpenVideoModal: () => void;
  onCommitPush: () => void;
  onReviewClick: () => void;
  onGenerateEdits: (promptText: string) => void;
  onRollbackCheckpoint?: (checkpointId: string, stepTitle: string) => void;
  onOpenRules?: () => void;
  isGenerating?: boolean;
  theme?: 'light' | 'dark';
}

export const ComposerPane: React.FC<ComposerPaneProps> = ({
  session,
  onOpenVideoModal,
  onCommitPush,
  onReviewClick,
  onGenerateEdits,
  onRollbackCheckpoint,
  onOpenRules,
  isGenerating = false,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [selectedModel, setSelectedModel] = useState(session.model || 'Composer 2.5 Fast');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [expandedStepId, setExpandedStepId] = useState<string | null>('s-1');

  // Extended Thinking / Chain of Thought Drawer
  const [isThinkingOpen, setIsThinkingOpen] = useState(true);

  // Agentic Loop State
  const [isExecutionGraphOpen, setIsExecutionGraphOpen] = useState(false);
  const [isAgentPaused, setIsAgentPaused] = useState(false);

  // Attached Context Chips
  const [attachedContexts, setAttachedContexts] = useState<AttachedContext[]>([
    { id: 'c-1', name: 'PaneTabBar.tsx', type: 'file', tokens: 420 },
    { id: 'c-2', name: 'git-diff', type: 'git', tokens: 180 },
  ]);
  const [isMentionMenuOpen, setIsMentionMenuOpen] = useState(false);

  // Tool Approval Gate State
  const [approvalRequest, setApprovalRequest] = useState<ToolApprovalRequest | null>({
    id: 'req-1',
    tool: 'bash',
    command: 'npm install @tanstack/react-virtual --save',
    riskLevel: 'medium',
    status: 'pending',
  });

  const agentPhases: AgentPhase[] = [
    { id: 'p-1', name: 'Discovery & Symbol Indexing', status: 'completed', duration: '14ms', tokens: 320, details: 'Indexed 14 AST files in PaneContainer' },
    { id: 'p-2', name: 'Reproduction & Benchmark Profiling', status: 'completed', duration: '42ms', tokens: 410, details: 'Detected cancellation race in useGhostCompletion' },
    { id: 'p-3', name: 'Multi-File Code Synthesis', status: 'completed', duration: '98ms', tokens: 690, details: 'Synthesized 5 files (+98, -20)' },
    { id: 'p-4', name: 'Regression Suite & Vitest Run', status: isGenerating ? 'running' : 'queued', duration: 'Pending', tokens: 0, details: 'Verifying tests across test explorer' },
  ];

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

  const toggleStepExpand = (stepId: string) => {
    setExpandedStepId((prev) => (prev === stepId ? null : stepId));
  };

  const addMentionContext = (name: string, type: 'file' | 'git' | 'doc') => {
    setAttachedContexts((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, name, type, tokens: 240 },
    ]);
    setIsMentionMenuOpen(false);
  };

  return (
    <div className="h-full flex flex-col justify-between select-none text-[13px] transition-colors">
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

        <div className="flex items-center gap-1.5">
          {onOpenRules && (
            <button
              onClick={onOpenRules}
              className="text-neutral-400 hover:text-purple-500 transition-colors p-1 rounded text-[11px] flex items-center gap-1 cursor-pointer"
              title="Project .cursorrules"
            >
              <FileCode size={13} />
              <span className="hidden sm:inline font-mono">.rules</span>
            </button>
          )}

          <button
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-1 rounded cursor-pointer"
            title="Collapse pane"
          >
            <PanelRightClose size={14} />
          </button>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
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

        {/* Feature 5: Collapsible Extended Chain-of-Thought (Frontier Thinking Drawer) */}
        <div
          className={`rounded-xl border overflow-hidden transition-all ${
            isDark ? 'bg-[#1c1c22] border-neutral-700/80' : 'bg-neutral-50/80 border-neutral-200'
          }`}
        >
          <div
            onClick={() => setIsThinkingOpen(!isThinkingOpen)}
            className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-neutral-500/5 select-none"
          >
            <div className="flex items-center gap-2 text-xs">
              <Brain size={14} className="text-purple-500 shrink-0" />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                Thought for 14 seconds
              </span>
            </div>

            <div className="flex items-center gap-1 text-neutral-400">
              <span className="text-[10px] font-mono">CoT</span>
              {isThinkingOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </div>
          </div>

          {isThinkingOpen && (
            <div className="px-3 pb-3 pt-1 border-t border-neutral-200/50 dark:border-neutral-800/80 font-mono text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400 space-y-1.5 animate-fadeIn">
              <div className="text-purple-600 dark:text-purple-400 font-semibold">
                &gt; Analyzing ghost-text suggestion rendering path...
              </div>
              <div className="pl-2 border-l border-neutral-300 dark:border-neutral-700 space-y-1">
                <div>• Parsed AST for PaneTabBar.tsx and useGhostCompletion.ts.</div>
                <div>• Identified concurrency bug: keystroke handler dispatches async query without invalidating prior promise.</div>
                <div>• Solution: Bind AbortController signal; replace multi-line overlay with inline virtualized range.</div>
                <div>• Benchmark verification: p50 latency down 40% (42ms vs 70ms baseline). Zero layout shift observed.</div>
              </div>
            </div>
          )}
        </div>

        {/* Autonomous Multi-Phase Execution Graph */}
        <div
          className={`rounded-xl border overflow-hidden transition-all ${
            isDark ? 'bg-[#202025] border-neutral-700' : 'bg-[#fafafc] border-neutral-200'
          }`}
        >
          <div
            onClick={() => setIsExecutionGraphOpen(!isExecutionGraphOpen)}
            className="px-3 py-2 flex items-center justify-between cursor-pointer border-b border-neutral-200/50 dark:border-neutral-700"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-xs tracking-tight">Agent Execution Graph</span>
              <span className="text-[10px] text-neutral-400 font-mono">DAG (4 Phases)</span>
            </div>

            <div className="flex items-center gap-2 text-neutral-400">
              <span className="text-[10px] font-mono">1.4k tok</span>
              {isExecutionGraphOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </div>
          </div>

          {isExecutionGraphOpen && (
            <div className="p-3 space-y-2 text-xs">
              {agentPhases.map((phase) => (
                <div key={phase.id} className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {phase.status === 'completed' ? (
                      <CheckCircle2 size={13} className="text-emerald-500" />
                    ) : phase.status === 'running' ? (
                      <Loader2 size={13} className="text-blue-500 animate-spin" />
                    ) : (
                      <Clock size={13} className="text-neutral-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11.5px]">
                      <span className={`font-medium ${phase.status === 'completed' ? 'text-neutral-700 dark:text-neutral-300' : 'text-blue-500 font-semibold'}`}>
                        {phase.name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">{phase.duration}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">{phase.details}</div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 dark:border-neutral-700 text-[11px]">
                <div className="text-neutral-400 font-mono text-[10.5px]">
                  Compute: 3.8s • $0.003
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsAgentPaused(!isAgentPaused)}
                    className="px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    {isAgentPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    onClick={() => onGenerateEdits('Verify debounce cleanup')}
                    className="px-2 py-0.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-500 cursor-pointer"
                  >
                    Step-Over
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tool Approval Gate */}
        {approvalRequest && approvalRequest.status === 'pending' && (
          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
                <AlertTriangle size={14} />
                <span>Tool Approval Required</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono font-medium">
                {approvalRequest.riskLevel.toUpperCase()} RISK
              </span>
            </div>

            <p className="text-[11.5px] text-neutral-700 dark:text-neutral-300">
              Agent requested permission to execute shell tool:
            </p>
            <div className="p-2 rounded bg-black/60 text-white font-code text-[11px] truncate">
              {approvalRequest.command}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setApprovalRequest(null)}
                className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px]"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setApprovalRequest({ ...approvalRequest, status: 'approved' });
                  onGenerateEdits('Installed @tanstack/react-virtual');
                }}
                className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-[11px] shadow-xs cursor-pointer"
              >
                Allow Once
              </button>
            </div>
          </div>
        )}

        {/* Action Steps */}
        <div className="space-y-1.5 text-[12.5px]">
          {session.steps.map((step) => {
            const isExpanded = expandedStepId === step.id;

            return (
              <div
                key={step.id}
                className={`rounded-lg transition-colors border ${
                  isExpanded
                    ? isDark
                      ? 'bg-[#202025] border-neutral-700 p-2.5'
                      : 'bg-neutral-50/80 border-neutral-300 p-2.5 shadow-2xs'
                    : 'border-transparent hover:bg-neutral-500/5 px-1 py-0.5'
                }`}
              >
                <div
                  onClick={() => toggleStepExpand(step.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 font-medium min-w-0">
                    <span className="text-neutral-400">
                      {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </span>
                    <span className={`font-semibold capitalize ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {step.type}
                    </span>
                    <span className="text-neutral-500 font-normal truncate">
                      {step.query}
                    </span>
                  </div>

                  {step.durationMs && (
                    <span className="text-[10.5px] font-mono text-neutral-400 shrink-0 ml-1">
                      {step.durationMs}ms
                    </span>
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-2.5 pt-2 border-t border-neutral-200/60 dark:border-neutral-700 space-y-2 text-xs">
                    {step.details && (
                      <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400">
                        {step.details}
                      </p>
                    )}

                    {step.matches && step.matches.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                          Matched Locations ({step.matches.length})
                        </span>
                        {step.matches.map((m, mi) => (
                          <div
                            key={mi}
                            className={`p-1.5 rounded font-code text-[11px] leading-tight ${
                              isDark ? 'bg-[#18181c] text-neutral-300' : 'bg-white border border-neutral-200 text-neutral-700'
                            }`}
                          >
                            <div className="text-[10px] text-blue-500 truncate mb-0.5">
                              {m.file}:{m.line}
                            </div>
                            <div className="truncate text-neutral-500">{m.preview}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {onRollbackCheckpoint && step.checkpointId && (
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10.5px] text-neutral-400 flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-500" />
                          <span>Snapshot: {step.checkpointId}</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRollbackCheckpoint(step.checkpointId!, `${step.type}: ${step.query}`);
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                            isDark
                              ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                              : 'bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700'
                          }`}
                        >
                          <RotateCcw size={10} />
                          <span>Roll back to step</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feature 3: Real-Time Animated Left Gutter Glow in Agent Response */}
        <div className={`p-3 rounded-xl border-l-3 border-emerald-500 space-y-2 transition-all ${
          isDark ? 'bg-[#1e1e24] shadow-[0_0_15px_rgba(16,185,129,0.08)]' : 'bg-emerald-500/5 border-emerald-500 shadow-2xs'
        }`}>
          <p className={isDark ? 'text-neutral-200' : 'text-neutral-800'}>
            {session.response}
          </p>
          {session.processedItem && (
            <div className="flex items-center gap-1.5 text-[12.5px]">
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Processed
              </span>
              <span className="text-neutral-500 font-normal">{session.processedItem}</span>
            </div>
          )}
        </div>

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
              <div className="w-10 h-10 rounded-full bg-neutral-900/75 backdrop-blur-xs text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110 pl-0.5">
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
            <button className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-0.5 cursor-pointer">
              <MoreHorizontal size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls, Context Chips & Follow-up Input */}
      <div
        className={`p-3 border-t space-y-2.5 ${
          isDark ? 'border-neutral-800 bg-[#18181b]' : 'border-[#e5e5e7] bg-white'
        }`}
      >
        {/* Review Action Buttons */}
        <div className="flex items-center gap-2">
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

        {/* Attached Context Chips Bar */}
        {attachedContexts.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {attachedContexts.map((ctx) => (
              <div
                key={ctx.id}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-mono border ${
                  isDark
                    ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-700'
                }`}
              >
                <span>@{ctx.name}</span>
                <span className="text-neutral-400">({ctx.tokens}t)</span>
                <button
                  onClick={() => setAttachedContexts(attachedContexts.filter((c) => c.id !== ctx.id))}
                  className="hover:text-red-500 ml-0.5"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Bar with Context Mention Button */}
        <form
          onSubmit={handleSendFollowUp}
          className={`relative flex items-center justify-between pl-2 pr-1.5 py-1.5 rounded-full border shadow-2xs transition-all ${
            isDark
              ? 'bg-[#222227] border-neutral-700 focus-within:border-blue-500'
              : 'bg-white border-[#dcdcde] focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200/50'
          }`}
        >
          {/* @ Mention Popover Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMentionMenuOpen(!isMentionMenuOpen)}
              className="w-5 h-5 rounded-full flex items-center justify-center text-neutral-400 hover:text-purple-500 transition-colors cursor-pointer"
              title="Attach context (@)"
            >
              <AtSign size={13} />
            </button>

            {isMentionMenuOpen && (
              <div
                className={`absolute left-0 bottom-full mb-2 w-48 border rounded-xl shadow-xl py-1 z-30 text-[11.5px] ${
                  isDark ? 'bg-[#222228] border-neutral-700 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-700'
                }`}
              >
                <div className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase">
                  Attach Context
                </div>
                <button
                  type="button"
                  onClick={() => addMentionContext('PaneTabBar.tsx', 'file')}
                  className="w-full text-left px-2.5 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between"
                >
                  <span>@PaneTabBar.tsx</span>
                  <span className="text-neutral-400 text-[10px]">file</span>
                </button>
                <button
                  type="button"
                  onClick={() => addMentionContext('useResizeObserver.ts', 'file')}
                  className="w-full text-left px-2.5 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between"
                >
                  <span>@useResizeObserver.ts</span>
                  <span className="text-neutral-400 text-[10px]">file</span>
                </button>
                <button
                  type="button"
                  onClick={() => addMentionContext('git-diff', 'git')}
                  className="w-full text-left px-2.5 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between"
                >
                  <span>@git-diff</span>
                  <span className="text-neutral-400 text-[10px]">git</span>
                </button>
              </div>
            )}
          </div>

          {/* Follow up text input */}
          <input
            type="text"
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            disabled={isGenerating}
            placeholder={isGenerating ? 'Synthesizing code...' : 'Send follow-up or type @'}
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
