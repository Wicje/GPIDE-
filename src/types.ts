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

export interface AgentStep {
  type: 'search' | 'grep' | 'read' | 'edit' | 'test';
  query: string;
  status: 'pending' | 'running' | 'completed';
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

export type DiffViewMode = 'unified' | 'split';
export type ThemeMode = 'light' | 'dark';

