/**
 * Secondary Panel (Restaurant Concept)
 * 
 * A contextual panel positioned to the right of the LeftSidebarRestaurant.
 * Displays the list of restaurant assets. Clicking an asset opens the canvas.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '../../../components/Icons/Icons';
import Button from '../../../components/Button/Button';
import { ResizeHandle } from '../../../components/ResizeHandle/ResizeHandle';
import { useFeatureFlags } from '../../../context/FeatureFlagContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useChatSession } from '../../../shared/chatSession';
import { RESTAURANT_ASSETS, ASSET_CATEGORIES } from '../data/assets';
import './SecondaryPanel.css';

const DEFAULT_WIDTH = 320;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const STORAGE_KEY = 'toqan-secondary-panel-width';

interface SecondaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const SecondaryPanel: React.FC<SecondaryPanelProps> = ({ 
  isOpen, 
  onClose,
  title = 'Library'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedAssetId, selectAsset } = useRestaurant();
  const { isFeatureActive } = useFeatureFlags();
  const { endSession } = useChatSession();
  
  // Handle asset selection - ends any active chat session
  const handleAssetSelect = useCallback((assetId: string) => {
    endSession();
    selectAsset(assetId);
  }, [endSession, selectAsset]);
  
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
      console.error('Failed to save secondary panel width:', error);
    }
  }, [width]);

  const handleResize = (newWidth: number) => {
    setWidth(newWidth);
  };

  // Filter assets based on search
  const filteredLibrary = RESTAURANT_ASSETS.filter(asset =>
    asset.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  const isResizable = isFeatureActive('newResizeablePanels');
  const panelStyle: React.CSSProperties = isResizable ? {
    width: `${width}px`,
    minWidth: `${width}px`,
    maxWidth: `${width}px`,
  } : {};

  return (
    <aside className="secondary-panel panel-with-shadow" style={panelStyle}>
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
      <div className="secondary-panel__header">
        <h2 className="secondary-panel__title">{title}</h2>
        <Button
          variant="text"
          shape="circle"
          icon="X"
          aria-label="Close panel"
          onClick={onClose}
        />
      </div>

      <div className="secondary-panel__search">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="secondary-panel__search-input"
        />
      </div>

      <div className="secondary-panel__content">
        <div className="secondary-panel__list">
          {filteredLibrary.map((asset) => {
            const categoryMeta = ASSET_CATEGORIES[asset.category];
            return (
              <div
                key={asset.id}
                className={`secondary-panel__item ${
                  selectedAssetId === asset.id ? 'secondary-panel__item--selected' : ''
                }`}
                onClick={() => handleAssetSelect(asset.id)}
              >
                <Icons name={categoryMeta.icon} />
                <div className="secondary-panel__item-content">
                  <span className="secondary-panel__item-title">{asset.title}</span>
                  <span className="secondary-panel__item-meta">
                    {asset.status} • {asset.updatedAt}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLibrary.length === 0 && (
          <div className="secondary-panel__empty">
            <Icons name="FileText" />
            <p>No assets found</p>
          </div>
        )}
      </div>

      <div className="secondary-panel__footer">
        <Button variant="outlined" icon="Plus" size="sm">
          New Asset
        </Button>
      </div>
    </aside>
  );
};

export default SecondaryPanel;
