import React, { useState, useEffect } from 'react';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { useScenarios } from '../../context/ScenarioContext';
import Toggle from '../Toggle/Toggle';
import './FeatureMenu.css';
import { ScenarioView } from '../../types';

const toKebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
const toSentenceCase = (str: string) => {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

interface FeatureMenuProps {
  scenarioView: ScenarioView;
  setScenarioView: (view: ScenarioView) => void;
}

const FeatureMenu: React.FC<FeatureMenuProps> = ({ scenarioView, setScenarioView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { flags, setFlag } = useFeatureFlags();
  const { themeMode, toggleTheme, designSystem, isNewDesign } = useDesignSystem();
  const { activeScenario } = useScenarios();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key)
      if (event.altKey && event.key === '/') {
        setIsOpen(prev => !prev);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    for (const flag in flags) {
      const className = toKebabCase(flag).replace('enable-', '');
      if (flags[flag as keyof typeof flags]) {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
    }
  }, [flags]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="feature-menu">
      <div className="feature-menu-section">
        <h3>Design System</h3>
        <div className="design-system-info">
          <p className="info-text">
            <strong>Current Design:</strong> {isNewDesign ? 'NEW (Live Toqan)' : 'OLD (Mockup)'}
          </p>
          <p className="info-text">
            <strong>Theme Mode:</strong> {themeMode}
          </p>
        </div>
        <Toggle
          variant="button"
          leftOption="Light"
          rightOption="Dark"
          checked={themeMode === 'dark'}
          onChange={() => toggleTheme()}
        />
      </div>
      
      <hr />
      
      <div className="feature-menu-section">
        <h3>Feature Flags</h3>
        <p className="helper-text">Toggle "New Branding" to switch design systems</p>
        {Object.keys(flags).map(flag => (
          <Toggle
            key={flag}
            label={toSentenceCase(flag)}
            checked={flags[flag as keyof typeof flags]}
            onChange={(checked) => {
              setFlag(flag as keyof typeof flags, checked);
            }}
          />
        ))}
      </div>
      
      <hr />
      
      <div className="feature-menu-section">
        <h3>{activeScenario ? `scenario: ${activeScenario.title}` : 'Scenario View'}</h3>
        <Toggle
          variant="button"
          leftOption="Before"
          rightOption="After"
          checked={scenarioView === 'after'}
          onChange={(checked) => {
            setScenarioView(checked ? 'after' : 'before');
          }}
        />
      </div>
    </div>
  );
};

export default FeatureMenu;