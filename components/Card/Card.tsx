import React from 'react';
import Avatar from 'boring-avatars';
import './Card.css';

interface CardProps {
  title: string;
  description?: string;
  style?: React.CSSProperties;
  avatarName?: string;
}

// Simple hash function to get consistent color based on name
export const getColorFromName = (name: string, colors: string[]): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Calculate if a color is light or dark to determine text color
export const getTextColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#221d34' : '#ffffff';
};

// Generate random position based on name
const getRandomPosition = (name: string): { top: string; left: string } => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use different parts of the hash for x and y
  const topHash = Math.abs(hash);
  const leftHash = Math.abs(hash >> 16);

  // Generate positions - keep avatar mostly visible
  // Top: -20% to 60% (can overflow top and bottom a bit)
  // Left: -20% to 60% (can overflow sides a bit)
  const top = -20 + (topHash % 80);
  const left = -20 + (leftHash % 80);

  return {
    top: `${top}%`,
    left: `${left}%`
  };
};

export const AVATAR_COLORS = ["#dae2cb", "#bfe2da", "#98e5e6", "#b6a3fc", "#f9cbda"];

const Card: React.FC<CardProps> = ({ title, description, style, avatarName }) => {
  const name = avatarName || title;
  const backgroundColor = getColorFromName(name, AVATAR_COLORS);
  const textColor = getTextColor(backgroundColor);
  const avatarPosition = getRandomPosition(name);

  return (
    <div className="card" style={{ ...style, backgroundColor, color: textColor }}>
      <div className="card-avatar" > {/* style={avatarPosition} */}
        <Avatar
          name={name}
          colors={AVATAR_COLORS}
          variant="bauhaus"
          size={180}
        />
      </div>
      <div className="card-grain"></div>
      <h3 className="card-title">{title}</h3>
      {description && <p className="card-description">{description}</p>}
    </div>
  );
};

export default Card;
