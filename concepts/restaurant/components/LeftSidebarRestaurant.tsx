/**
 * Restaurant Left Sidebar
 * 
 * A copy of the core LeftSidebar customized for the restaurant concept.
 * Feel free to modify this without affecting the core sidebar.
 * 
 * Differences from core:
 * - No feature flag check (composer controls visibility)
 * - Restaurant-specific navigation items
 * - Can diverge freely from core
 */

import React, { useState, useEffect, useRef } from 'react';
import { useFeatureFlags } from '../../../context/FeatureFlagContext';
import { useWorkspaces } from '../../../context/WorkspaceContext';
import { Logo } from '../../../components/Logo/Logo';
import { Icons } from '../../../components/Icons/Icons';
import Button from '../../../components/Button/Button';
import { ResizeHandle } from '../../../components/ResizeHandle/ResizeHandle';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { WorkspaceMenu } from '../../../components/WorkspaceMenu/WorkspaceMenu';
import { ThemeToggle } from '../../../components/ThemeToggle/ThemeToggle';
import { ThemeSelector } from '../../../components/ThemeSelector';
import { AreaProps } from '../../composer/types';
import { useRestaurant } from '../context/RestaurantContext';
import { useChatSession } from '../../../shared/chatSession';
import type { IconName } from '../../../types';
import './LeftSidebarRestaurant.css';

// Restaurant navigation configuration
interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  path?: string;
  badge?: string | number;
}

const RESTAURANT_NAV: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'priorities', label: 'Priorities', icon: 'FileStack' },
  { id: 'Assets', label: 'Assets', icon: 'FileText' }
  // { id: 'dashboard', label: 'Dashboard', icon: 'Layout' },
  // { id: 'orders', label: 'Orders', icon: 'FileText' },
  // { id: 'menu', label: 'Menu', icon: 'Library' },
  // { id: 'analytics', label: 'Analytics', icon: 'BarChart2' },
  // { id: 'customers', label: 'Customers', icon: 'User' },
];

const DEFAULT_WIDTH = 220;
const MIN_WIDTH = 150;
const MAX_WIDTH = 600;
const COLLAPSED_WIDTH = 56;
const STORAGE_KEY = 'toqan-restaurant-left-sidebar-width';
const COLLAPSED_STORAGE_KEY = 'toqan-restaurant-left-sidebar-collapsed';

export const LeftSidebarRestaurant: React.FC<AreaProps> = ({ isOpen, setOpen, isMobile }) => {
  const { isFeatureActive, flags } = useFeatureFlags();
  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspaces();
  const {
    isSecondaryPanelOpen,
    toggleSecondaryPanel,
    openSecondaryPanel,
    closeSecondaryPanel,
    activeNavId,
    setActiveNavId,
    selectAsset,
  } = useRestaurant();
  
  const { 
    persistedSessions, 
    startNewChat, 
    resumeSession,
    activeSession,
  } = useChatSession();

  // Load width from localStorage
  const [width, setWidth] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : DEFAULT_WIDTH;
    } catch {
      return DEFAULT_WIDTH;
    }
  });

  // Collapsed state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem(COLLAPSED_STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Restaurant-specific: Orders section expanded state
  const [ordersExpanded, setOrdersExpanded] = useState(true);
  
  // Recent chats expanded state
  const [recentChatsExpanded, setRecentChatsExpanded] = useState(true);

  // Hover state for collapsed sidebar reveal
  const [isHovered, setIsHovered] = useState(false);
  const [isContentHovered, setIsContentHovered] = useState(false);
  const contentHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save width to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(width));
    } catch (error) {
      console.error('Failed to save sidebar width:', error);
    }
  }, [width]);

  // Save collapsed state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(isCollapsed));
    } catch (error) {
      console.error('Failed to save sidebar collapsed state:', error);
    }
  }, [isCollapsed]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (contentHoverTimeoutRef.current) {
        clearTimeout(contentHoverTimeoutRef.current);
      }
    };
  }, []);

  // Note: No feature flag check here - composer controls visibility

  const handleResize = (newWidth: number) => {
    setWidth(newWidth);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarClasses = [
    'left-sidebar-restaurant side-panel',
    isMobile ? 'left-sidebar-restaurant--mobile' : '',
    isOpen ? 'left-sidebar-restaurant--open' : '',
    isCollapsed ? 'left-sidebar-restaurant--collapsed' : '',
    isHovered ? 'left-sidebar-restaurant--hovered' : ''
  ].filter(Boolean).join(' ');

  const sidebarStyle: React.CSSProperties = {
    width: isMobile ? '100%' : isCollapsed ? `${COLLAPSED_WIDTH}px` : `${width}px`,
    minWidth: isMobile ? undefined : isCollapsed ? `${COLLAPSED_WIDTH}px` : `${width}px`,
    maxWidth: isMobile ? undefined : isCollapsed ? `${COLLAPSED_WIDTH}px` : `${width}px`,
  };

  // Content container keeps fixed width to prevent reflow during collapse/expand animation
  const contentStyle: React.CSSProperties = {
    width: isMobile ? '100%' : `${width}px`,
    minWidth: isMobile ? undefined : `${width}px`,
  };

  const contentClasses = [
    'left-sidebar-restaurant__content',
    isContentHovered ? 'left-sidebar-restaurant__content--hovered' : ''
  ].filter(Boolean).join(' ');

  return (
    <aside
      className={sidebarClasses}
      style={sidebarStyle}
      onMouseEnter={() => {
        // Only add hovered class when sidebar is collapsed
        if (isCollapsed) {
          setIsHovered(true);
        }
      }}
    >
      <div
        className={contentClasses}
        style={contentStyle}
        onMouseEnter={() => {
          // Only add hovered class when sidebar is collapsed
          if (!isCollapsed) return;

          // Clear any existing timeout
          if (contentHoverTimeoutRef.current) {
            clearTimeout(contentHoverTimeoutRef.current);
          }
          // Delay adding the hovered class by 300ms
          contentHoverTimeoutRef.current = setTimeout(() => {
            setIsContentHovered(true);
          }, 300);
        }}
        onMouseLeave={() => {
          // Clear the timeout if mouse leaves before 300ms
          if (contentHoverTimeoutRef.current) {
            clearTimeout(contentHoverTimeoutRef.current);
            contentHoverTimeoutRef.current = null;
          }
          setIsHovered(false);
          setIsContentHovered(false);
        }}
      >
        <div className="left-sidebar-restaurant__header">
          {isFeatureActive('workspaces') ? (
            <Dropdown size="normal" showChevron={true} className="left-sidebar-restaurant__workspace-selector">
              <Dropdown.Trigger>
                <div className="flex gap-4">
                  <Logo variant="minimal" />
                  <span className="left-sidebar-restaurant__workspace-name">
                    <span className="left-sidebar-restaurant__workspace-name-title">
                      Restaurant
                    </span>
                    <span className="left-sidebar-restaurant__workspace-name-text">
                      {activeWorkspace?.name || 'My Restaurant'}
                    </span>
                  </span>
                </div>
              </Dropdown.Trigger>
              <Dropdown.Menu custom={true} coverTrigger={true}>
                <WorkspaceMenu />
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button
              variant="text"
              className="left-sidebar-restaurant__logo-button"
              aria-label={isCollapsed ? "Expand sidebar" : "Open workspace menu"}
              onClick={isCollapsed ? toggleCollapse : undefined}
            >
              <span className="flex items-center gap-1">
                <Logo variant="minimal" />
                <Icons name="ChevronDown" />
              </span>
            </Button>
          )}
          <div className="flex items-center gap-2">
           
              {/* New button - commented out, replaced by Home nav item
              <Button
                size={width > 200 ? 'sm' : null}
                shape="circle"
                variant="outlined"
                icon="SquarePen"
                aria-label="New conversation"
                className="left-sidebar-restaurant__new-button"
                onClick={() => {
                  // Clear active chat
                  startNewChat();
                  // Close secondary panels (assets, priorities)
                  closeSecondaryPanel();
                  // Close canvas if open
                  selectAsset(null);
                }}
              >
                {width < 200 ? null : 'New'}
              </Button>
              */}
            <Button
              variant="text"
              shape="circle"
              icon="PanelLeft"
              className="left-sidebar-restaurant__menu-button"
              aria-label="Collapse sidebar"
              onClick={toggleCollapse}
            />
          </div>
        </div>

        {/* Restaurant-specific navigation */}
        <nav className="left-sidebar-restaurant__nav">
          {RESTAURANT_NAV.map((item) => {
            const hasSidePanel = item.id === 'Assets' || item.id === 'priorities';
            const isHome = item.id === 'home';
            // Home is active when there's no active session and no secondary panel open
            // Other items: show active if panel is open (for items with side panels)
            const isActive = isHome 
              ? activeNavId === 'home' || (!activeSession && !isSecondaryPanelOpen)
              : activeNavId === item.id && (!hasSidePanel || isSecondaryPanelOpen);

            const handleClick = () => {
              setActiveNavId(item.id);
              
              // Home nav: same behavior as 'New' button
              if (isHome) {
                startNewChat();
                closeSecondaryPanel();
                selectAsset(null);
                return;
              }
              
              // Toggle secondary panel when clicking items with side panels
              if (hasSidePanel) {
                if (isActive) {
                  // Already active - toggle panel
                  toggleSecondaryPanel();
                } else {
                  // Newly selected - open panel
                  openSecondaryPanel();
                }
              }
            };

            return (
              <div
                key={item.id}
                className={`left-sidebar-restaurant__nav-item ${isActive ? 'left-sidebar-restaurant__nav-item--active' : ''
                  }`}
                onClick={handleClick}
              >
                <Icons name={item.icon} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="left-sidebar-restaurant__nav-badge">{item.badge}</span>
                )}
              </div>
            );
          })}
        </nav>

        <div className="left-sidebar-restaurant__sessions-container">         
          
          <div className="left-sidebar-restaurant__sessions-header">
            <div className="left-sidebar-restaurant__nav-item left-sidebar-restaurant__nav-item--with-chevron">
              <Icons name="MessageSquare" />
              <span>Chats</span>
              <Icons name="ChevronRight" />
            </div>
          </div>

          {/* Active Orders Section - HIDDEN for now */}
          {false && (
            <>
              <div
                className="left-sidebar-restaurant__section-toggle"
                onClick={() => setOrdersExpanded(!ordersExpanded)}
              >
                <div className="left-sidebar-restaurant__section-toggle-content">
                  <Icons name="Clock" />
                  <span>Active Orders</span>
                </div>
                <Icons name={ordersExpanded ? "ChevronUp" : "ChevronDown"} />
              </div>

              {ordersExpanded && (
                <div className="left-sidebar-restaurant__session-list">
                  <div className="left-sidebar-restaurant__session-item">
                    <Icons name="FileText" />
                    <span className="left-sidebar-restaurant__session-title">Table 5 - 3 guests</span>
                  </div>
                  <div className="left-sidebar-restaurant__session-item">
                    <Icons name="FileText" />
                    <span className="left-sidebar-restaurant__session-title">Table 12 - 6 guests</span>
                  </div>
                  <div className="left-sidebar-restaurant__session-item">
                    <Icons name="FileText" />
                    <span className="left-sidebar-restaurant__session-title">Takeout #1042</span>
                  </div>
                  <div className="left-sidebar-restaurant__session-item">
                    <Icons name="FileText" />
                    <span className="left-sidebar-restaurant__session-title">Delivery #1043</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Recent Chats */}
          <div 
            className="left-sidebar-restaurant__section-toggle"
            onClick={() => setRecentChatsExpanded(!recentChatsExpanded)}
          >
            <div className="left-sidebar-restaurant__section-toggle-content">
              <Icons name="History" />
              <span>Recent Chats</span>
            </div>
            <Icons name={recentChatsExpanded ? "ChevronDown" : "ChevronRight"} />
          </div>
          
          {recentChatsExpanded && persistedSessions.length > 0 && (
            <div className="left-sidebar-restaurant__session-list">
              {persistedSessions.slice(0, 10).map((session) => {
                const isActive = activeSession?.id === session.id;
                return (
                  <div 
                    key={session.id}
                    className={`left-sidebar-restaurant__session-item ${isActive ? 'left-sidebar-restaurant__session-item--active' : ''}`}
                    onClick={() => resumeSession(session.id)}
                  >
                    <Icons name="MessageSquare" />
                    <span className="left-sidebar-restaurant__session-title">
                      {session.title || 'Conversation'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          
          {recentChatsExpanded && persistedSessions.length === 0 && (
            <div className="left-sidebar-restaurant__empty-state">
              <span>No recent chats</span>
            </div>
          )}
        </div>

        {(flags.themes || flags.themeSelector) && (
          <div className="left-sidebar-restaurant__footer">
            <span className="flex-between">
              {flags.themes && <ThemeToggle />}
              {flags.themeSelector && <ThemeSelector />}
            </span>
          </div>
        )}

        {/* Resize handle */}
        {isFeatureActive('newResizeablePanels') && !isMobile && !isCollapsed && (
          <ResizeHandle
            onResize={handleResize}
            currentWidth={width}
            minWidth={MIN_WIDTH}
            maxWidth={MAX_WIDTH}
            defaultWidth={DEFAULT_WIDTH}
            position="right"
            bufferSize={20}
          />
        )}
      </div>
    </aside>
  );
};

export default LeftSidebarRestaurant;
