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

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  { id: 'locations', label: 'Locations', icon: 'Store' },
  { id: 'Library', label: 'Library', icon: 'FileText' }
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
    navigateToNav,
    selectAsset,
    selectLocation,
  } = useRestaurant();
  
  const { 
    persistedSessions, 
    pinnedSessions,
    startNewChat, 
    resumeSession,
    endSession,
    deleteSession,
    pinSession,
    unpinSession,
    activeSession,
  } = useChatSession();
  
  // Track which session's menu is open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Handle clicking on a history item - clears nav state and opens conversation
  const handleHistoryItemClick = useCallback((sessionId: string) => {
    // Clear nav selection (empty string = no nav active)
    navigateToNav('');
    // Close any open panel
    closeSecondaryPanel();
    // Resume the session
    resumeSession(sessionId);
  }, [navigateToNav, closeSecondaryPanel, resumeSession]);

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
          {RESTAURANT_NAV
            .filter((item) => item.id !== 'locations' || isFeatureActive('restaurantLocations'))
            .map((item) => {
            const hasSidePanel = item.id === 'Library' || item.id === 'priorities';
            const isHome = item.id === 'home';
            const isLocations = item.id === 'locations';
            
            // Active state logic:
            // - Locations: simple check for activeNavId === 'locations'
            // - Home: exclude when locations is active to prevent both being highlighted
            // - Other items: show active if panel is open (for items with side panels)
            const isActive = isLocations
              ? activeNavId === 'locations'
              : isHome 
                ? (activeNavId === 'home' && !activeSession) || 
                  (!activeSession && !isSecondaryPanelOpen && activeNavId !== 'locations')
                : activeNavId === item.id && (!hasSidePanel || isSecondaryPanelOpen);

            const handleClick = () => {
              // End any active chat session when switching nav items
              endSession();
              
              // Navigate clears any active selections (asset, location) to reset conversation state
              navigateToNav(item.id);
              
              // Home nav: same behavior as 'New' button
              if (isHome) {
                startNewChat();
                closeSecondaryPanel();
                return;
              }
              
              // Locations nav: close secondary panel, reset to grid view
              if (isLocations) {
                closeSecondaryPanel();
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

          {/* Pinned */}
          {pinnedSessions.length > 0 && (
            <div className="left-sidebar-restaurant__pinned-list">
              {pinnedSessions.map((session) => {
                const isActive = activeSession?.id === session.id;
                const isMenuOpen = openMenuId === session.id;
                return (
                  <div 
                    key={session.id}
                    className={`left-sidebar-restaurant__pinned-item ${isActive ? 'left-sidebar-restaurant__pinned-item--active' : ''}`}
                    onClick={() => handleHistoryItemClick(session.id)}
                  >
                    <Icons name="Pin" className="left-sidebar-restaurant__pinned-icon" />
                    <span className="left-sidebar-restaurant__pinned-title">
                      {session.title || 'Conversation'}
                    </span>
                    <div className="left-sidebar-restaurant__session-menu-wrapper" onClick={(e) => e.stopPropagation()}>
                      <Dropdown 
                        showChevron={false}
                        truncateText={false}
                        className="left-sidebar-restaurant__session-menu"
                        onOpenChange={(open) => setOpenMenuId(open ? session.id : null)}
                      >
                        <Dropdown.Trigger className={`left-sidebar-restaurant__session-menu-trigger ${isMenuOpen ? 'left-sidebar-restaurant__session-menu-trigger--open' : ''}`}>
                          <Icons name="MoreVertical" />
                        </Dropdown.Trigger>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => unpinSession(session.id)}>
                            <Icons name="PinOff" />
                            <span>Unpin</span>
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => { /* Rename - TODO */ }}>
                            <Icons name="Edit2" />
                            <span>Rename</span>
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => deleteSession(session.id)}>
                            <Icons name="Trash" />
                            <span>Delete</span>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* History */}
          <div 
            className="left-sidebar-restaurant__section-toggle"
            onClick={() => setRecentChatsExpanded(!recentChatsExpanded)}
          >
            <div className="left-sidebar-restaurant__section-toggle-content">
              <Icons name="History" />
              <span>History</span>
            </div>
            <Icons name={recentChatsExpanded ? "ChevronDown" : "ChevronRight"} />
          </div>
          
          {recentChatsExpanded && persistedSessions.length > 0 && (
            <div className="left-sidebar-restaurant__session-list">
              {persistedSessions.slice(0, 10).map((session) => {
                const isActive = activeSession?.id === session.id;
                const isMenuOpen = openMenuId === session.id;
                return (
                  <div 
                    key={session.id}
                    className={`left-sidebar-restaurant__session-item ${isActive ? 'left-sidebar-restaurant__session-item--active' : ''}`}
                    onClick={() => handleHistoryItemClick(session.id)}
                  >
                    <span className="left-sidebar-restaurant__session-title">
                      {session.title || 'Conversation'}
                    </span>
                    <div className="left-sidebar-restaurant__session-menu-wrapper" onClick={(e) => e.stopPropagation()}>
                      <Dropdown 
                        showChevron={false}
                        truncateText={false}
                        className="left-sidebar-restaurant__session-menu"
                        onOpenChange={(open) => setOpenMenuId(open ? session.id : null)}
                      >
                        <Dropdown.Trigger className={`left-sidebar-restaurant__session-menu-trigger ${isMenuOpen ? 'left-sidebar-restaurant__session-menu-trigger--open' : ''}`}>
                          <Icons name="MoreVertical" />
                        </Dropdown.Trigger>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => pinSession(session.id)}>
                            <Icons name="Pin" />
                            <span>Pin</span>
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => { /* Rename - TODO */ }}>
                            <Icons name="Edit2" />
                            <span>Rename</span>
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => deleteSession(session.id)}>
                            <Icons name="Trash" />
                            <span>Delete</span>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                );
              })}
              <div className="left-sidebar-restaurant__all-history">
                <span>All History</span>
                <Icons name="ChevronRight" />
              </div>
            </div>
          )}
          
          {recentChatsExpanded && persistedSessions.length === 0 && pinnedSessions.length === 0 && (
            <div className="left-sidebar-restaurant__empty-state">
              <span>No chats yet</span>
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
