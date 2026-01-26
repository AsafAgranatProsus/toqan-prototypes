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
  | 'Home'
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
  | 'ChevronUp'
  | 'Menu'
  | 'Plus'
  | 'Mail'
  | 'Trash'
  | 'Terminal'
  | 'X'
  | 'Sparkles'
  | 'Sun'
  | 'Moon'
  | 'Monitor'
  | 'Copy'
  | 'Check'
  | 'CheckCheck'
  | 'Settings'
  | 'Settings2'
  | 'Minimize2'
  | 'ExternalLink'
  | 'Layout'
  | 'Robot'
  | 'MoreVertical'
  | 'Pin'
  | 'Edit2'
  | 'Clock'
  | 'History'
  | 'FileText'
  | 'CornerDownRight'
  | 'ArrowUpDown'
  | 'PanelLeft'
  | 'Layers'
  | 'Palette'
  | 'FileStack'
  | 'Truck'
  | 'AlertCircle'
  | 'TrendingUp'
  | 'Users'
  | 'Package'
  | 'DollarSign'
  | 'Utensils'
  | 'AlertTriangle'
  | 'Info'
  | 'ThumbsUp'
  | 'ThumbsDown'
  | 'Bookmark';

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