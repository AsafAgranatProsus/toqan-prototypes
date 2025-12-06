# GroupedButtons Component

A fully agnostic, reusable grouped button selector component inspired by Material Design 3 contrast selectors. This component provides a unified interface for creating button groups with a sliding highlight indicator and flexible content options.

## Features

✨ **Content Flexibility**
- Icon-only buttons
- Text-only buttons  
- Icon + Text combined
- Custom React content

🎨 **Theme Integration**
- Uses design tokens for colors, spacing, and transitions
- Automatic dark/light mode support
- Consistent with system-wide theming

📏 **Size Variants**
- Small (`sm`)
- Medium (`md`) - default
- Large (`lg`)

♿ **Accessibility**
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

## Usage

### Basic Example (Icon-only)

```tsx
import { GroupedButtons, GroupedButton } from '../components/GroupedButtons';

const MyComponent = () => {
  const [selected, setSelected] = useState('option1');
  
  const buttons: GroupedButton[] = [
    { id: 'option1', icon: 'Sun', title: 'Light mode' },
    { id: 'option2', icon: 'Moon', title: 'Dark mode' },
    { id: 'option3', icon: 'Monitor', title: 'Auto mode' },
  ];
  
  return (
    <GroupedButtons
      buttons={buttons}
      activeId={selected}
      onChange={setSelected}
      ariaLabel="Theme selector"
    />
  );
};
```

### Text-only Buttons

```tsx
const buttons: GroupedButton[] = [
  { id: 'daily', label: 'Daily', title: 'View daily data' },
  { id: 'weekly', label: 'Weekly', title: 'View weekly data' },
  { id: 'monthly', label: 'Monthly', title: 'View monthly data' },
];

<GroupedButtons
  buttons={buttons}
  activeId={period}
  onChange={setPeriod}
  size="lg"
/>
```

### Icon + Text Combination

```tsx
const buttons: GroupedButton[] = [
  { id: 'list', icon: 'List', label: 'List', title: 'List view' },
  { id: 'grid', icon: 'Grid', label: 'Grid', title: 'Grid view' },
  { id: 'table', icon: 'Table', label: 'Table', title: 'Table view' },
];

<GroupedButtons
  buttons={buttons}
  activeId={viewMode}
  onChange={setViewMode}
/>
```

### Custom Content

```tsx
const buttons: GroupedButton[] = [
  {
    id: 'standard',
    title: 'Standard contrast',
    content: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        {/* Custom SVG content */}
      </svg>
    ),
  },
  // ... more buttons
];

<GroupedButtons
  buttons={buttons}
  activeId={contrast}
  onChange={setContrast}
/>
```

## API Reference

### GroupedButtons Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttons` | `GroupedButton[]` | **required** | Array of button definitions (minimum 2) |
| `activeId` | `string` | **required** | ID of the currently active button |
| `onChange` | `(id: string) => void` | **required** | Callback fired when a button is clicked |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant of the button group |
| `className` | `string` | `''` | Additional CSS class for the container |
| `ariaLabel` | `string` | `undefined` | ARIA label for the button group |

### GroupedButton Interface

```typescript
interface GroupedButton {
  /** Unique identifier for the button */
  id: string;
  
  /** Icon name from the Icons component */
  icon?: IconName;
  
  /** Text label */
  label?: string;
  
  /** Tooltip/title for accessibility (required) */
  title: string;
  
  /** Custom aria-label (defaults to title if not provided) */
  ariaLabel?: string;
  
  /** Custom content (overrides icon and label) */
  content?: React.ReactNode;
}
```

## Content Priority

The component resolves content in the following order:

1. **Custom content** (`content` prop) - highest priority
2. **Icon + Label** (both `icon` and `label` props)
3. **Icon only** (`icon` prop)
4. **Label only** (`label` prop)

## Styling

The component uses CSS custom properties from your design system:

- `--theme-border` - Border color
- `--theme-text-accent` - Hover border color
- `--theme-text-tertiary` - Inactive button color
- `--theme-text-secondary` - Hover button color
- `--theme-btn-primary-text` - Active button text color
- `--theme-btn-tertiary-bg` - Highlight background
- `--border-radius-md` - Border radius
- `--transition-fast` - Transition timing
- `--font-size-sm` - Font size
- `--font-weight-medium` - Font weight

### Custom Styling

You can add custom styles using the `className` prop:

```tsx
<GroupedButtons
  buttons={buttons}
  activeId={selected}
  onChange={setSelected}
  className="my-custom-class"
/>
```

## Real-World Examples

### Theme Toggle (from ThemeToggle component)

```tsx
export const ThemeToggle: React.FC = ({ showAuto = true }) => {
  const { themeMode, setThemeMode } = useDesignSystem();

  const buttons: GroupedButton[] = [
    { id: 'light', icon: 'Sun', title: 'Light theme' },
    { id: 'dark', icon: 'Moon', title: 'Dark theme' },
    ...(showAuto ? [{ id: 'auto', icon: 'Monitor', title: 'Auto theme' }] : []),
  ];

  return (
    <GroupedButtons
      buttons={buttons}
      activeId={themeMode}
      onChange={(id) => setThemeMode(id as ThemeMode)}
      ariaLabel="Theme mode selector"
    />
  );
};
```

### Contrast Selector (from M3ThemeBuilder)

```tsx
const contrastButtons: GroupedButton[] = [
  {
    id: CONTRAST_STANDARD.toString(),
    title: 'Standard contrast',
    content: <ContrastIcon level="standard" />,
  },
  {
    id: CONTRAST_MEDIUM.toString(),
    title: 'Medium contrast',
    content: <ContrastIcon level="medium" />,
  },
  {
    id: CONTRAST_HIGH.toString(),
    title: 'High contrast',
    content: <ContrastIcon level="high" />,
  },
];

<GroupedButtons
  buttons={contrastButtons}
  activeId={contrastLevel.toString()}
  onChange={(id) => setContrastLevel(parseFloat(id))}
  ariaLabel="Contrast level"
/>
```

## Migration Guide

### From Custom Implementation

If you have an existing grouped button implementation like the m3-contrast-selector:

**Before:**
```tsx
<div className="m3-contrast-selector" role="group">
  <button className={`m3-contrast-btn ${active ? 'active' : ''}`}>
    <svg>...</svg>
  </button>
  {/* More buttons */}
</div>
```

**After:**
```tsx
<GroupedButtons
  buttons={[
    { id: '1', content: <svg>...</svg>, title: 'Option 1' },
    // More buttons
  ]}
  activeId={selected}
  onChange={setSelected}
/>
```

## Best Practices

1. **Always provide titles** - Required for accessibility
2. **Use 2-5 buttons** - More than 5 may overflow on small screens
3. **Be consistent** - Use the same content type (icon-only, text-only, etc.) across all buttons in a group
4. **Custom aria-labels** - Provide custom `ariaLabel` for better context
5. **Responsive design** - Consider using different sizes for different breakpoints

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Related Components

- `ThemeToggle` - Uses GroupedButtons for theme selection
- `M3ThemeBuilder` - Uses GroupedButtons for contrast level selection
- `Toggle` - Single on/off toggle (different use case)
