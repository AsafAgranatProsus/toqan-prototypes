# Implementing Context-Relative Sessions - Guide

This guide shows how to make sessions workspace-aware, so that pinned and recent sessions are filtered by the active workspace.

## Step 1: Update Session Data Model

Add `workspaceId` to your session interface:

```typescript
// Example: sessions.ts or SessionContext.tsx
interface Session {
  id: string;
  title: string;
  workspaceId: string;  // 👈 Add this
  isPinned: boolean;
  isActive: boolean;
  lastActivity: Date;
  createdAt: Date;
  // ... other fields
}
```

## Step 2: Create Session Context (if not exists)

```typescript
// context/SessionContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useWorkspaces } from './WorkspaceContext';

interface SessionContextType {
  sessions: Session[];
  activeSessions: Session[]; // Filtered by workspace
  pinnedSessions: Session[]; // Filtered by workspace
  recentSessions: Session[]; // Filtered by workspace
  createSession: (title: string) => Session;
  deleteSession: (sessionId: string) => void;
  pinSession: (sessionId: string) => void;
  unpinSession: (sessionId: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeWorkspace } = useWorkspaces();
  const [sessions, setSessions] = useState<Session[]>([]);

  // Filter sessions by active workspace
  const activeSessions = sessions.filter(
    session => session.workspaceId === activeWorkspace?.id
  );

  const pinnedSessions = activeSessions.filter(s => s.isPinned);
  const recentSessions = activeSessions
    .filter(s => !s.isPinned)
    .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());

  const createSession = useCallback((title: string): Session => {
    if (!activeWorkspace) {
      throw new Error('No active workspace');
    }

    const newSession: Session = {
      id: `session-${Date.now()}`,
      title,
      workspaceId: activeWorkspace.id, // 👈 Link to workspace
      isPinned: false,
      isActive: true,
      lastActivity: new Date(),
      createdAt: new Date(),
    };

    setSessions(prev => [...prev, newSession]);
    return newSession;
  }, [activeWorkspace]);

  // ... other methods

  return (
    <SessionContext.Provider value={{
      sessions,
      activeSessions,
      pinnedSessions,
      recentSessions,
      createSession,
      // ...
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSessions must be used within SessionProvider');
  return context;
};
```

## Step 3: Add SessionProvider to App

```typescript
// index.tsx
root.render(
  <React.StrictMode>
    <FeatureFlagProvider>
      <WorkspaceProvider>
        <SessionProvider>  {/* 👈 Add here, after WorkspaceProvider */}
          <ScenarioProvider>
            <DesignSystemProvider>
              <ThemeCustomizationProvider>
                <App />
              </ThemeCustomizationProvider>
            </DesignSystemProvider>
          </ScenarioProvider>
        </SessionProvider>
      </WorkspaceProvider>
    </FeatureFlagProvider>
  </React.StrictMode>
);
```

## Step 4: Update LeftSidebar to Use Context

```typescript
// components/LeftSidebar/LeftSidebar.tsx
import { useSessions } from '../../context/SessionContext';

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, setOpen, isMobile }) => {
  const { isFeatureActive } = useFeatureFlags();
  const { activeWorkspace } = useWorkspaces();
  const { pinnedSessions, recentSessions } = useSessions();  // 👈 Use hook

  // ... rest of component

  return (
    <aside className={sidebarClasses} style={sidebarStyle}>
      {/* ... header ... */}

      <div className="left-sidebar__sessions-container">
        {/* Pinned Sessions */}
        {pinnedSessions.map((session) => (
          <div key={session.id} className="left-sidebar__session-item left-sidebar__session-item--pinned">
            <Icons name="Pin" />
            <span className="left-sidebar__session-title">{session.title}</span>
          </div>
        ))}

        {/* Recents Section */}
        {recentsExpanded && (
          <div className="left-sidebar__session-list">
            {recentSessions.map((session) => (
              <div key={session.id} className="left-sidebar__session-item left-sidebar__session-item--child">
                <Icons name="CornerDownRight" />
                <span className="left-sidebar__session-title">{session.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
```

## Step 5: Handle Workspace Switching

The filtering happens automatically because the context recalculates filtered sessions when `activeWorkspace` changes:

```typescript
// In SessionContext
const activeSessions = sessions.filter(
  session => session.workspaceId === activeWorkspace?.id
);
```

When the user switches workspaces:
1. `activeWorkspace` updates in WorkspaceContext
2. SessionContext re-renders
3. `activeSessions`, `pinnedSessions`, `recentSessions` automatically update
4. LeftSidebar re-renders with new filtered data

## Step 6: Persist Sessions to LocalStorage

```typescript
// In SessionProvider
const STORAGE_KEY = 'toqan-sessions';

// Load sessions on mount
useEffect(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSessions(parsed.map(s => ({
        ...s,
        lastActivity: new Date(s.lastActivity),
        createdAt: new Date(s.createdAt),
      })));
    }
  } catch (error) {
    console.error('Failed to load sessions:', error);
  }
}, []);

// Save sessions when they change
useEffect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions:', error);
  }
}, [sessions]);
```

## Step 7: Migration for Existing Data (Optional)

If you have existing sessions without `workspaceId`:

```typescript
// Migrate existing sessions to default workspace
useEffect(() => {
  const needsMigration = sessions.some(s => !s.workspaceId);
  
  if (needsMigration && activeWorkspace) {
    setSessions(prev => prev.map(session => ({
      ...session,
      workspaceId: session.workspaceId || 'personal', // Default to 'personal'
    })));
  }
}, [sessions, activeWorkspace]);
```

## Edge Cases to Handle

### 1. Creating Session Without Active Workspace
```typescript
const createSession = useCallback((title: string): Session => {
  if (!activeWorkspace) {
    console.error('No active workspace - cannot create session');
    return null;
  }
  // ... create session
}, [activeWorkspace]);
```

### 2. Switching Workspace Mid-Action
Clear any active session state when switching:
```typescript
// In WorkspaceContext
const setActiveWorkspace = useCallback((workspaceId: string) => {
  setActiveWorkspaceId(workspaceId);
  
  // Notify other contexts about workspace switch
  window.dispatchEvent(new CustomEvent('workspace-changed', { 
    detail: { workspaceId } 
  }));
}, []);
```

### 3. No Sessions in Workspace
Show empty state in LeftSidebar:
```typescript
{pinnedSessions.length === 0 && recentSessions.length === 0 && (
  <div className="left-sidebar__empty-state">
    <p>No sessions in this workspace yet</p>
    <Button onClick={createNewSession}>Create Session</Button>
  </div>
)}
```

## Testing Checklist

- [ ] Create session in Workspace A
- [ ] Create session in Workspace B
- [ ] Switch to Workspace A - only see A's sessions
- [ ] Switch to Workspace B - only see B's sessions
- [ ] Pin a session in Workspace A
- [ ] Switch to B and back to A - pinned session still pinned
- [ ] Refresh page - sessions persist correctly
- [ ] Delete a session - only deletes from current workspace

## Performance Optimization

For large numbers of sessions, consider memoization:

```typescript
import { useMemo } from 'react';

const activeSessions = useMemo(
  () => sessions.filter(s => s.workspaceId === activeWorkspace?.id),
  [sessions, activeWorkspace?.id]
);

const pinnedSessions = useMemo(
  () => activeSessions.filter(s => s.isPinned),
  [activeSessions]
);

const recentSessions = useMemo(
  () => activeSessions
    .filter(s => !s.isPinned)
    .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()),
  [activeSessions]
);
```

## Summary

1. Add `workspaceId` to session data model
2. Create SessionContext with filtering logic
3. Filter sessions by `activeWorkspace.id`
4. Use filtered sessions in UI components
5. Handle edge cases (no workspace, switching, empty state)
6. Persist to localStorage
7. Test thoroughly

The same pattern applies to agents, integrations, and any other workspace-relative features.
