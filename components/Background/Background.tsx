import React from 'react';
import './Background.css';

interface BackgroundProps {
  onClick?: () => void;
  show: boolean;
}

const Background: React.FC<BackgroundProps> = ({ onClick, show }) => {
  return <div className={`background ${show ? 'show' : ''}`} onClick={onClick} />;
};

export default Background;