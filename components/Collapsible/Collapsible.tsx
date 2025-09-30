import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import './Collapsible.css';

interface CollapsibleContextType {
  isOpen: boolean;
  toggle: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
}

const CollapsibleContext = createContext<CollapsibleContextType | null>(null);

export const useCollapsible = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('useCollapsible must be used within a Collapsible');
  }
  return context;
};

const CollapsibleRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useClickOutside(contentRef, (event) => {
    if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
      close();
    }
  });

  return (
    <CollapsibleContext.Provider value={{ isOpen, toggle, triggerRef, contentRef }}>
      <div className="collapsible">{children}</div>
    </CollapsibleContext.Provider>
  );
};

const Trigger: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const { toggle, triggerRef, isOpen } = useCollapsible();
  return (
    <button
      ref={triggerRef}
      onClick={toggle}
      className={className}
      data-state={isOpen ? 'open' : 'closed'}
      aria-expanded={isOpen}
    >
      {children}
    </button>
  );
};

const Content: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { isOpen, contentRef } = useCollapsible();
  const innerContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentElement = contentRef.current;
    const innerElement = innerContentRef.current;

    if (contentElement && innerElement) {
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          const height = innerElement.getBoundingClientRect().height;
          contentElement.style.setProperty('--collapsible-content-height', `${height}px`);
        });
      });
      resizeObserver.observe(innerElement);
      return () => resizeObserver.disconnect();
    }
  }, [contentRef]);
  
  return (
    <div ref={contentRef} className="collapsible-content" data-state={isOpen ? 'open' : 'closed'}>
      {/* The inner div is necessary for measuring the content height correctly */}
      <div ref={innerContentRef} className={className}>{children}</div>
    </div>
  );
};

const Collapsible = Object.assign(CollapsibleRoot, {
  Trigger,
  Content,
});

export default Collapsible;