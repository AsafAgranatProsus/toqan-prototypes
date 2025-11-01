export interface Conversation {
  id: string;
  title: string;
  date: string;
  tag: string;
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
  | 'Robot';

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