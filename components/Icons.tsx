import React from 'react';
import {
  FilePenLine,
  MessageSquare,
  Bot,
  BarChart2,
  PlugZap,
  Library,
  User,
  Paperclip,
  Mic,
  ArrowUp,
  ChevronDown,
  Menu,
  Plus,
  LucideProps,
  SquarePen,
  Plug,
  Database,
  Mail, Trash, Terminal
} from 'lucide-react';
import type { IconName } from '../types';

interface IconProps extends LucideProps {
  name: IconName;
  // Fix: Add className to the props interface to allow passing it to the component.
  className?: string;
}

const iconComponents: Record<IconName, React.FC<LucideProps>> = {
  FilePenLine,
  SquarePen,
  MessageSquare,
  Bot,
  BarChart2,
  PlugZap,
  Plug,
  Database,
  Library,
  User,
  Paperclip,
  Mic,
  ArrowUp,
  ChevronDown,
  Menu,
  Plus,
  Mail,
  Trash,
  Terminal
};

export const Icons: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = iconComponents[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};