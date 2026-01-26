/**
 * Priorities Panel (Restaurant Concept)
 * 
 * Displays a list of priority tickets that need user attention.
 * Grouped by urgency: Urgent, High Impact, Worth Reviewing, Completed.
 * Clicking a ticket starts a chat flow focused on that priority.
 */

import React, { useState, useEffect } from 'react';
import { Icons } from '../../../components/Icons/Icons';
import Button from '../../../components/Button/Button';
import { ResizeHandle } from '../../../components/ResizeHandle/ResizeHandle';
import { useFeatureFlags } from '../../../context/FeatureFlagContext';
import { useChatSessionOptional } from '../../../shared/chatSession';
import { getFlowIdForPriority } from '../flows';
import type { IconName } from '../../../types';
import './PrioritiesPanel.css';

const DEFAULT_WIDTH = 320;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const STORAGE_KEY = 'toqan-priorities-panel-width';

// Priority levels
type PriorityLevel = 'urgent' | 'high' | 'routine' | 'completed';

interface PriorityAction {
  label: string;
  variant?: 'primary' | 'secondary';
}

interface PriorityTicket {
  id: string;
  title: string;
  summary: string;
  level: PriorityLevel;
  actions?: PriorityAction[];
  timestamp?: string;
  icon?: IconName;
}

// Priority level metadata
const PRIORITY_LEVELS: Record<PriorityLevel, { label: string; color: string; icon: IconName }> = {
  urgent: { label: 'Urgent', color: 'var(--priority-urgent)', icon: 'AlertCircle' },
  high: { label: 'High Impact', color: 'var(--priority-high)', icon: 'TrendingUp' },
  routine: { label: 'Worth Reviewing', color: 'var(--priority-routine)', icon: 'Clock' },
  completed: { label: 'Completed', color: 'var(--priority-completed)', icon: 'Check' },
};

// Mock priorities data
const MOCK_PRIORITIES: PriorityTicket[] = [
  // Urgent
  {
    id: '1',
    title: 'Low Cash Flow Warning',
    summary: 'Account projected to dip below $1k on Feb 12th due to payroll + rent.',
    level: 'urgent',
    icon: 'AlertCircle',
    actions: [{ label: 'Review Projection', variant: 'primary' }, { label: 'Snooze' }],
  },
  {
    id: '2',
    title: 'Late Delivery Alert: Sysco',
    summary: 'Truck is delayed 2 hours. Lunch prep at risk.',
    level: 'urgent',
    icon: 'Truck',
    actions: [{ label: 'Check ETA', variant: 'primary' }, { label: 'View Impact' }],
  },
  {
    id: '3',
    title: 'Roster Conflict: Tomorrow',
    summary: 'Sarah called in sick (auto-detected from SMS). Shift uncovered.',
    level: 'urgent',
    icon: 'User',
    actions: [{ label: 'Find Replacement', variant: 'primary' }],
  },
  // High Impact
  {
    id: '4',
    title: 'Salmon Price Surge (+18%)',
    summary: 'Supplier X raised prices. Affects 3 menu items.',
    level: 'high',
    icon: 'TrendingUp',
    actions: [{ label: 'Compare Suppliers', variant: 'primary' }, { label: 'Adjust Menu Price' }],
  },
  {
    id: '5',
    title: 'Overtime Risk Detected',
    summary: 'Mike T. is at 38 hours. Scheduled for 8h tomorrow.',
    level: 'high',
    icon: 'Clock',
    actions: [{ label: 'Adjust Shift', variant: 'primary' }],
  },
  // Routine
  {
    id: '6',
    title: 'Review Weekly Order',
    summary: 'Draft order for Sysco is ready ($1,250).',
    level: 'routine',
    icon: 'FileText',
    actions: [{ label: 'Review & Send', variant: 'primary' }],
  },
  {
    id: '7',
    title: 'Customer Feedback Summary',
    summary: '4.8 stars this week. 2 mentions of "Cold Soup."',
    level: 'routine',
    icon: 'MessageSquare',
    actions: [{ label: 'Read Reviews', variant: 'primary' }],
  },
  // Completed
  {
    id: '8',
    title: 'Sent: Produce Order',
    summary: 'Order confirmed and sent to supplier.',
    level: 'completed',
    icon: 'Check',
    timestamp: '10:15 AM',
  },
  {
    id: '9',
    title: 'Resolved: Dishwasher Repair',
    summary: 'Technician fixed the issue.',
    level: 'completed',
    icon: 'Check',
    timestamp: 'Yesterday',
  },
];

interface PrioritiesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrioritiesPanel: React.FC<PrioritiesPanelProps> = ({ isOpen, onClose }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<PriorityLevel, boolean>>({
    urgent: true,
    high: true,
    routine: true,
    completed: false,
  });
  const { isFeatureActive } = useFeatureFlags();
  const chatSession = useChatSessionOptional();

  // Handle clicking on a priority ticket
  const handleTicketClick = (ticket: PriorityTicket) => {
    if (!chatSession) {
      console.warn('Chat session not available');
      return;
    }
    
    const flowId = getFlowIdForPriority(ticket.id);
    if (flowId) {
      chatSession.startSession({
        type: 'contextItem',
        flowId,
        context: {
          ticketId: ticket.id,
          ticketTitle: ticket.title,
          ticketSummary: ticket.summary,
          ticketLevel: ticket.level,
        },
      });
    } else {
      // No specific flow - start with the ticket as context
      chatSession.startSession({
        type: 'contextItem',
        userMessage: `Tell me about: ${ticket.title}`,
        context: {
          ticketId: ticket.id,
          ticketTitle: ticket.title,
          ticketSummary: ticket.summary,
        },
      });
    }
  };
  
  // Load width from localStorage
  const [width, setWidth] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : DEFAULT_WIDTH;
    } catch {
      return DEFAULT_WIDTH;
    }
  });

  // Save width to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(width));
    } catch (error) {
      console.error('Failed to save priorities panel width:', error);
    }
  }, [width]);

  const handleResize = (newWidth: number) => {
    setWidth(newWidth);
  };

  const toggleGroup = (level: PriorityLevel) => {
    setExpandedGroups(prev => ({ ...prev, [level]: !prev[level] }));
  };

  // Group priorities by level
  const groupedPriorities = MOCK_PRIORITIES.reduce((acc, priority) => {
    if (!acc[priority.level]) acc[priority.level] = [];
    acc[priority.level].push(priority);
    return acc;
  }, {} as Record<PriorityLevel, PriorityTicket[]>);

  if (!isOpen) return null;

  const isResizable = isFeatureActive('newResizeablePanels');
  const panelStyle: React.CSSProperties = isResizable ? {
    width: `${width}px`,
    minWidth: `${width}px`,
    maxWidth: `${width}px`,
  } : {};

  return (
    <aside className="priorities-panel panel-with-shadow" style={panelStyle}>
      {/* Resize handle */}
      {isResizable && (
        <ResizeHandle
          onResize={handleResize}
          currentWidth={width}
          minWidth={MIN_WIDTH}
          maxWidth={MAX_WIDTH}
          defaultWidth={DEFAULT_WIDTH}
          position="right"
          bufferSize={20}
        />
      )}
      <div className="priorities-panel__header">
        <h2 className="priorities-panel__title">Priorities</h2>
        <Button
          variant="text"
          shape="circle"
          icon="X"
          aria-label="Close panel"
          onClick={onClose}
        />
      </div>

      <div className="priorities-panel__content">
        {(['urgent', 'high', 'routine', 'completed'] as PriorityLevel[]).map(level => {
          const tickets = groupedPriorities[level] || [];
          const levelMeta = PRIORITY_LEVELS[level];
          const isExpanded = expandedGroups[level];

          return (
            <div key={level} className={`priorities-panel__group priorities-panel__group--${level}`}>
              <button
                className="priorities-panel__group-header"
                onClick={() => toggleGroup(level)}
                aria-expanded={isExpanded}
              >
                <div className="priorities-panel__group-label">
                  <span 
                    className="priorities-panel__group-indicator"
                    style={{ backgroundColor: levelMeta.color }}
                  />
                  <span className="priorities-panel__group-title">{levelMeta.label}</span>
                  <span className="priorities-panel__group-count">{tickets.length}</span>
                </div>
                <Icons name={isExpanded ? 'ChevronUp' : 'ChevronDown'} />
              </button>

              {isExpanded && tickets.length > 0 && (
                <div className="priorities-panel__tickets">
                  {tickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      className={`priorities-panel__ticket priorities-panel__ticket--${level} priorities-panel__ticket--clickable`}
                      onClick={() => handleTicketClick(ticket)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleTicketClick(ticket);
                        }
                      }}
                    >
                      <div className="priorities-panel__ticket-header">
                        <Icons name={ticket.icon || levelMeta.icon} />
                        <span className="priorities-panel__ticket-title">{ticket.title}</span>
                        {ticket.timestamp && (
                          <span className="priorities-panel__ticket-time">{ticket.timestamp}</span>
                        )}
                      </div>
                      <p className="priorities-panel__ticket-summary">{ticket.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default PrioritiesPanel;
