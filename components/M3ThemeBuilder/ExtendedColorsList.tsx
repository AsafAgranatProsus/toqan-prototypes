import React from 'react';
import { ExtendedColor } from './M3ThemeBuilder';
import { ExtendedColorItem } from './ExtendedColorItem';
import './ExtendedColorsList.css';

export interface ExtendedColorsListProps {
  colors: ExtendedColor[];
  sourceColor: string;
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<ExtendedColor>) => void;
  onDelete: (id: string) => void;
}

export const ExtendedColorsList: React.FC<ExtendedColorsListProps> = ({
  colors,
  sourceColor,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="extended-colors-list">
      <div className="extended-colors-header">
        <h2 className="m3-section-title">
          Extended colors
          <span className="extended-colors-info" title="Input a custom color that automatically gets assigned a set of complementary tones. Edit the source custom color to rename or delete.">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </span>
        </h2>
      </div>
      
      <p className="m3-section-description">
        Input a custom color that automatically gets assigned a set of complementary tones. 
        Edit the source custom color to rename or delete.
      </p>
      
      <div className="extended-colors-items">
        {colors.map((color) => (
          <ExtendedColorItem
            key={color.id}
            color={color}
            sourceColor={sourceColor}
            onUpdate={(updates) => onUpdate(color.id, updates)}
            onDelete={() => onDelete(color.id)}
          />
        ))}
      </div>
      
      <button className="extended-colors-add" onClick={onAdd}>
        <span className="extended-colors-add-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </span>
        <span>Add a color</span>
      </button>
    </div>
  );
};

