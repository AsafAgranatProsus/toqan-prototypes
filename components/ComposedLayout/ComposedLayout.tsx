/**
 * Composed Layout
 * 
 * A layout wrapper that renders content areas based on the active composer.
 * This preserves the current Toqan layout while enabling concept-specific
 * component swapping and layout variations.
 * 
 * Key principles:
 * - 'default' config = render the original/core component (no change)
 * - null config = hide/skip the area
 * - ComponentType config = render the specified component
 * 
 * The layout structure adapts based on the composer's layoutMode.
 */

import React, { useState, ComponentType } from 'react';
import { useComposer } from '../../concepts/composer';
import { ContentArea, AreaProps, LayoutMode } from '../../concepts/composer/types';
import { useRestaurant } from '../../concepts/restaurant';

// Import default/core components
import Sidebar from '../Sidebar/Sidebar';
import { LeftSidebar } from '../LeftSidebar/LeftSidebar';
import { RightPanel } from '../RightPanel/RightPanel';
import MainContent from '../MainContent/MainContent';
import { TopNavbar } from '../TopNavbar/TopNavbar';

import { useViewport } from '../../hooks/useViewport';
import { useScenarios } from '../../context/ScenarioContext';

import './ComposedLayout.css';

/**
 * Default components for each content area.
 * These are the core Toqan components used when config is 'default'.
 */
const defaultComponents: Record<ContentArea, ComponentType<any> | null> = {
  topBar: TopNavbar,
  leftPanel: null, // Handled specially due to old/new sidebar logic
  mainStage: MainContent,
  rightPanel: RightPanel,
  bottomBar: null, // Not used in current layout
};

interface ComposedLayoutProps {
  children?: React.ReactNode;
}

export const ComposedLayout: React.FC<ComposedLayoutProps> = ({ children }) => {
  const { width } = useViewport();
  const isMobile = width < 768;
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isRightPanelOpen, setRightPanelOpen] = useState(true);
  const { scenarioView } = useScenarios();
  
  const { composer, isAreaDefault, isAreaHidden, layoutMode, getAreaConfig } = useComposer();
  
  // Restaurant-specific state (gracefully handles when not in restaurant context)
  const { isSecondaryPanelOpen, isCanvasOpen, activeNavId } = useRestaurant();
  
  /**
   * Render a content area based on composer config.
   * 
   * - If config is null: don't render
   * - If config is 'default': render the default component
   * - If config is a component: render that component
   */
  const renderArea = (area: ContentArea, props: AreaProps = {}): React.ReactNode => {
    if (isAreaHidden(area)) {
      return null;
    }
    
    const config = getAreaConfig(area);
    
    if (isAreaDefault(area)) {
      // Use default component
      const DefaultComponent = defaultComponents[area];
      if (!DefaultComponent) return null;
      return <DefaultComponent {...props} />;
    }
    
    // Use custom component from composer
    if (typeof config === 'function') {
      const CustomComponent = config as ComponentType<AreaProps>;
      return <CustomComponent {...props} />;
    }
    
    return null;
  };
  
  /**
   * Render the left panel area.
   * This is special because we have old Sidebar and new LeftSidebar
   * controlled by feature flags.
   */
  const renderLeftPanel = (): React.ReactNode => {
    if (isAreaHidden('leftPanel')) {
      return null;
    }
    
    const config = getAreaConfig('leftPanel');
    const panelProps = {
      isOpen: isSidebarOpen,
      setOpen: setSidebarOpen,
      isMobile,
    };
    
    if (isAreaDefault('leftPanel')) {
      // Default: render both sidebars (feature flags control visibility)
      return (
        <>
          {/* Old Sidebar - will be hidden when new sidebar feature is active */}
          <Sidebar {...panelProps} />
          
          {/* New Left Sidebar - only renders when feature flags are active */}
          <LeftSidebar {...panelProps} />
        </>
      );
    }
    
    // Custom component
    if (typeof config === 'function') {
      const CustomComponent = config as ComponentType<AreaProps>;
      return <CustomComponent {...panelProps} />;
    }
    
    return null;
  };
  
  /**
   * Render the main stage area.
   */
  const renderMainStage = (): React.ReactNode => {
    if (isAreaHidden('mainStage')) {
      return null;
    }
    
    const config = getAreaConfig('mainStage');
    const stageProps = {
      onMenuClick: () => setSidebarOpen(!isSidebarOpen),
      isMobile,
      scenarioView,
    };
    
    if (isAreaDefault('mainStage')) {
      return <MainContent {...stageProps} />;
    }
    
    if (typeof config === 'function') {
      const CustomComponent = config as ComponentType<AreaProps>;
      return <CustomComponent {...stageProps} />;
    }
    
    return null;
  };
  
  /**
   * Render the right panel area.
   */
  const renderRightPanel = (): React.ReactNode => {
    if (isAreaHidden('rightPanel')) {
      return null;
    }
    
    const config = getAreaConfig('rightPanel');
    const panelProps = {
      isOpen: isRightPanelOpen,
      setOpen: setRightPanelOpen,
      isMobile,
    };
    
    if (isAreaDefault('rightPanel')) {
      return <RightPanel {...panelProps} />;
    }
    
    if (typeof config === 'function') {
      const CustomComponent = config as ComponentType<AreaProps>;
      return <CustomComponent {...panelProps} />;
    }
    
    return null;
  };
  
  /**
   * Render the top bar area.
   */
  const renderTopBar = (): React.ReactNode => {
    if (isAreaHidden('topBar')) {
      return null;
    }
    
    const config = getAreaConfig('topBar');
    const barProps = {
      onMenuClick: () => setSidebarOpen(!isSidebarOpen),
      isMobile,
    };
    
    if (isAreaDefault('topBar')) {
      return <TopNavbar {...barProps} />;
    }
    
    if (typeof config === 'function') {
      const CustomComponent = config as ComponentType<AreaProps>;
      return <CustomComponent {...barProps} />;
    }
    
    return null;
  };
  
  // Layout class based on mode and state
  // For locations, we show the panel even when isSecondaryPanelOpen is false
  const hasSecondaryPanel = isSecondaryPanelOpen || activeNavId === 'locations';
  const layoutClasses = [
    'app-layout',
    `app-layout--${layoutMode}`,
    composer.id === 'restaurant' && hasSecondaryPanel ? 'has-secondary-panel' : '',
    composer.id === 'restaurant' && isCanvasOpen ? 'has-canvas' : '',
  ].filter(Boolean).join(' ');
  
  return (
    <div className="app-container">
      <div className={layoutClasses} data-concept={composer.id}>
        {renderLeftPanel()}
        {renderTopBar()}
        {renderMainStage()}
        {renderRightPanel()}
        {children}
      </div>
    </div>
  );
};

export default ComposedLayout;
