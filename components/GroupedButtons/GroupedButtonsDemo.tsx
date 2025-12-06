import React, { useState } from 'react';
import { GroupedButtons, GroupedButton } from './GroupedButtons';
import type { IconName } from '../../types';

/**
 * GroupedButtonsDemo - Showcases various configurations of the GroupedButtons component
 * This file serves as both documentation and a testing ground for the component.
 */
export const GroupedButtonsDemo: React.FC = () => {
  // Example 1: Icon-only (Theme selector)
  const [theme, setTheme] = useState('light');
  const themeButtons: GroupedButton[] = [
    { id: 'light', icon: 'Sun', title: 'Light theme' },
    { id: 'dark', icon: 'Moon', title: 'Dark theme' },
    { id: 'auto', icon: 'Monitor', title: 'Auto theme (system)' },
  ];

  // Example 2: Text-only (Time period selector)
  const [period, setPeriod] = useState('week');
  const periodButtons: GroupedButton[] = [
    { id: 'day', label: 'Day', title: 'View daily data' },
    { id: 'week', label: 'Week', title: 'View weekly data' },
    { id: 'month', label: 'Month', title: 'View monthly data' },
    { id: 'year', label: 'Year', title: 'View yearly data' },
  ];

  // Example 3: Icon + Text (View mode selector)
  const [viewMode, setViewMode] = useState('grid');
  const viewButtons: GroupedButton[] = [
    { id: 'list', icon: 'Menu', label: 'List', title: 'List view' },
    { id: 'grid', icon: 'Layout', label: 'Grid', title: 'Grid view' },
  ];

  // Example 4: Two options (Alignment)
  const [align, setAlign] = useState('left');
  const alignButtons: GroupedButton[] = [
    { id: 'left', icon: 'ChevronLeft', title: 'Align left' },
    { id: 'right', icon: 'ChevronRight', title: 'Align right' },
  ];

  // Example 5: Many options (Font size)
  const [fontSize, setFontSize] = useState('md');
  const fontButtons: GroupedButton[] = [
    { id: 'xs', label: 'XS', title: 'Extra small' },
    { id: 'sm', label: 'S', title: 'Small' },
    { id: 'md', label: 'M', title: 'Medium' },
    { id: 'lg', label: 'L', title: 'Large' },
    { id: 'xl', label: 'XL', title: 'Extra large' },
  ];

  // Example 6: Custom content (Sort direction)
  const [sort, setSort] = useState('asc');
  const sortButtons: GroupedButton[] = [
    {
      id: 'asc',
      title: 'Ascending',
      content: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l-8 8h6v8h4v-8h6z" />
        </svg>
      ),
    },
    {
      id: 'desc',
      title: 'Descending',
      content: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l8-8h-6V4h-4v8H4z" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <section>
        <h2>GroupedButtons Component Examples</h2>
        <p>A showcase of various configurations and use cases</p>
      </section>

      {/* Example 1 */}
      <section>
        <h3>1. Icon-only (Theme Selector)</h3>
        <p>Classic theme toggle with three options</p>
        <GroupedButtons
          buttons={themeButtons}
          activeId={theme}
          onChange={setTheme}
          ariaLabel="Theme selector"
        />
        <small style={{ marginTop: '0.5rem', display: 'block', opacity: 0.7 }}>
          Selected: {theme}
        </small>
      </section>

      {/* Example 2 */}
      <section>
        <h3>2. Text-only (Time Period)</h3>
        <p>Four text options for data period selection</p>
        <GroupedButtons
          buttons={periodButtons}
          activeId={period}
          onChange={setPeriod}
          size="lg"
          ariaLabel="Time period selector"
        />
        <small style={{ marginTop: '0.5rem', display: 'block', opacity: 0.7 }}>
          Selected: {period}
        </small>
      </section>

      {/* Example 3 */}
      <section>
        <h3>3. Icon + Text (View Mode)</h3>
        <p>Combined icon and text for clear labeling</p>
        <GroupedButtons
          buttons={viewButtons}
          activeId={viewMode}
          onChange={setViewMode}
          ariaLabel="View mode selector"
        />
        <small style={{ marginTop: '0.5rem', display: 'block', opacity: 0.7 }}>
          Selected: {viewMode}
        </small>
      </section>

      {/* Example 4 */}
      <section>
        <h3>4. Two Options (Alignment)</h3>
        <p>Simple binary choice with icons</p>
        <GroupedButtons
          buttons={alignButtons}
          activeId={align}
          onChange={setAlign}
          size="sm"
          ariaLabel="Text alignment"
        />
        <small style={{ marginTop: '0.5rem', display: 'block', opacity: 0.7 }}>
          Selected: {align}
        </small>
      </section>

      {/* Example 5 */}
      <section>
        <h3>5. Many Options (Font Size)</h3>
        <p>Five options for fine-grained control</p>
        <GroupedButtons
          buttons={fontButtons}
          activeId={fontSize}
          onChange={setFontSize}
          ariaLabel="Font size selector"
        />
        <small style={{ marginTop: '0.5rem', display: 'block', opacity: 0.7 }}>
          Selected: {fontSize}
        </small>
      </section>

      {/* Example 6 */}
      <section>
        <h3>6. Custom Content (Sort Direction)</h3>
        <p>Custom SVG icons for specialized use cases</p>
        <GroupedButtons
          buttons={sortButtons}
          activeId={sort}
          onChange={setSort}
          size="sm"
          ariaLabel="Sort direction"
        />
        <small style={{ marginTop: '0.5rem', display: 'block', opacity: 0.7 }}>
          Selected: {sort}
        </small>
      </section>

      {/* Size Comparison */}
      <section>
        <h3>7. Size Variants</h3>
        <p>All three size options demonstrated</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
          <div>
            <small style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Small (sm)</small>
            <GroupedButtons
              buttons={themeButtons}
              activeId={theme}
              onChange={setTheme}
              size="sm"
              ariaLabel="Theme selector (small)"
            />
          </div>
          <div>
            <small style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Medium (md) - default</small>
            <GroupedButtons
              buttons={themeButtons}
              activeId={theme}
              onChange={setTheme}
              size="md"
              ariaLabel="Theme selector (medium)"
            />
          </div>
          <div>
            <small style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Large (lg)</small>
            <GroupedButtons
              buttons={themeButtons}
              activeId={theme}
              onChange={setTheme}
              size="lg"
              ariaLabel="Theme selector (large)"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
