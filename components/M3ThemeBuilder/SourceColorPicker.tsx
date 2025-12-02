import React, { useState, useRef } from 'react';
import { extractColorFromImage } from '../../themes/m3';
import { CustomImage } from './M3ThemeBuilder';
import { HctColorPicker } from './HctColorPicker';
import './SourceColorPicker.css';

// Preset images for color extraction
const PRESET_IMAGES = [
  { id: 'leaves', src: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=100&h=100&fit=crop', alt: 'Green leaves' },
  { id: 'flowers', src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=100&h=100&fit=crop', alt: 'Pink flowers' },
  { id: 'ocean', src: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=100&h=100&fit=crop', alt: 'Blue ocean' },
  { id: 'sunset', src: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=100&h=100&fit=crop', alt: 'Orange sunset' },
];

export interface SourceColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onShuffle: () => void;
  customImages?: CustomImage[];
  onCustomImageAdd?: (imageDataUrl: string) => void;
}

export const SourceColorPicker: React.FC<SourceColorPickerProps> = ({
  color,
  onChange,
  onShuffle,
  customImages = [],
  onCustomImageAdd,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHctPicker, setShowHctPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle image selection
  const handleImageSelect = async (imageUrl: string, imageId: string) => {
    setSelectedImage(imageId);
    setIsLoading(true);
    
    try {
      const extractedColor = await extractColorFromImage(imageUrl);
      onChange(extractedColor);
    } catch (error) {
      console.error('Failed to extract color:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      // Create a data URL for the thumbnail
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageDataUrl = event.target?.result as string;
        
        // Add to custom images collection
        if (onCustomImageAdd) {
          onCustomImageAdd(imageDataUrl);
        }
        
        // Extract color and set selection
        const extractedColor = await extractColorFromImage(imageDataUrl);
        onChange(extractedColor);
        
        // Select the newly added image
        setSelectedImage(`custom-${Date.now()}`);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to extract color:', error);
      setIsLoading(false);
    }
  };
  
  // Handle color swatch click - open HCT picker
  const handleSwatchClick = () => {
    setShowHctPicker(true);
  };
  
  // Handle HCT picker apply
  const handleHctApply = (newColor: string) => {
    setSelectedImage(null);
    onChange(newColor);
    setShowHctPicker(false);
  };
  
  // Handle HCT picker cancel
  const handleHctCancel = () => {
    setShowHctPicker(false);
  };
  
  // Combine preset and custom images
  const allImages = [...PRESET_IMAGES, ...customImages];
  
  return (
    <div className="source-color-picker">
      {/* Image presets */}
      <div className="source-images">
        {allImages.map((image) => (
          <button
            key={image.id}
            className={`source-image-btn ${selectedImage === image.id ? 'selected' : ''}`}
            onClick={() => handleImageSelect(image.src, image.id)}
            title={image.alt}
          >
            <img src={image.src} alt={image.alt} />
            {selectedImage === image.id && (
              <span className="source-image-check">✓</span>
            )}
          </button>
        ))}
        <button
          className="source-image-btn upload"
          onClick={() => fileInputRef.current?.click()}
          title="Upload image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/>
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>
      
      {/* Color picker */}
      <div className="source-color-row">
        <button
          className="source-color-swatch"
          onClick={handleSwatchClick}
          style={{ backgroundColor: color }}
          title="Click to pick a color"
        >
          {isLoading && <span className="source-loading">...</span>}
        </button>
        <div className="source-color-info">
          <span className="source-color-label">Source color</span>
          <span className="source-color-value">{color.toUpperCase()}</span>
        </div>
        <button
          className="source-shuffle-btn"
          onClick={onShuffle}
          title="Generate random color"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </button>
      </div>
      
      {/* HCT Color Picker Modal */}
      {showHctPicker && (
        <HctColorPicker
          color={color}
          onApply={handleHctApply}
          onCancel={handleHctCancel}
        />
      )}
    </div>
  );
};

