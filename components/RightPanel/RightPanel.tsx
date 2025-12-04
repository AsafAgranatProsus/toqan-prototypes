import React, { useState, useEffect } from 'react';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { ResizeHandle } from '../ResizeHandle/ResizeHandle';
import { Icons } from '../Icons/Icons';
import Button from '../Button/Button';
import './RightPanel.css';

interface RightPanelProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

const DEFAULT_WIDTH = 220;
const MIN_WIDTH = 150;
const MAX_WIDTH = 600;
const STORAGE_KEY = 'toqan-right-panel-width';

export const RightPanel: React.FC<RightPanelProps> = ({ isOpen, setOpen, isMobile }) => {
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
      console.error('Failed to save right panel width:', error);
    }
  }, [width]);

  // Only render if feature is active (requires newBranding AND newRightPanel)
  if (!isFeatureActive('newRightPanel')) {
    return null;
  }

  const handleResize = (newWidth: number) => {
    setWidth(newWidth);
  };

  const panelClasses = [
    'right-panel side-panel',
    isMobile ? 'right-panel--mobile' : '',
    isOpen ? 'right-panel--open' : ''
  ].filter(Boolean).join(' ');

  const panelStyle: React.CSSProperties = {
    width: isMobile ? '100%' : `${width}px`,
    minWidth: isMobile ? undefined : `${width}px`, // Force the width
    maxWidth: isMobile ? undefined : `${width}px`, // Force the width
  };

  return (
    <aside 
      className={panelClasses}
      style={panelStyle}
    >
      {/* Resize handle - only shows when resizable panels feature is active */}
      {isFeatureActive('newResizeablePanels') && !isMobile && (
        <ResizeHandle
          onResize={handleResize}
          currentWidth={width}
          minWidth={MIN_WIDTH}
          maxWidth={MAX_WIDTH}
          defaultWidth={DEFAULT_WIDTH}
          position="left"
          bufferSize={20}
        />
      )}

      <div className="right-panel__header">
        <h2 className="right-panel__title">Context</h2>
        {/* <Button 
          variant="icon" 
          icon="X"
          aria-label="Close panel"
          onClick={() => setOpen(false)}
        /> */}
      </div>

      <div className="right-panel__content">
        <div className="right-panel__section">
          <div className="right-panel__section-header">
            <Icons name="FileText" />
            <h3>Active Documents</h3>
          </div>
          <p className="right-panel__placeholder">
            No documents selected
          </p>
        </div>

        <div className="right-panel__section">
          <div className="right-panel__section-header">
            <Icons name="History" />
            <h3>Recent Context</h3>
          </div>
          <p className="right-panel__placeholder">
            Recent context will appear here
          </p>
        </div>

        <div className="right-panel__section">
          <div className="right-panel__section-header">
            <Icons name="Settings" />
            <h3>Settings</h3>
          </div>
          <p className="right-panel__placeholder">
            Panel settings coming soon
          </p>
        </div>
      </div>
    </aside>
  );
};

