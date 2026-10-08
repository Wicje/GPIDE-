export interface LineComment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  createdAt: string;
  resolved?: boolean;
}

export interface DiffLine {
  id?: string;
  oldLineNumber?: number | string;
  newLineNumber?: number | string;
  type: 'context' | 'delete' | 'add';
  content: string;
  highlightTokens?: { text: string; type: 'del' | 'add' }[];
  comments?: LineComment[];
}

export interface DiffFile {
  id: string;
  path: string;
  additions: number;
  deletions: number;
  lines: DiffLine[];
  extraContextTop?: DiffLine[];
  extraContextBottom?: DiffLine[];
  status: 'modified' | 'added' | 'deleted';
  staged?: boolean;
  accepted?: boolean;
}

export interface SidebarItem {
  id: string;
  title: string;
  badge?: 'blue' | 'gray';
  hasIcon?: boolean;
  iconType?: 'card' | 'panel' | 'toast';
  isMore?: boolean;
  category?: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface AgentStepMatch {
  file: string;
  line: number;
  preview: string;
}

export interface AgentStep {
  id: string;
  type: 'search' | 'grep' | 'read' | 'edit' | 'test';
  query: string;
  status: 'pending' | 'running' | 'completed';
  durationMs?: number;
  matches?: AgentStepMatch[];
  details?: string;
  checkpointId?: string;
  snapshotStats?: { additions: number; deletions: number };
}

export interface ProjectFile {
  id: string;
  path: string;
  name: string;
  content: string;
  language: string;
  isModified?: boolean;
}

export interface SessionData {
  id: string;
  title: string;
  prompt: string;
  steps: AgentStep[];
  response: string;
  processedItem?: string;
  videoPreview?: boolean;
  summary: string;
  diffStats: { additions: number; deletions: number; filesCount: number };
  files: DiffFile[];
  model: string;
}

export type RightPaneMode = 'diff' | 'editor' | 'preview' | 'tests';
export type DiffViewMode = 'unified' | 'split';
export type ThemeMode = 'light' | 'dark';
export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';

export interface AgentPhase {
  id: string;
  name: string;
  status: 'completed' | 'running' | 'queued' | 'failed';
  details: string;
  duration?: string;
  tokens?: number;
}

export interface ToolApprovalRequest {
  id: string;
  tool: string;
  command: string;
  riskLevel: 'safe' | 'medium' | 'destructive';
  status: 'pending' | 'approved' | 'rejected';
}

export interface AttachedContext {
  id: string;
  name: string;
  type: 'file' | 'git' | 'doc';
  tokens: number;
}

export interface TestCase {
  id: string;
  name: string;
  file: string;
  status: 'passed' | 'failed' | 'running';
  durationMs: number;
  expected?: string;
  actual?: string;
  error?: string;
}



