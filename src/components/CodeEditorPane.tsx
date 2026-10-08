import React, { useState } from 'react';
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

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

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

  // Syntax highlighting helper
  const renderEditorLines = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => (
      <div
        key={idx}
        className={`flex items-start text-[12px] leading-[20px] font-code hover:bg-neutral-500/5 select-text`}
      >
        <div
          className={`w-10 shrink-0 pr-3 text-right select-none ${
            isDark ? 'text-neutral-600' : 'text-neutral-400'
          }`}
        >
          {idx + 1}
        </div>
        <div className={`flex-1 px-2 whitespace-pre overflow-x-auto ${
          isDark ? 'text-neutral-200' : 'text-neutral-800'
        }`}>
          {colorizeSyntax(line, isDark)}
        </div>
      </div>
    ));
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
          {/* Switch to Diff Review */}
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

          {/* Toggle File Tree */}
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

        {/* Copy & Status Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 transition-colors cursor-pointer"
            title={copied ? 'Copied code!' : 'Copy full file code'}
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Main Body: File Tree + Tabs & Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Explorer (Collapsible) */}
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

        {/* Editor Area with Tab Bar */}
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

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto py-2">
            {renderEditorLines(activeFile.content)}
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
              <span>Ln {activeFile.content.split('\n').length}, Col 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
