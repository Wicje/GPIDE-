import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  X,
  Play,
  Copy,
  Check,
  Split,
  Maximize2,
  FileText,
  Save,
  Zap,
  Sparkles,
  Command,
  RotateCcw,
  CheckCircle2,
  CornerDownLeft,
} from 'lucide-react';
import { ProjectFile } from '../types';

interface CodeEditorPaneProps {
  files: ProjectFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCloseFile?: (fileId: string) => void;
  onSwitchToDiff: () => void;
  theme?: 'light' | 'dark';
}

export const CodeEditorPane: React.FC<CodeEditorPaneProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCloseFile,
  onSwitchToDiff,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [openTabs, setOpenTabs] = useState<string[]>(['f-tab-bar', 'f-resize-obs']);
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [foldedLines, setFoldedLines] = useState<Record<number, boolean>>({});

  // In-Editor Inline ⌘K Prompt State
  const [inlineKOpen, setInlineKOpen] = useState(false);
  const [inlineKTargetLine, setInlineKTargetLine] = useState<number>(13);
  const [inlineKPrompt, setInlineKPrompt] = useState('');
  const [inlineKDiffHunk, setInlineKDiffHunk] = useState<{
    original: string;
    suggested: string;
  } | null>(null);

  // Live Ghost-Text Inline Autocomplete Engine state
  const [ghostTextSuggestion, setGhostTextSuggestion] = useState<string | null>(
    'const debouncedUpdate = debounceCompletion(updateLayoutDimensions, 35);'
  );
  const [ghostAccepted, setGhostAccepted] = useState(false);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  // Keyboard shortcut listener inside editor (⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setInlineKOpen((prev) => !prev);
        if (!inlineKOpen) {
          setInlineKDiffHunk(null);
        }
      }
      if (inlineKDiffHunk) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
          e.preventDefault();
          handleAcceptInlineK();
        }
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
          e.preventDefault();
          handleRejectInlineK();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inlineKOpen, inlineKDiffHunk]);

  const handleTabClick = (fileId: string) => {
    if (!openTabs.includes(fileId)) {
      setOpenTabs((prev) => [...prev, fileId]);
    }
    onSelectFile(fileId);
  };

  const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    const newTabs = openTabs.filter((id) => id !== fileId);
    setOpenTabs(newTabs);
    if (activeFileId === fileId && newTabs.length > 0) {
      onSelectFile(newTabs[newTabs.length - 1]);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcceptGhostText = () => {
    setGhostAccepted(true);
    setGhostTextSuggestion(null);
  };

  const toggleFold = (lineNum: number) => {
    setFoldedLines((prev) => ({ ...prev, [lineNum]: !prev[lineNum] }));
  };

  // Submit in-editor ⌘K prompt
  const handleInlineKSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineKPrompt.trim()) return;

    // Simulate instant streaming inline diff
    setInlineKDiffHunk({
      original: '    const iconSize = isCompact ? 14 : 16;',
      suggested: '    const iconSize = useMemo(() => (isCompact ? 14 : 16), [isCompact]);',
    });
  };

  const handleAcceptInlineK = () => {
    setInlineKDiffHunk(null);
    setInlineKOpen(false);
    setInlineKPrompt('');
  };

  const handleRejectInlineK = () => {
    setInlineKDiffHunk(null);
    setInlineKPrompt('');
  };

  const colorizeSyntax = (str: string, dark: boolean) => {
    if (!str) return <span>&nbsp;</span>;
    const tokens = str.split(
      /(\b(?:const|let|var|return|function|export|import|from|type|interface|if|else|any|void|boolean|number|string|true|false)\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[\s\S]*?`|\b(?:useMemo|useCallback|useRef|useEffect|useState|useResizeObserver|PinnedTabItem|setHovered)\b|<\/?[a-zA-Z0-9_-]+|\b(?:className|title|onMouseEnter|onMouseLeave|isCompact|isPinned|tab|isActive|onTabClick|ref|callback)\b|[{}():;=,])/g
    );

    return tokens.map((tok, i) => {
      if (!tok) return null;
      if (['const', 'let', 'var', 'return', 'function', 'export', 'import', 'from', 'type', 'interface', 'if', 'else'].includes(tok)) {
        return <span key={i} className={`${dark ? 'text-[#ff7b72]' : 'text-[#cf222e]'} font-medium`}>{tok}</span>;
      }
      if (tok.startsWith('"') || tok.startsWith("'") || tok.startsWith('`')) {
        return <span key={i} className={dark ? 'text-[#a5d6ff]' : 'text-[#0a3069]'}>{tok}</span>;
      }
      if (['useMemo', 'useCallback', 'useRef', 'useEffect', 'useState', 'useResizeObserver', 'PinnedTabItem', 'setHovered'].includes(tok)) {
        return <span key={i} className={dark ? 'text-[#d2a8ff]' : 'text-[#6f42c1]'}>{tok}</span>;
      }
      if (tok.startsWith('<')) {
        return <span key={i} className={`${dark ? 'text-[#7ee787]' : 'text-[#116329]'} font-medium`}>{tok}</span>;
      }
      if (['boolean', 'number', 'string', 'any', 'void', 'true', 'false'].includes(tok)) {
        return <span key={i} className={dark ? 'text-[#79c0ff]' : 'text-[#0550ae]'}>{tok}</span>;
      }
      return <span key={i} className={dark ? 'text-neutral-300' : 'text-neutral-800'}>{tok}</span>;
    });
  };

  const lines = activeFile.content.split('\n');

  return (
    <div
      className={`flex-1 flex flex-col justify-between overflow-hidden select-none text-[13px] transition-colors ${
        isDark ? 'bg-[#1e1e24] text-neutral-200' : 'bg-white text-neutral-800'
      }`}
    >
      {/* Top Header Bar */}
      <div
        className={`h-10 px-3.5 border-b flex items-center justify-between ${
          isDark ? 'border-neutral-800 bg-[#18181b]' : 'border-[#e5e5e7] bg-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToDiff}
            className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:text-neutral-900'
            }`}
          >
            <Split size={13} />
            <span>Switch to SCM Diff View</span>
          </button>

          <div className="h-3.5 w-px bg-neutral-200 dark:bg-neutral-800" />

          <button
            onClick={() => setIsFileTreeOpen(!isFileTreeOpen)}
            className={`text-xs px-2 py-0.5 rounded transition-colors cursor-pointer ${
              isFileTreeOpen
                ? isDark
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-blue-600 bg-blue-50'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Explorer
          </button>
        </div>

        {/* Live Ghost Autocomplete Status & Trigger ⌘K */}
        <div className="flex items-center gap-2">
          {/* Trigger ⌘K in editor */}
          <button
            onClick={() => setInlineKOpen(!inlineKOpen)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
              inlineKOpen
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                : 'bg-neutral-50 border-neutral-300 text-neutral-700 hover:text-neutral-900'
            }`}
            title="Open Inline Composer (⌘K)"
          >
            <Sparkles size={11} className={inlineKOpen ? 'text-white' : 'text-purple-500'} />
            <span>Inline ⌘K</span>
          </button>

          <div className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Zap size={11} />
            <span>Ghost: 38ms</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 transition-colors cursor-pointer"
            title={copied ? 'Copied code!' : 'Copy full file code'}
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Main Body: File Tree + Tabs + Breadcrumbs + Editor + Minimap */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Explorer */}
        {isFileTreeOpen && (
          <div
            className={`w-52 shrink-0 border-r flex flex-col justify-between overflow-y-auto text-xs ${
              isDark ? 'bg-[#161619] border-neutral-800' : 'bg-[#fbfbfd] border-[#e5e5e7]'
            }`}
          >
            <div className="p-2 space-y-1">
              <div className="px-1.5 py-1 text-[10.5px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <ChevronDown size={12} />
                <span>workspace / src</span>
              </div>

              <div className="space-y-0.5 pl-1.5">
                {files.map((file) => {
                  const isSelected = activeFileId === file.id;
                  return (
                    <button
                      key={file.id}
                      onClick={() => handleTabClick(file.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[12px] transition-colors text-left cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-blue-600/25 text-white font-medium'
                            : 'bg-neutral-200/80 text-neutral-900 font-medium'
                          : isDark
                          ? 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                          : 'text-neutral-600 hover:bg-black/5 hover:text-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FileCode size={13} className={file.name.endsWith('.tsx') ? 'text-blue-500' : 'text-amber-500'} />
                        <span className="truncate">{file.name}</span>
                      </div>
                      {file.isModified && (
                        <span className="text-[10px] text-amber-500 font-bold ml-1">
                          M
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`p-2 border-t text-[11px] text-neutral-400 ${
              isDark ? 'border-neutral-800' : 'border-[#e5e5e7]'
            }`}>
              <span>4 source files loaded</span>
            </div>
          </div>
        )}

        {/* Editor Area with Tab Bar, Breadcrumbs, and Minimap */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div
            className={`h-8 border-b flex items-center overflow-x-auto ${
              isDark ? 'bg-[#18181c] border-neutral-800' : 'bg-[#f4f4f6] border-[#e5e5e7]'
            }`}
          >
            {openTabs.map((tabId) => {
              const file = files.find((f) => f.id === tabId);
              if (!file) return null;
              const isActive = activeFileId === tabId;

              return (
                <div
                  key={tabId}
                  onClick={() => onSelectFile(tabId)}
                  className={`h-full px-3 flex items-center gap-2 border-r text-[12px] cursor-pointer transition-colors ${
                    isActive
                      ? isDark
                        ? 'bg-[#1e1e24] text-white border-b-2 border-b-blue-500 border-r-neutral-800 font-medium'
                        : 'bg-white text-neutral-900 border-b-2 border-b-blue-600 border-r-[#e5e5e7] font-medium'
                      : isDark
                      ? 'text-neutral-400 hover:bg-neutral-800/40 border-r-neutral-800'
                      : 'text-neutral-600 hover:bg-neutral-100 border-r-[#e5e5e7]'
                  }`}
                >
                  <FileCode size={12} className="text-blue-500" />
                  <span>{file.name}</span>
                  {file.isModified && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                  <button
                    onClick={(e) => handleCloseTab(e, tabId)}
                    className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5 rounded"
                  >
                    <X size={11} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Hierarchical Breadcrumbs Bar */}
          <div
            className={`h-6 px-3 border-b flex items-center gap-1.5 text-[11px] font-mono select-none ${
              isDark ? 'bg-[#18181c] border-neutral-800/60 text-neutral-400' : 'bg-[#fafafc] border-[#e5e5e7]/60 text-neutral-500'
            }`}
          >
            <span className="hover:text-blue-500 cursor-pointer">src</span>
            <span>›</span>
            <span className="hover:text-blue-500 cursor-pointer">components</span>
            <span>›</span>
            <span className="hover:text-blue-500 cursor-pointer">PaneContainer</span>
            <span>›</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-200">
              {activeFile.name}
            </span>
            <span>›</span>
            <span className="text-purple-500 font-medium">useTabDimensions()</span>
          </div>

          {/* Editor Canvas + Minimap Grid */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main Code Viewport */}
            <div className="flex-1 overflow-y-auto py-2 font-code text-[12px] leading-[20px]">
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isFoldPoint = line.includes('function ') || line.includes('interface ') || line.includes('return (');

                return (
                  <React.Fragment key={idx}>
                    <div className="group relative flex items-start hover:bg-neutral-500/5 select-text">
                      {/* Code folding chevron */}
                      <div className="w-4 shrink-0 flex items-center justify-center select-none text-neutral-400">
                        {isFoldPoint && (
                          <button
                            onClick={() => toggleFold(lineNum)}
                            className="opacity-0 group-hover:opacity-100 hover:text-neutral-900 dark:hover:text-white"
                          >
                            <ChevronDown size={11} />
                          </button>
                        )}
                      </div>

                      {/* Line Number */}
                      <div className={`w-8 shrink-0 pr-2 text-right select-none ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        {lineNum}
                      </div>

                      {/* Code Content */}
                      <div className={`flex-1 px-2 whitespace-pre overflow-x-auto ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                        {colorizeSyntax(line, isDark)}
                      </div>
                    </div>

                    {/* In-Editor Inline ⌘K Floating Prompt Bar */}
                    {inlineKOpen && lineNum === inlineKTargetLine && (
                      <div className="mx-8 my-2 p-3 rounded-xl border border-purple-500/40 bg-purple-500/10 shadow-xl backdrop-blur-md animate-fadeIn z-20">
                        <div className="flex items-center justify-between text-xs font-sans pb-1.5">
                          <div className="flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-300">
                            <Sparkles size={13} />
                            <span>Edit inline with Cursor (⌘K)</span>
                          </div>
                          <button
                            onClick={() => setInlineKOpen(false)}
                            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        </div>

                        {!inlineKDiffHunk ? (
                          <form onSubmit={handleInlineKSubmit} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={inlineKPrompt}
                              onChange={(e) => setInlineKPrompt(e.target.value)}
                              placeholder="e.g. Memoize icon size calculation with useMemo"
                              className={`flex-1 px-3 py-1.5 text-xs font-sans rounded-lg border focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                                isDark
                                  ? 'bg-[#1e1e24] border-neutral-700 text-white'
                                  : 'bg-white border-neutral-300 text-neutral-900'
                              }`}
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-sans text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <span>Generate</span>
                              <CornerDownLeft size={11} />
                            </button>
                          </form>
                        ) : (
                          /* In-Place Inline Diff Preview */
                          <div className="space-y-2 pt-1 font-code text-xs">
                            <div className="p-2 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                              - {inlineKDiffHunk.original}
                            </div>
                            <div className="p-2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse">
                              + {inlineKDiffHunk.suggested}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1 font-sans">
                              <button
                                onClick={handleRejectInlineK}
                                className="px-2.5 py-1 rounded text-xs border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              >
                                Reject (⌘N)
                              </button>
                              <button
                                onClick={handleAcceptInlineK}
                                className="px-3 py-1 rounded text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <Check size={12} />
                                <span>Accept (⌘Y)</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Ghost Autocomplete Prompt */}
              {ghostTextSuggestion && !ghostAccepted && (
                <div className="mx-10 my-2 p-2 rounded-lg border border-purple-500/30 bg-purple-500/5 flex items-center justify-between text-xs animate-fadeIn">
                  <div className="flex items-center gap-2 font-code">
                    <span className="text-neutral-400 italic">// Ghost Suggestion:</span>
                    <span className="text-purple-600 dark:text-purple-300 font-medium">
                      {ghostTextSuggestion}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAcceptGhostText}
                      className="px-2.5 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-sans text-[11px] font-medium flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>Tab to Accept</span>
                    </button>
                    <button
                      onClick={() => setGhostTextSuggestion(null)}
                      className="text-neutral-400 hover:text-neutral-600 text-[11px]"
                    >
                      Esc
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Monaco-Grade Interactive Minimap (Bird's Eye View) */}
            <div
              className={`w-20 shrink-0 border-l p-1 overflow-hidden select-none flex flex-col justify-start relative ${
                isDark ? 'bg-[#18181b]/50 border-neutral-800' : 'bg-neutral-50/50 border-[#e5e5e7]'
              }`}
            >
              {/* Active Viewport Scrubber Thumb */}
              <div className="absolute top-2 left-0 right-0 h-16 bg-blue-500/10 border-y border-blue-500/30 pointer-events-none" />

              {/* Miniature Code Lines */}
              <div className="space-y-0.5 opacity-60">
                {lines.map((l, i) => {
                  const width = Math.min(Math.max((l.trim().length / 60) * 100, 15), 90);
                  const isModified = i >= 12 && i <= 15;

                  return (
                    <div
                      key={i}
                      className={`h-[2px] rounded-xs ${
                        isModified
                          ? 'bg-emerald-500'
                          : isDark
                          ? 'bg-neutral-600'
                          : 'bg-neutral-400'
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div
            className={`h-6 px-3 border-t flex items-center justify-between text-[11px] select-none ${
              isDark ? 'bg-[#161619] border-neutral-800 text-neutral-400' : 'bg-[#fbfbfd] border-[#e5e5e7] text-neutral-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span>{activeFile.path}</span>
              <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-3">
              <span>TypeScript JSX</span>
              <span>Spaces: 2</span>
              <span>Ln {lines.length}, Col 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
