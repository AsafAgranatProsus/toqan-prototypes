import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  createdAt: Date;
  lastAccessedAt: Date;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string, icon?: string) => Workspace;
  deleteWorkspace: (workspaceId: string) => void;
  updateWorkspace: (workspaceId: string, updates: Partial<Omit<Workspace, 'id'>>) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const STORAGE_KEY = 'toqan-workspaces';
const ACTIVE_WORKSPACE_KEY = 'toqan-active-workspace-id';

// Default workspaces for prototyping
const defaultWorkspaces: Workspace[] = [
  {
    id: 'personal',
    name: 'Personal',
    createdAt: new Date('2024-01-01'),
    lastAccessedAt: new Date(),
  },
  {
    id: 'work',
    name: 'Work Projects',
    createdAt: new Date('2024-01-15'),
    lastAccessedAt: new Date('2024-12-01'),
  },
  {
    id: 'client-alpha',
    name: 'Client Alpha',
    createdAt: new Date('2024-02-01'),
    lastAccessedAt: new Date('2024-11-28'),
  },
];

// Load workspaces from localStorage
const loadWorkspaces = (): Workspace[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((ws: any) => ({
        ...ws,
        createdAt: new Date(ws.createdAt),
        lastAccessedAt: new Date(ws.lastAccessedAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load workspaces from localStorage:', error);
  }
  return defaultWorkspaces;
};

// Load active workspace ID from localStorage
const loadActiveWorkspaceId = (): string => {
  try {
    const stored = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
    if (stored) {
      return stored;
    }
  } catch (error) {
    console.error('Failed to load active workspace from localStorage:', error);
  }
  return 'personal'; // default
};

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(loadWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(loadActiveWorkspaceId);

  const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId) || workspaces[0] || null;

  // Save workspaces to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
    } catch (error) {
      console.error('Failed to save workspaces to localStorage:', error);
    }
  }, [workspaces]);

  // Save active workspace ID to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_WORKSPACE_KEY, activeWorkspaceId);
    } catch (error) {
      console.error('Failed to save active workspace to localStorage:', error);
    }
  }, [activeWorkspaceId]);

  const setActiveWorkspace = useCallback((workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
    
    // Update lastAccessedAt for the workspace
    setWorkspaces(prev => prev.map(ws => 
      ws.id === workspaceId 
        ? { ...ws, lastAccessedAt: new Date() }
        : ws
    ));
  }, []);

  const createWorkspace = useCallback((name: string, icon?: string): Workspace => {
    const newWorkspace: Workspace = {
      id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      icon,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    return newWorkspace;
  }, []);

  const deleteWorkspace = useCallback((workspaceId: string) => {
    setWorkspaces(prev => {
      const filtered = prev.filter(ws => ws.id !== workspaceId);
      
      // If we deleted the active workspace, switch to the first one
      if (workspaceId === activeWorkspaceId && filtered.length > 0) {
        setActiveWorkspaceId(filtered[0].id);
      }
      
      return filtered;
    });
  }, [activeWorkspaceId]);

  const updateWorkspace = useCallback((workspaceId: string, updates: Partial<Omit<Workspace, 'id'>>) => {
    setWorkspaces(prev => prev.map(ws => 
      ws.id === workspaceId 
        ? { ...ws, ...updates }
        : ws
    ));
  }, []);

  return (
    <WorkspaceContext.Provider value={{
      workspaces,
      activeWorkspace,
      setActiveWorkspace,
      createWorkspace,
      deleteWorkspace,
      updateWorkspace,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaces = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaces must be used within a WorkspaceProvider');
  }
  return context;
};
