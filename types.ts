export interface Conversation {
  id: string;
  title: string;
  date: string;
  tag: string;
  pinned?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  beta?: boolean;
}

export type IconName = 
  | 'FilePenLine'
  | 'SquarePen'
  | 'MessageSquare'
  | 'Bot'
  | 'BarChart2'
  | 'PlugZap'
  | 'Plug'
  | 'Database'
  | 'Library'
  | 'User'
  | 'Paperclip'
  | 'Mic'
  | 'ArrowUp'
  | 'ArrowRight'
  | 'ChevronDown'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'Menu'
  | 'Plus'
  | 'Mail'
  | 'Trash'
  | 'Terminal'
  | 'X'
  | 'Sparkles'
  | 'Sun'
  | 'Moon'
  | 'Copy'
  | 'Check'
  | 'Settings'
  | 'Minimize2'
  | 'ExternalLink'
  | 'Layout'
  | 'Robot'
  | 'MoreVertical'
  | 'Pin'
  | 'Edit2'
  | 'Clock'
  | 'History'
  | 'FileText';

export interface Model {
  id: string;
  name: string;
  description: string;
  tag?: 'Recommended' | 'Beta';
}

export type ScenarioView = 'before' | 'after';

export interface Scenario {
  prompt: string;
  outputBefore: string;
  outputAfter: string;
}