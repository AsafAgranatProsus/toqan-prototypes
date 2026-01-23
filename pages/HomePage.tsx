import React from 'react';
import { ComposedLayout } from '../components/ComposedLayout';

/**
 * HomePage
 * 
 * The main Toqan interface. Now uses ComposedLayout which renders
 * components based on the active concept's composer configuration.
 * 
 * - Core concept: Renders standard Toqan layout
 * - Restaurant concept: Same layout with concept-specific components (when configured)
 * - Future concepts: Define their own composer to customize the layout
 */
export const HomePage: React.FC = () => {
  return <ComposedLayout />;
};

