

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
  | 'Menu'
  | 'Plus'
  | 'Mail'
  | 'Trash'
  | 'Terminal';

export interface Model {
  id: string;
  name: string;
  description: string;
  tag?: 'Recommended' | 'Beta';
}