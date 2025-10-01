import React, { useState, useEffect } from 'react';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === '?') {
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
      <h3>Feature Flags</h3>
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
      <hr />
      <h3>Scenario View</h3>
      <Toggle
        label={scenarioView === 'before' ? 'Before' : 'After'}
        checked={scenarioView === 'after'}
        onChange={(checked) => {
          setScenarioView(checked ? 'after' : 'before');
        }}
      />
    </div>
  );
};

export default FeatureMenu;