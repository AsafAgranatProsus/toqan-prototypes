# Workspaces Feature

## Overview

The Workspaces feature enables users to organize their work into separate contexts, allowing designers and other users to seamlessly switch between multiple unrelated projects. This feature is particularly useful for users who manage multiple clients, projects, or personal/work contexts.

## Architecture

### Feature Flag
- **Flag Name**: `workspaces`
- **Location**: `featureFlags.ts`
- **Default**: `false` (disabled by default for gradual rollout)

To enable the feature:
```typescript
workspaces: true
```

Or via URL parameter:
```
?workspaces=true
```

### Context Management

The workspace system is managed through the `WorkspaceContext` located at `context/WorkspaceContext.tsx`.

#### Workspace Data Structure

```typescript
interface Workspace {
  id: string;              // Unique identifier
  name: string;            // Display name
  icon?: string;           // Optional icon identifier
  createdAt: Date;         // Creation timestamp
  lastAccessedAt: Date;    // Last access timestamp for sorting
}
```

#### Context API

The `useWorkspaces()` hook provides:

```typescript
{
  workspaces: Workspace[];              // All available workspaces
  activeWorkspace: Workspace | null;    // Currently active workspace
  setActiveWorkspace: (id: string) => void;     // Switch workspace
  createWorkspace: (name: string, icon?: string) => Workspace;  // Create new
  deleteWorkspace: (id: string) => void;        // Delete workspace
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;  // Update
}
```

### Data Persistence

Workspaces are persisted in localStorage:
- **Workspace List**: `toqan-workspaces`
- **Active Workspace ID**: `toqan-active-workspace-id`

Default workspaces for prototyping:
1. Personal
2. Work Projects
3. Client Alpha

### UI Integration

#### Left Sidebar Header

When the `workspaces` feature flag is enabled, the left sidebar header displays:
- **Logo**: The minimal "t" logo
- **Workspace Name**: Displayed to the right of the logo in a slightly larger font size than sidebar items
- **Dropdown**: Click to see all available workspaces and switch between them

The dropdown uses the existing `Dropdown` component with:
- Size: `tight`
- Displays all workspaces
- Shows selected state for active workspace
- Updates `lastAccessedAt` on workspace switch

## Context-Relative Data

### Current Implementation

When a workspace is active, all visible data should be filtered to that workspace context:
- **Sessions**: Pinned and recent sessions are workspace-specific
- **Recents**: History is per-workspace
- **Agents**: (Future) Agents will be workspace-relative

### Data Architecture for Context-Relative Content

To implement context-relative sessions and other content, follow this pattern:

```typescript
// Example: Session data structure with workspace relationship
interface Session {
  id: string;
  title: string;
  workspaceId: string;  // Link to workspace
  isPinned: boolean;
  lastActivity: Date;
  // ... other session fields
}

// Filtering sessions by workspace
const workspaceSessions = sessions.filter(
  session => session.workspaceId === activeWorkspace?.id
);
```

### Storage Strategy

For scalability, consider:

1. **Flat Storage**: Store all data with workspace IDs
   ```typescript
   localStorage.setItem('toqan-sessions', JSON.stringify(allSessions));
   ```

2. **Workspace-Specific Keys**: Separate storage per workspace
   ```typescript
   localStorage.setItem(`toqan-sessions-${workspaceId}`, JSON.stringify(sessions));
   ```

Option 1 (flat storage) is recommended for:
- Easier migration between workspaces
- Global search capabilities
- Better for cross-workspace analytics

## Future Enhancements

### Phase 2: Agents Integration
- Agents will be workspace-specific
- Each workspace can have its own set of configured agents
- Agent settings and customizations are isolated per workspace

### Phase 3: Workspace Settings
- Workspace-specific UI preferences
- Custom icons or colors per workspace
- Workspace-level integrations

### Phase 4: Collaboration
- Share workspaces with team members
- Workspace-level permissions
- Activity tracking per workspace

### Phase 5: Import/Export
- Export workspace data
- Import workspace configurations
- Workspace templates

## Developer Notes

### Adding Context-Relative Features

When adding new features that should be workspace-aware:

1. **Add workspace relationship** to the data model:
   ```typescript
   interface MyFeature {
     workspaceId: string;  // Always include this
     // ... other fields
   }
   ```

2. **Filter by active workspace** in components:
   ```typescript
   const { activeWorkspace } = useWorkspaces();
   const filteredData = allData.filter(
     item => item.workspaceId === activeWorkspace?.id
   );
   ```

3. **Handle workspace switching**:
   - Clear any workspace-specific UI state
   - Reload workspace-specific data
   - Update local storage keys if needed

4. **Consider edge cases**:
   - What happens when switching workspaces mid-action?
   - How to handle data without a workspace ID (legacy)?
   - Migration strategy for existing data

### Testing Workspace Switching

1. Enable the feature flag: `?workspaces=true`
2. Open the workspace dropdown in the left sidebar
3. Switch between workspaces
4. Verify that:
   - Active workspace updates immediately
   - Workspace name displays correctly
   - Selected state shows in dropdown
   - localStorage updates properly

## CSS Classes

New CSS classes added for workspace UI:

- `.left-sidebar__workspace-selector`: Container for logo + workspace name
- `.left-sidebar__workspace-name`: Workspace name text styling

The workspace name uses:
- Font size: `var(--font-size-body-default)` (slightly larger than sidebar items)
- Font weight: `var(--font-weight-medium)`
- Color: `var(--color-text-default)`

## Performance Considerations

- Workspace switching should be instantaneous (no API calls in prototype)
- Use React Context to avoid prop drilling
- Consider memoization for workspace-filtered data in production
- LocalStorage operations are synchronous - consider async alternatives for production

## Accessibility

- Workspace dropdown is fully keyboard navigable
- ARIA labels present for screen readers
- Focus management on workspace switch
- Clear visual indication of active workspace
