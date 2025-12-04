import React, { useState, useEffect } from 'react';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { Logo } from '../Logo/Logo';
import { Icons } from '../Icons/Icons';
import Button from '../Button/Button';
import { ResizeHandle } from '../ResizeHandle/ResizeHandle';
import './LeftSidebar.css';

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
    width: isMobile ? '280px' : `${width}px`,
    minWidth: isMobile ? undefined : `${width}px`, // Force the width
    maxWidth: isMobile ? undefined : `${width}px`, // Force the width
  };

  return (
    <aside 
      className={sidebarClasses}
      style={sidebarStyle}
    >
      <div className="left-sidebar__header">
        <Logo variant="minimal" />
        <Button 
          variant="outlined" 
          shape="circle"
          icon="SquarePen"
          aria-label="New conversation"
        />
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

      <div className="left-sidebar__content">
        <div className="left-sidebar__section-header">
          <div className="left-sidebar__section-title">
            <Icons name="MessageSquare" />
            <span>Sessions</span>
          </div>
          <Button variant="text" icon="ChevronRight" iconPosition="right">
            All
          </Button>
        </div>
        
        {/* Conversations list will go here */}
        <p className="left-sidebar__placeholder">
          New sidebar content coming soon...
        </p>
      </div>

      <div className="left-sidebar__footer">
        <div className="left-sidebar__nav-item">
          <Icons name="User" />
          <span>Account</span>
        </div>
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

