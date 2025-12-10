import React, { useState, useEffect } from 'react';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { useWorkspaces } from '../../context/WorkspaceContext';
import { Logo } from '../Logo/Logo';
import { Icons } from '../Icons/Icons';
import Button from '../Button/Button';
import { ResizeHandle } from '../ResizeHandle/ResizeHandle';
import Dropdown from '../Dropdown/Dropdown';
import { WorkspaceMenu } from '../WorkspaceMenu/WorkspaceMenu';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import './LeftSidebar.css';
import { ThemeSelector } from '../ThemeSelector';

interface LeftSidebarProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

const DEFAULT_WIDTH = 220;
const MIN_WIDTH = 150;
const MAX_WIDTH = 600;
const STORAGE_KEY = 'toqan-left-sidebar-width';

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, setOpen, isMobile }) => {
  const { isFeatureActive, flags } = useFeatureFlags();
  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspaces();

  // Load width from localStorage
  const [width, setWidth] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : DEFAULT_WIDTH;
    } catch {
      return DEFAULT_WIDTH;
    }
  });

  // Recents section collapsed state
  const [recentsExpanded, setRecentsExpanded] = useState(true);

  // Sort option for recents
  const [recentsSortBy, setRecentsSortBy] = useState<'activity' | 'modified' | 'created'>('activity');

  // Save width to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(width));
    } catch (error) {
      console.error('Failed to save sidebar width:', error);
    }
  }, [width]);

  // Only render if feature is active (requires newBranding AND newLeftSidebar)
  if (!isFeatureActive('newLeftSidebar')) {
    return null;
  }

  const handleResize = (newWidth: number) => {
    setWidth(newWidth);
  };

  const sidebarClasses = [
    'left-sidebar side-panel',
    isMobile ? 'left-sidebar--mobile' : '',
    isOpen ? 'left-sidebar--open' : ''
  ].filter(Boolean).join(' ');

  const sidebarStyle: React.CSSProperties = {
    width: isMobile ? '100%' : `${width}px`,
    minWidth: isMobile ? undefined : `${width}px`, // Force the width
    maxWidth: isMobile ? undefined : `${width}px`, // Force the width
  };

  return (
    <aside
      className={sidebarClasses}
      style={sidebarStyle}
    >
      <div className="left-sidebar__header">
        {isFeatureActive('workspaces') ? (
          <Dropdown size="normal" showChevron={true} className="left-sidebar__workspace-selector">
            <Dropdown.Trigger>
              <div className="flex gap-4">

              <Logo variant="minimal" />
              <span className="left-sidebar__workspace-name">
                <span className="left-sidebar__workspace-name-title">
                  Workspace
                </span>
                <span className="left-sidebar__workspace-name-text">
                  {activeWorkspace?.name || 'Select Workspace'}
                </span>
              </span>
              </div>
            </Dropdown.Trigger>
            <Dropdown.Menu custom={true} coverTrigger={true}>
              <WorkspaceMenu />
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button
            variant="text"
            className="left-sidebar__logo-button"
            aria-label="Open workspace menu"
          >
            <span className="flex items-center gap-1">
              <Logo variant="minimal" />
              <Icons name="ChevronDown" />
            </span>
          </Button>
        )}
      </div>

      <nav className="left-sidebar__nav">
        <div className="left-sidebar__nav-item">
          <Icons name="Bot" />
          <span>Agents</span>
        </div>
        <div className="left-sidebar__nav-item">
          <Icons name="Plug" />
          <span>Integrations</span>
        </div>
        <div className="left-sidebar__nav-item">
          <Icons name="Library" />
          <span>Library</span>
        </div>
      </nav>



      <div className="left-sidebar__sessions-container">
        <div className="left-sidebar__sessions-header">
          <div className="left-sidebar__nav-item left-sidebar__nav-item--with-chevron">
            <Icons name="MessageSquare" />
            <span>Sessions</span>
            <Icons name="ChevronRight" />
          </div>
          <Button
            variant="outlined"
            shape="circle"
            icon="SquarePen"
            aria-label="New session"
          />
        </div>
        {/* Pinned Sessions */}
        <div className="left-sidebar__session-item left-sidebar__session-item--pinned">
          <Icons name="Pin" />
          <span className="left-sidebar__session-title">Product roadmap discussion and quarterly planning review</span>
        </div>
        <div className="left-sidebar__session-item left-sidebar__session-item--pinned">
          <Icons name="Pin" />
          <span className="left-sidebar__session-title">Q4 Marketing strategy</span>
        </div>

        {/* Recents Section */}
        <div
          className="left-sidebar__section-toggle"
          onClick={() => setRecentsExpanded(!recentsExpanded)}
        >
          <div className="left-sidebar__section-toggle-content">
            <Icons name="History" />
            <span>Recents</span>
          </div>
          <Icons name={recentsExpanded ? "ChevronUp" : "ChevronDown"} />
        </div>

        {recentsExpanded && (
          <>
            <div className="left-sidebar__sort-dropdown">
              <Dropdown
                size="tight"
                icon={<Icons name="ArrowUpDown" />}
              >
                <Dropdown.Trigger>
                  {recentsSortBy === 'activity' ? 'Most active' :
                    recentsSortBy === 'modified' ? 'Last modified' :
                      'Time Created'}
                </Dropdown.Trigger>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => setRecentsSortBy('activity')}
                    isSelected={recentsSortBy === 'activity'}
                  >
                    Most active
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setRecentsSortBy('modified')}
                    isSelected={recentsSortBy === 'modified'}
                  >
                    Last modified
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setRecentsSortBy('created')}
                    isSelected={recentsSortBy === 'created'}
                  >
                    Time Created
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="left-sidebar__session-list">
              <div className="left-sidebar__session-item left-sidebar__session-item--child">
                <Icons name="CornerDownRight" />
                <span className="left-sidebar__session-title">Debug API integration issues with third-party services</span>
              </div>
              <div className="left-sidebar__session-item left-sidebar__session-item--child">
                <Icons name="CornerDownRight" />
                <span className="left-sidebar__session-title">Review design mockups for the new dashboard interface</span>
              </div>
              <div className="left-sidebar__session-item left-sidebar__session-item--child">
                <Icons name="CornerDownRight" />
                <span className="left-sidebar__session-title">Team standup notes</span>
              </div>
              <div className="left-sidebar__session-item left-sidebar__session-item--child">
                <Icons name="CornerDownRight" />
                <span className="left-sidebar__session-title">Refactor authentication system and implement OAuth 2.0</span>
              </div>
              <div className="left-sidebar__session-item left-sidebar__session-item--child">
                <Icons name="CornerDownRight" />
                <span className="left-sidebar__session-title">Customer feedback analysis</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="left-sidebar__footer">
        <span class="flex-between">

          {flags.themes && <ThemeToggle />}
          {flags.themeSelector && <ThemeSelector />}
        </span>
      </div>

      {/* Resize handle - only shows when resizable panels feature is active */}
      {isFeatureActive('newResizeablePanels') && !isMobile && (
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
    </aside>
  );
};

