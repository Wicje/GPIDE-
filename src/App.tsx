import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ComposerPane } from './components/ComposerPane';
import { DiffReviewPane } from './components/DiffReviewPane';
import { CodeEditorPane } from './components/CodeEditorPane';
import { LiveAppPreviewPane } from './components/LiveAppPreviewPane';
import { TestExplorerPane } from './components/TestExplorerPane';
import { VideoPreviewModal } from './components/VideoPreviewModal';
import { PRModal } from './components/PRModal';
import { PRReviewStudioModal } from './components/PRReviewStudioModal';
import { VercelDeployModal } from './components/VercelDeployModal';
import { LoginAndAccountModal } from './components/LoginAndAccountModal';
import { CursorRulesModal } from './components/CursorRulesModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { NewAgentModal } from './components/NewAgentModal';
import { INITIAL_SECTIONS, SESSIONS_MAP, PROJECT_FILES } from './data/mockData';
import {
  DiffFile,
  DiffViewMode,
  ThemeMode,
  SessionData,
  SidebarSection,
  ProjectFile,
  RightPaneMode,
  TestCase,
} from './types';
import lightWallpaperImg from './assets/images/macos_mountain_wallpaper_1791421916911.jpg';
import darkWallpaperImg from './assets/images/macos_dark_wallpaper_1791422419326.jpg';
import {
  CheckCircle2,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  RefreshCw,
  Sparkles,
  Command,
  FileCode,
  Monitor,
  CheckSquare,
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [rightPaneMode, setRightPaneMode] = useState<RightPaneMode>('diff');
  const [diffViewMode, setDiffViewMode] = useState<DiffViewMode>('unified');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewAgentOpen, setIsNewAgentOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);
  const [isPRStudioOpen, setIsPRStudioOpen] = useState(false);
  const [isVercelDeployOpen, setIsVercelDeployOpen] = useState(false);
  const [isLoginAccountOpen, setIsLoginAccountOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  // Resizable Split-Pane Dimensions (Feature 1)
  const [sidebarWidth, setSidebarWidth] = useState(210);
  const [composerWidth, setComposerWidth] = useState(380);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingComposer, setIsResizingComposer] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // User State
  const [currentUser, setCurrentUser] = useState({
    name: 'Sualeh Asif',
    email: 'sualeh@anysphere.co',
    plan: 'Cursor Pro',
    avatar: '',
    fastRequestsUsed: 412,
    fastRequestsLimit: 500,
  });

  // Sessions and sections state
  const [sections, setSections] = useState<SidebarSection[]>(INITIAL_SECTIONS);
  const [sessions, setSessions] = useState<Record<string, SessionData>>(SESSIONS_MAP);
  const [activeSessionId, setActiveSessionId] = useState<string>('composer-ghost');
  const [isGenerating, setIsGenerating] = useState(false);

  // Project files state for Code Editor
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>(PROJECT_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('f-tab-bar');

  const activeSession = sessions[activeSessionId] || sessions['composer-ghost'];
  const activeFiles = activeSession.files;

  const isDark = theme === 'dark';
  const currentWallpaper = isDark ? darkWallpaperImg : lightWallpaperImg;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Mouse drag handlers for resizable dividers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;

      if (isResizingSidebar) {
        const newWidth = Math.min(Math.max(relativeX, 160), 320);
        setSidebarWidth(newWidth);
      } else if (isResizingComposer) {
        const newComposerWidth = Math.min(Math.max(relativeX - sidebarWidth, 260), 540);
        setComposerWidth(newComposerWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizingSidebar || isResizingComposer) {
        setIsResizingSidebar(false);
        setIsResizingComposer(false);
      }
    };

    if (isResizingSidebar || isResizingComposer) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar, isResizingComposer, sidebarWidth]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsNewAgentOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDiffViewMode((prev) => (prev === 'unified' ? 'split' : 'unified'));
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        setRightPaneMode('diff');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault();
        setRightPaneMode('editor');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '3') {
        e.preventDefault();
        setRightPaneMode('preview');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '4') {
        e.preventDefault();
        setRightPaneMode('tests');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    showToast(`Switched to ${next} mode`);
  };

  const handleReorderItem = (sectionTitle: string, itemId: string, direction: 'up' | 'down') => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.title !== sectionTitle) return sec;
        const idx = sec.items.findIndex((item) => item.id === itemId);
        if (idx === -1) return sec;
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= sec.items.length) return sec;

        const newItems = [...sec.items];
        const [moved] = newItems.splice(idx, 1);
        newItems.splice(targetIdx, 0, moved);
        return { ...sec, items: newItems };
      })
    );
    showToast(`Reordered sidebar item`);
  };

  const handleAcceptFile = (fileId: string) => {
    setSessions((prev) => {
      const sess = prev[activeSessionId];
      if (!sess) return prev;
      const updatedFiles = sess.files.map((f) =>
        f.id === fileId ? { ...f, accepted: !f.accepted } : f
      );
      return { ...prev, [activeSessionId]: { ...sess, files: updatedFiles } };
    });
    showToast('File hunk accepted');
  };

  const handleRevertFile = (fileId: string) => {
    showToast('File hunk changes reverted');
  };

  const handleToggleStageFile = (fileId: string) => {
    setSessions((prev) => {
      const sess = prev[activeSessionId];
      if (!sess) return prev;
      const updatedFiles = sess.files.map((f) =>
        f.id === fileId ? { ...f, staged: !f.staged } : f
      );
      return { ...prev, [activeSessionId]: { ...sess, files: updatedFiles } };
    });
  };

  const handleRollbackCheckpoint = (checkpointId: string, stepTitle: string) => {
    showToast(`Rolled back workspace to snapshot: ${checkpointId}`);
    setSessions((prev) => {
      const sess = prev[activeSessionId];
      if (!sess) return prev;

      const checkpointStepIndex = sess.steps.findIndex((s) => s.checkpointId === checkpointId);
      const remainingSteps =
        checkpointStepIndex !== -1 ? sess.steps.slice(0, checkpointStepIndex + 1) : sess.steps;

      return {
        ...prev,
        [activeSessionId]: {
          ...sess,
          steps: remainingSteps,
          response: `Rolled back to checkpoint "${stepTitle}". Prior unstaged changes reverted.`,
        },
      };
    });
  };

  const handleGenerateEdits = (promptText: string) => {
    setIsGenerating(true);
    showToast('Agent synthesizing diff and running AST parser...');

    setTimeout(() => {
      setSessions((prev) => {
        const sess = prev[activeSessionId];
        if (!sess) return prev;

        const newFile: DiffFile = {
          id: `new-file-${Date.now()}`,
          path: 'src/lib/debounceCompletion.ts',
          additions: 18,
          deletions: 0,
          status: 'added',
          staged: true,
          lines: [
            { oldLineNumber: '', newLineNumber: 1, type: 'add', content: 'export function debounce<T extends (...args: any[]) => void>(' },
            { oldLineNumber: '', newLineNumber: 2, type: 'add', content: '  fn: T,' },
            { oldLineNumber: '', newLineNumber: 3, type: 'add', content: '  waitMs: number,' },
            { oldLineNumber: '', newLineNumber: 4, type: 'add', content: ') {' },
            { oldLineNumber: '', newLineNumber: 5, type: 'add', content: '  let timer: NodeJS.Timeout | null = null;' },
            { oldLineNumber: '', newLineNumber: 6, type: 'add', content: '  return (...args: Parameters<T>) => {' },
            { oldLineNumber: '', newLineNumber: 7, type: 'add', content: '    if (timer) clearTimeout(timer);' },
            { oldLineNumber: '', newLineNumber: 8, type: 'add', content: '    timer = setTimeout(() => fn(...args), waitMs);' },
            { oldLineNumber: '', newLineNumber: 9, type: 'add', content: '  };' },
            { oldLineNumber: '', newLineNumber: 10, type: 'add', content: '}' },
          ],
        };

        const newStep = {
          id: `step-${Date.now()}`,
          type: 'edit' as const,
          query: promptText.slice(0, 32),
          status: 'completed' as const,
          durationMs: 19,
          details: `Generated debounce utility wrapper for prompt "${promptText}"`,
          checkpointId: `cp-${Date.now().toString().slice(-4)}`,
          matches: [
            { file: 'src/lib/debounceCompletion.ts', line: 1, preview: 'export function debounce(...)' },
          ],
        };

        return {
          ...prev,
          [activeSessionId]: {
            ...sess,
            steps: [...sess.steps, newStep],
            response: `Synthesized changes for: "${promptText}". Added debouncer with clean cancellation on rapid keystrokes.`,
            diffStats: {
              additions: sess.diffStats.additions + 18,
              deletions: sess.diffStats.deletions,
              filesCount: sess.diffStats.filesCount + 1,
            },
            files: [newFile, ...sess.files],
          },
        };
      });

      setRightPaneMode('diff');
      setIsGenerating(false);
      showToast('New diff generated! Review uncommitted changes.');
    }, 1400);
  };

  const handleInspectElement = (element: { component: string; file: string; line: number }) => {
    showToast(`Inspected ${element.component}. Routing to Composer...`);
    handleGenerateEdits(`Refactor ${element.component} in ${element.file}:${element.line} to optimize render latency and handle stale state`);
  };

  const handleAutoFixTest = (test: TestCase) => {
    showToast(`Agent auto-fixing test: "${test.name}"...`);
    handleGenerateEdits(`Fix failing Vitest assertion in ${test.file}: "${test.name}" (${test.expected})`);
  };

  const handleNewAgentSubmit = (newPrompt: string, newModel: string) => {
    const newId = `session-${Date.now()}`;
    const newSession: SessionData = {
      id: newId,
      title: newPrompt.slice(0, 24) + '...',
      prompt: newPrompt,
      steps: [
        {
          id: `s-init-${newId}`,
          type: 'search',
          query: 'Scanning repository symbols',
          status: 'completed',
          durationMs: 12,
          details: 'Indexed project symbol graph',
          checkpointId: 'cp-start',
        },
        {
          id: `s-edit-${newId}`,
          type: 'edit',
          query: 'Generating initial diff',
          status: 'completed',
          durationMs: 24,
          details: 'Scaffolded starter feature modules',
          checkpointId: 'cp-scaffold',
        },
      ],
      response: `Created implementation plan for: "${newPrompt}". Generated scaffold with unit tests.`,
      summary: `Initial scaffold synthesized. Ready for review and test verification.`,
      diffStats: { additions: 35, deletions: 4, filesCount: 2 },
      files: [
        {
          id: `f-${newId}`,
          path: 'src/features/newFeature.ts',
          additions: 35,
          deletions: 4,
          status: 'modified',
          lines: [
            { oldLineNumber: 1, newLineNumber: '', type: 'delete', content: '// legacy implementation' },
            { oldLineNumber: '', newLineNumber: 1, type: 'add', content: 'export const featureFlags = { enabled: true };' },
            { oldLineNumber: '', newLineNumber: 2, type: 'add', content: 'export function runPipeline() { return true; }' },
          ],
        },
      ],
      model: newModel,
    };

    setSessions((prev) => ({ ...prev, [newId]: newSession }));
    setSections((prev) =>
      prev.map((sec) =>
        sec.title === 'Cursor'
          ? {
              ...sec,
              items: [
                { id: newId, title: newSession.title, badge: 'blue' },
                ...sec.items,
              ],
            }
          : sec
      )
    );
    setActiveSessionId(newId);
    setRightPaneMode('diff');
    showToast(`Started new agent session: "${newSession.title}"`);
  };

  const handleAskComposerAboutLine = (snippet: string) => {
    handleGenerateEdits(`Refactor this code: "${snippet.slice(0, 40)}"`);
  };

  const handleReset = () => {
    setSessions(SESSIONS_MAP);
    setSections(INITIAL_SECTIONS);
    setActiveSessionId('composer-ghost');
    setDiffViewMode('unified');
    setRightPaneMode('diff');
    setSidebarWidth(210);
    setComposerWidth(380);
    showToast('Reset to default initial state');
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex items-center justify-center bg-cover bg-center select-none transition-colors duration-500 ${
        isDark ? 'dark' : ''
      }`}
      style={{
        backgroundImage: `url(${currentWallpaper})`,
        backgroundColor: isDark ? '#141416' : '#6c798a',
      }}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 right-4 z-40 flex items-center gap-2 bg-black/45 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white/90 text-xs shadow-xl border border-white/10 transition-opacity hover:opacity-100 opacity-80">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-1 px-1.5 py-0.5 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
          title="Command Palette (⌘K)"
        >
          <Command size={11} />
          <span className="text-[11px] font-medium hidden sm:inline">⌘K</span>
        </button>

        <span className="text-white/20 text-xs">|</span>

        <button
          onClick={() => setIsVercelDeployOpen(true)}
          className="flex items-center gap-1.5 px-1.5 py-0.5 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
          title="Deploy to Vercel (⌘V)"
        >
          <svg viewBox="0 0 76 65" fill="currentColor" className="w-2.5 h-2.5">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
          <span className="text-[11px] font-medium hidden md:inline">Deploy</span>
        </button>

        <span className="text-white/20 text-xs">|</span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setRightPaneMode('diff')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              rightPaneMode === 'diff' ? 'bg-white/20 text-white font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            Diff
          </button>
          <button
            onClick={() => setRightPaneMode('editor')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              rightPaneMode === 'editor' ? 'bg-white/20 text-white font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setRightPaneMode('preview')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              rightPaneMode === 'preview' ? 'bg-white/20 text-white font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setRightPaneMode('tests')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              rightPaneMode === 'tests' ? 'bg-white/20 text-white font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            Vitest
          </button>
        </div>

        <span className="text-white/20 text-xs">|</span>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-1 px-1.5 py-0.5 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        >
          {isDark ? <Sun size={12} className="text-amber-400" /> : <Moon size={12} className="text-purple-300" />}
        </button>

        <span className="text-white/20 text-xs">|</span>

        <button
          onClick={() => setIsMaximized(!isMaximized)}
          className="flex items-center gap-1 px-1.5 py-0.5 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
          title={isMaximized ? 'Restore Window' : 'Full Screen'}
        >
          {isMaximized ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
        </button>

        <span className="text-white/20 text-xs">|</span>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-1.5 py-0.5 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
          title="Reset to default screenshot state"
        >
          <RefreshCw size={11} />
        </button>
      </div>

      {/* Main Cursor App Window with Interactive Drag Handles */}
      <div
        ref={containerRef}
        className={`relative z-10 transition-all duration-100 ease-out flex shadow-2xl overflow-hidden border ${
          isMaximized
            ? 'w-full h-full rounded-none border-none'
            : 'w-[96vw] max-w-[1240px] h-[92vh] max-h-[820px] rounded-2xl shadow-2xl shadow-black/50 border-black/15'
        }`}
        style={{
          boxShadow: isMaximized
            ? 'none'
            : isDark
            ? '0 30px 70px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.12)',
        }}
      >
        {/* Left Column: Sidebar with Dynamic Width */}
        <div style={{ width: `${sidebarWidth}px` }} className="shrink-0 h-full overflow-hidden flex flex-col">
          <Sidebar
            sections={sections}
            onReorderItem={handleReorderItem}
            activeItem={activeSessionId}
            onSelectItem={(id) => {
              if (sessions[id]) {
                setActiveSessionId(id);
                showToast(`Switched session to ${sessions[id].title}`);
              } else {
                setActiveSessionId(id);
              }
            }}
            onNewAgent={() => setIsNewAgentOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenAccount={() => setIsLoginAccountOpen(true)}
            theme={theme}
          />
        </div>

        {/* Feature 1: Draggable Resizer 1 (Between Sidebar & Composer) */}
        <div
          onMouseDown={() => setIsResizingSidebar(true)}
          onDoubleClick={() => setSidebarWidth(210)}
          className={`w-1 shrink-0 h-full cursor-col-resize transition-colors relative z-20 hover:bg-blue-500/50 ${
            isResizingSidebar ? 'bg-blue-600' : isDark ? 'bg-neutral-800' : 'bg-neutral-200'
          }`}
          title="Drag to resize sidebar (Double-click to reset)"
        />

        {/* Middle Column: Composer Ghost Chat Pane with Dynamic Width */}
        <div style={{ width: `${composerWidth}px` }} className="shrink-0 h-full overflow-hidden flex flex-col">
          <ComposerPane
            session={activeSession}
            onOpenVideoModal={() => setIsVideoModalOpen(true)}
            onCommitPush={() => showToast('Committed & pushed changes to erik/scm-pane-features')}
            onReviewClick={() => {
              setRightPaneMode('diff');
              showToast('Focusing SCM diff review pane');
            }}
            onGenerateEdits={handleGenerateEdits}
            onRollbackCheckpoint={handleRollbackCheckpoint}
            onOpenRules={() => setIsRulesModalOpen(true)}
            isGenerating={isGenerating}
            theme={theme}
          />
        </div>

        {/* Feature 1: Draggable Resizer 2 (Between Composer & Right Pane) */}
        <div
          onMouseDown={() => setIsResizingComposer(true)}
          onDoubleClick={() => setComposerWidth(380)}
          className={`w-1 shrink-0 h-full cursor-col-resize transition-colors relative z-20 hover:bg-blue-500/50 ${
            isResizingComposer ? 'bg-blue-600' : isDark ? 'bg-neutral-800' : 'bg-neutral-200'
          }`}
          title="Drag to resize composer pane (Double-click to reset)"
        />

        {/* Right Column: Dynamic Pane Selection (flex-1) */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          {rightPaneMode === 'diff' && (
            <DiffReviewPane
              files={activeFiles}
              onAcceptFile={handleAcceptFile}
              onRevertFile={handleRevertFile}
              onToggleStageFile={handleToggleStageFile}
              onCreatePR={() => setIsPRStudioOpen(true)}
              onCommitPush={() => showToast('Committed & pushed changes to erik/scm-pane-features')}
              onOpenDeploy={() => setIsVercelDeployOpen(true)}
              onAskComposer={handleAskComposerAboutLine}
              onSwitchToEditor={() => setRightPaneMode('editor')}
              rightPaneMode={rightPaneMode}
              onSelectPaneMode={(mode) => setRightPaneMode(mode)}
              diffViewMode={diffViewMode}
              onToggleDiffViewMode={() => setDiffViewMode(diffViewMode === 'unified' ? 'split' : 'unified')}
              isTerminalOpen={isTerminalOpen}
              onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
              isMaximized={isMaximized}
              onToggleMaximize={() => setIsMaximized(!isMaximized)}
              theme={theme}
            />
          )}

          {rightPaneMode === 'editor' && (
            <CodeEditorPane
              files={projectFiles}
              activeFileId={activeFileId}
              onSelectFile={(id) => setActiveFileId(id)}
              onSwitchToDiff={() => setRightPaneMode('diff')}
              theme={theme}
            />
          )}

          {rightPaneMode === 'preview' && (
            <LiveAppPreviewPane
              onInspectElement={handleInspectElement}
              onSwitchToDiff={() => setRightPaneMode('diff')}
              theme={theme}
            />
          )}

          {rightPaneMode === 'tests' && (
            <TestExplorerPane
              onAutoFixTest={handleAutoFixTest}
              theme={theme}
            />
          )}
        </div>
      </div>

      {/* Interactive Modals */}
      <VideoPreviewModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      <PRModal
        isOpen={isPRModalOpen}
        onClose={() => setIsPRModalOpen(false)}
        onSubmit={(title) => {
          setIsPRModalOpen(false);
          setIsPRStudioOpen(true);
          showToast(`Pull Request created: "${title.slice(0, 32)}..."`);
        }}
      />

      <PRReviewStudioModal
        isOpen={isPRStudioOpen}
        onClose={() => setIsPRStudioOpen(false)}
        files={activeFiles}
        onMergeSuccess={() => {
          showToast('Pull Request merged into main branch!');
        }}
        theme={theme}
      />

      <VercelDeployModal
        isOpen={isVercelDeployOpen}
        onClose={() => setIsVercelDeployOpen(false)}
        branchName="erik/scm-pane-features"
        theme={theme}
      />

      <LoginAndAccountModal
        isOpen={isLoginAccountOpen}
        onClose={() => setIsLoginAccountOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser((prev) => ({
            ...prev,
            name: user.name,
            email: user.email,
          }));
          showToast(`Signed in as ${user.name}`);
        }}
        onLogout={() => {
          showToast('Signed out of Cursor');
        }}
        theme={theme}
      />

      <CursorRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        onSaveRules={(rules) => {
          showToast('Updated .cursorrules guidelines');
        }}
        theme={theme}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectSession={(id) => {
          if (sessions[id]) setActiveSessionId(id);
        }}
        onToggleTheme={toggleTheme}
        onToggleDiffMode={() => setDiffViewMode(diffViewMode === 'unified' ? 'split' : 'unified')}
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
        onCreatePR={() => setIsPRStudioOpen(true)}
        onCommitPush={() => showToast('Committed & pushed changes')}
        onNewAgent={() => setIsNewAgentOpen(true)}
        onOpenDeploy={() => setIsVercelDeployOpen(true)}
        onOpenAccount={() => setIsLoginAccountOpen(true)}
        theme={theme}
      />

      <NewAgentModal
        isOpen={isNewAgentOpen}
        onClose={() => setIsNewAgentOpen(false)}
        onSubmit={handleNewAgentSubmit}
        theme={theme}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-neutral-900/95 text-white backdrop-blur-md rounded-full shadow-2xl text-xs font-medium border border-white/10 animate-fadeIn">
          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
