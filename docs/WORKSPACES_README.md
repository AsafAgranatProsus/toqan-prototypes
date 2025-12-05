# Workspaces Feature - Quick Start

## What's New

Added a **Workspaces** feature that allows users to organize their work into separate contexts and switch between them seamlessly.

## Quick Enable

Add to URL: `?workspaces=true&cleanUrl=true`

Or set in `featureFlags.ts`:
```typescript
workspaces: true
```

## What You'll See

When enabled, the left sidebar header will show:
- Minimal "t" logo
- Workspace name (e.g., "Personal", "Work Projects")
- Dropdown chevron

Clicking opens a dropdown with all available workspaces. Selecting a workspace switches context instantly.

## Default Workspaces

Three demo workspaces are included:
1. **Personal** - Default active workspace
2. **Work Projects**
3. **Client Alpha**

## Key Files

- `featureFlags.ts` - Feature flag definition
- `context/WorkspaceContext.tsx` - State management and API
- `components/LeftSidebar/LeftSidebar.tsx` - UI integration
- `components/LeftSidebar/LeftSidebar.css` - Workspace selector styles
- `docs/WORKSPACES_FEATURE.md` - Complete documentation

## Architecture Highlights

### Context-Relative Data
The architecture supports workspace-relative data:
- Sessions (pinned, recents)
- Agents (future)
- Integrations (future)

### Data Model
```typescript
interface Workspace {
  id: string;
  name: string;
  icon?: string;
  createdAt: Date;
  lastAccessedAt: Date;
}
```

### API
```typescript
const {
  workspaces,           // All workspaces
  activeWorkspace,      // Current workspace
  setActiveWorkspace,   // Switch workspace
  createWorkspace,      // Create new
  deleteWorkspace,      // Remove
  updateWorkspace       // Update properties
} = useWorkspaces();
```

## Implementation Notes

- ✅ Feature flag: `workspaces`
- ✅ Context provider: `WorkspaceProvider`
- ✅ UI integration: Left sidebar header
- ✅ LocalStorage persistence
- ✅ Default workspaces for prototyping
- ✅ Dropdown with selection state
- ✅ Proper font sizing (workspace name slightly larger than sidebar items)

## Next Steps for Context-Relative Features

To make sessions/agents workspace-aware:

1. Add `workspaceId` field to session/agent data models
2. Filter data by `activeWorkspace.id` in components
3. Update storage strategy to include workspace ID
4. Handle workspace switching gracefully

See `docs/WORKSPACES_FEATURE.md` for complete details.

## Testing

1. Enable feature flag
2. Check left sidebar header shows workspace dropdown
3. Click dropdown to see all workspaces
4. Switch between workspaces
5. Verify active workspace updates
6. Check localStorage for persistence

## Design Details

- Workspace name font: slightly larger than sidebar items
- Uses existing Dropdown component with `tight` size
- Maintains visual consistency with left sidebar design
- Smooth transitions and hover states
