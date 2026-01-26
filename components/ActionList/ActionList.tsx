import React from 'react';
import './ActionList.css';

export interface ActionListProps {
  /** Section title */
  title: string;
  
  /** List items (ActionListItem components) */
  children: React.ReactNode;
  
  /** Maximum number of items to show (for "Show more" functionality) */
  maxItems?: number;
  
  /** Additional class name */
  className?: string;
}

export const ActionList: React.FC<ActionListProps> = ({
  title,
  children,
  maxItems,
  className,
}) => {
  const childArray = React.Children.toArray(children);
  const visibleChildren = maxItems ? childArray.slice(0, maxItems) : childArray;
  const hasMore = maxItems && childArray.length > maxItems;

  const listClasses = [
    'action-list',
    className,
  ].filter(Boolean).join(' ');

  return (
    <section className={listClasses}>
      <h2 className="action-list__title">{title}</h2>
      <div className="action-list__items">
        {visibleChildren}
      </div>
      {hasMore && (
        <button className="action-list__show-more" type="button">
          Show {childArray.length - maxItems} more
        </button>
      )}
    </section>
  );
};

export default ActionList;
