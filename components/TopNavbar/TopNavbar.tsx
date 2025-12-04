import React from 'react';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { Logo } from '../Logo/Logo';
import Button from '../Button/Button';
import { Icons } from '../Icons/Icons';
import './TopNavbar.css';

interface TopNavbarProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick, isMobile }) => {
  const { isFeatureActive } = useFeatureFlags();

  // Only render if feature is active (requires newBranding AND newTopNavbar)
  if (!isFeatureActive('newTopNavbar')) {
    return null;
  }

  return (
    <nav className="top-navbar-container">
      <div className="top-navbar__left">
        {isMobile && (
          <Button 
            variant="tertiary" 
            icon="Menu" 
            onClick={onMenuClick} 
            aria-label="Open menu" 
          />
        )}
        <Logo />
      </div>
      
      <div className="top-navbar__actions">
        <Button variant="tertiary" icon="Search" aria-label="Search" />
        <Button variant="tertiary" icon="Bell" aria-label="Notifications" />
        <Button variant="tertiary" icon="User" aria-label="Account" />
      </div>
    </nav>
  );
};

