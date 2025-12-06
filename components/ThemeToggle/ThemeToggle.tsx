import React, { useMemo } from 'react';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { GroupedButtons, GroupedButton } from '../GroupedButtons/GroupedButtons';

interface ThemeToggleProps {
  showAuto?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showAuto = true, size = 'md' }) => {
  const { themeMode, setThemeMode } = useDesignSystem();

  // Build button definitions based on showAuto prop
  const buttons: GroupedButton[] = useMemo(() => {
    const baseButtons: GroupedButton[] = [
      {
        id: 'light',
        icon: 'Sun',
        title: 'Light theme',
      },
      {
        id: 'dark',
        icon: 'Moon',
        title: 'Dark theme',
      },
    ];

    if (showAuto) {
      baseButtons.push({
        id: 'auto',
        icon: 'Monitor',
        title: 'Auto theme (follows system)',
      });
    }

    return baseButtons;
  }, [showAuto]);

  const handleChange = (id: string) => {
    setThemeMode(id as 'light' | 'dark' | 'auto');
  };

  return (
    <GroupedButtons
      buttons={buttons}
      activeId={themeMode}
      onChange={handleChange}
      size={size}
      ariaLabel="Theme mode selector"
    />
  );
};

