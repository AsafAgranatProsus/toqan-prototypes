import React, { useState, useRef, useEffect } from 'react';
import { ExtendedColor } from './M3ThemeBuilder';
import { HctColorPicker } from './HctColorPicker';
import './ExtendedColorItem.css';

export interface ExtendedColorItemProps {
  color: ExtendedColor;
  sourceColor: string;
  onUpdate: (updates: Partial<ExtendedColor>) => void;
  onDelete: () => void;
}

export const ExtendedColorItem: React.FC<ExtendedColorItemProps> = ({
  color,
  sourceColor,
  onUpdate,
  onDelete,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(color.name);
  const [editDescription, setEditDescription] = useState(color.description || '');
  
  const menuRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Focus name input when editing starts
  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditing]);

  const handleSwatchClick = () => {
    setShowColorPicker(true);
  };

  const handleColorApply = (newColor: string) => {
    onUpdate({ color: newColor });
    setShowColorPicker(false);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleRename = () => {
    setShowMenu(false);
    setIsEditing(true);
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete();
  };

  const handleEditSave = () => {
    onUpdate({ 
      name: editName.trim() || color.name,
      description: editDescription.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditName(color.name);
    setEditDescription(color.description || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div className="extended-color-item">
      <button
        className="extended-color-swatch"
        style={{ backgroundColor: color.color }}
        onClick={handleSwatchClick}
        title="Click to change color"
      />
      
      <div className="extended-color-info">
        {isEditing ? (
          <div className="extended-color-edit">
            <input
              ref={nameInputRef}
              type="text"
              className="extended-color-edit-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Color name"
            />
            <input
              type="text"
              className="extended-color-edit-description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Description (optional)"
            />
            <div className="extended-color-edit-actions">
              <button className="extended-color-edit-save" onClick={handleEditSave}>
                Save
              </button>
              <button className="extended-color-edit-cancel" onClick={handleEditCancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="extended-color-name">{color.name}</span>
            {color.description && (
              <span className="extended-color-description">{color.description}</span>
            )}
          </>
        )}
      </div>
      
      {!isEditing && (
        <div className="extended-color-menu-wrapper" ref={menuRef}>
          <button
            className="extended-color-menu-button"
            onClick={handleMenuToggle}
            title="More options"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
          
          {showMenu && (
            <div className="extended-color-menu">
              <button className="extended-color-menu-item" onClick={handleRename}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Rename
              </button>
              <button className="extended-color-menu-item delete" onClick={handleDelete}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      )}
      
      {showColorPicker && (
        <HctColorPicker
          color={color.color}
          onApply={handleColorApply}
          onCancel={() => setShowColorPicker(false)}
        />
      )}
    </div>
  );
};

