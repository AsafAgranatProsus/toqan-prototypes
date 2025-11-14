import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { useScenarios } from '../../context/ScenarioContext';
import Toggle from '../Toggle/Toggle';
import { Icons } from '../Icons/Icons';
import gsap from 'gsap';
import './FeatureMenu.css';

const toKebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
const toSentenceCase = (str: string) => {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const FeatureMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cogRef = useRef<HTMLDivElement>(null);
  const { flags, setFlag } = useFeatureFlags();
  const { themeMode, toggleTheme, designSystem, isNewDesign } = useDesignSystem();
  const { activeScenario, scenarioView, setScenarioView } = useScenarios();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key)
      if (event.altKey && event.key === '/') {
        if (!isOpen) {
          setIsOpen(true);
        } else if (isMinimized) {
          setIsMinimized(false);
        } else {
          setIsOpen(false);
        }
      }
      if (event.key === 'Escape') {
        if (isMinimized) {
          setIsMinimized(false);
        } else {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMinimized]);

  // Animate menu in/out
  useEffect(() => {
    if (!menuRef.current || !contentRef.current) return;

    if (isOpen && !isMinimized) {
      gsap.fromTo(
        menuRef.current,
        {
          scale: 0.9,
          opacity: 0,
          x: 20,
        },
        {
          scale: 1,
          opacity: 1,
          x: 0,
          duration: 0.2,
          delay: 0,

          ease: 'power3.out',
        }
      );
    }
  }, [isOpen, isMinimized]);

  // Animate minimize/expand
  useEffect(() => {
    if (!menuRef.current || !contentRef.current || !cogRef.current) return;

    // if (isMinimized) {
    //   const tl = gsap.timeline();

    //   // Fade out and shrink content
    //   tl.to(contentRef.current, {
    //     opacity: 0,
    //     scale: 0.95,
    //     duration: 0.2,
    //     ease: 'power2.in',
    //   });

    //   // Morph menu to cog icon
    //   tl.to(menuRef.current, {
    //     width: 56,
    //     height: 56,
    //     borderRadius: '50%',
    //     padding: 0,
    //     duration: 0.3,
    //     ease: 'power3.inOut',
    //   }, '-=0.1');

    //   // Show and rotate cog icon
    //   tl.fromTo(
    //     cogRef.current,
    //     { scale: 0, rotation: -180, opacity: 0 },
    //     { 
    //       scale: 1, 
    //       rotation: 0, 
    //       opacity: 1,
    //       duration: 0.3,
    //       ease: 'back.out(1.7)',
    //     },
    //     '-=0.2'
    //   );
    // } else if (isOpen) {
    //   const tl = gsap.timeline();

    //   // Rotate and hide cog icon
    //   tl.to(cogRef.current, {
    //     scale: 0,
    //     rotation: 180,
    //     opacity: 0,
    //     duration: 0.2,
    //     ease: 'power2.in',
    //   });

    //   // Expand menu from cog
    //   tl.to(menuRef.current, {
    //     width: 320,
    //     height: 'auto',
    //     borderRadius: 8,
    //     padding: 20,
    //     duration: 0.3,
    //     ease: 'power3.inOut',
    //   }, '-=0.1');

    //   // Fade in and scale up content
    //   tl.fromTo(
    //     contentRef.current,
    //     { opacity: 0, scale: 0.95 },
    //     {
    //       opacity: 1,
    //       scale: 1,
    //       duration: 0.25,
    //       ease: 'power2.out',
    //     },
    //     '-=0.1'
    //   );
    // }
  }, [isMinimized, isOpen]);

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  const handleClose = () => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        scale: 0.8,
        opacity: 0,
        x: 20,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          setIsOpen(false);
          setIsMinimized(false);
        },
      });
    }
  };

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
    <div className="feature-menu" ref={menuRef}>
      {/* Cog icon for minimized state */}
      {/* <div 
        className="feature-menu-cog" 
        ref={cogRef}
        onClick={handleExpand}
        style={{ opacity: 0, pointerEvents: isMinimized ? 'auto' : 'none' }}
      >
        <Icons name="Settings" />
      </div> */}

      {/* Menu content */}
      <div className="feature-menu-content" ref={contentRef}>
        {/* Header with buttons */}
        <div className="feature-menu-header">
          <button
            className="feature-menu-button feature-menu-minimize"
            onClick={handleMinimize}
            aria-label="Minimize"
          >
            <Icons name="Minimize2" />
          </button>
          <button
            className="feature-menu-button feature-menu-close"
            onClick={handleClose}
            aria-label="Close"
          >
            <Icons name="X" />
          </button>
        </div>


        {/* <a href="/design-system"
          className="feature-menu-link"
          onClick={() => setIsOpen(false)}
        >
          <span>Design System Demo</span>
        </a> */}

        <div className="feature-menu-section">
          <div className="design-system-info">
            <p className="info-text">
              <strong>Current Design:</strong> {isNewDesign ? 'NEW (Live Toqan)' : 'OLD (Mockup)'}
            </p>
            <p className="info-text">
              <strong>Theme Mode:</strong> {themeMode}
            </p>
            <Link
              to="/design-system"
              className="feature-menu-link"
              onClick={() => setIsOpen(false)}
            >
              <Icons name="Layout" />
              <span>Design System Demo</span>
              <Icons name="ExternalLink" className="external-icon" />
            </Link>
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
          {/* <p className="helper-text">Toggle "New Branding" to switch design systems</p> */}
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

        {activeScenario && (
          <>
            <hr />

            <div className="feature-menu-section">
              <h3>scenario: {activeScenario.title}</h3>
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
          </>
        )}
      </div>
    </div>
  );
};

export default FeatureMenu;