import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import Portal from '../Portal/Portal';
import { useClickOutside } from '../../hooks/useClickOutside';
import './Dropdown.css';

interface DropdownContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  getItemProps: (userProps?: React.HTMLAttributes<HTMLDivElement>) => Record<string, any>;
  size: 'tight' | 'normal' | 'relaxed';
  icon?: React.ReactNode;
  showChevron: boolean;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownProvider');
  }
  return context;
};

interface DropdownRootProps {
  children: React.ReactNode;
  priority?: 'primary' | 'secondary' | 'tertiary';
  size?: 'tight' | 'normal' | 'relaxed';
  icon?: React.ReactNode;
  showChevron?: boolean;
  className?: string;
}

// Fix: Renamed Dropdown to DropdownRoot to use with Object.assign for creating a properly typed compound component.
// This resolves the error in MainContent.tsx where Dropdown.Trigger props were not being recognized.
const DropdownRoot = ({ children, priority, size = 'normal', icon, showChevron = true, className }: DropdownRootProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useClickOutside(menuRef, (event) => {
    if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
      close();
    }
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          close();
          triggerRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
          // Fix: Cast the selected item to HTMLElement to fix the 'focus' property not existing on 'unknown' type error.
          if (items && items.length > 0) (items[0] as HTMLElement).focus();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);

  }, [isOpen, close]);
  
  const getItemProps = (userProps?: React.HTMLAttributes<HTMLDivElement>) => ({
    ...userProps,
    role: 'option',
    tabIndex: -1,
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="option"]') || []);
        const currentIndex = items.indexOf(e.currentTarget);

        let nextIndex: number;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % items.length;
            // Fix: Cast the selected item to HTMLElement to fix the 'focus' property not existing on 'unknown' type error.
            (items[nextIndex] as HTMLElement)?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            nextIndex = (currentIndex - 1 + items.length) % items.length;
            // Fix: Cast the selected item to HTMLElement to fix the 'focus' property not existing on 'unknown' type error.
            (items[nextIndex] as HTMLElement)?.focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
        } else if (e.key === 'Tab') {
             e.preventDefault();
            close();
            triggerRef.current?.focus();
        }
    },
  });

  const dropdownContainerClasses = [
    'dropdown-container',
    priority ? `dropdown--${priority}` : '',
    size ? `dropdown--${size}` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close, triggerRef, menuRef, getItemProps, size, icon, showChevron }}>
      <div className={dropdownContainerClasses}>{children}</div>
    </DropdownContext.Provider>
  );
};

const Trigger: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const { toggle, triggerRef, isOpen, icon, showChevron } = useDropdown();
  return (
    <button
      ref={triggerRef}
      onClick={toggle}
      className={'dropdown__button' + ' ' + className}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      {icon && <span className="dropdown__icon-left">{icon}</span>}
      <span className="dropdown__content">{children}</span>
      {showChevron && (
        <svg
          className="dropdown__chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )}
    </button>
  );
};

const Menu: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { isOpen, triggerRef, menuRef } = useDropdown();
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen, triggerRef]);

  const classNames = [
    'dropdown-menu',
    'custom-scrollbar',
    className,
    isOpen ? 'dropdown-menu-visible' : 'dropdown-menu-hidden'
  ].filter(Boolean).join(' ');

  return (
    <Portal>
      <div
        ref={menuRef}
        className={classNames}
        style={{ ...position }}
        role="listbox"
      >
        {children}
      </div>
    </Portal>
  );
};

const Item: React.FC<{ children: React.ReactNode; onClick: () => void; isSelected?: boolean }> = ({
  children,
  onClick,
  isSelected
}) => {
  const { close, getItemProps } = useDropdown();
  
  const handleClick = () => {
    onClick();
    close();
  };

  const itemClasses = [
    'dropdown-menu__item',
    isSelected ? 'dropdown-menu__item--selected' : ''
  ].filter(Boolean).join(' ');

  return (
    <div {...getItemProps({ onClick: handleClick, className: itemClasses })} aria-selected={isSelected}>
      {children}
    </div>
  );
};

const Dropdown = Object.assign(DropdownRoot, {
  Trigger,
  Menu,
  Item,
});

export default Dropdown;