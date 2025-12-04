import React, { useState, useRef, useEffect } from 'react';
import './ResizeHandle.css';

interface ResizeHandleProps {
  onResize: (width: number) => void;
  currentWidth: number; // Current width of the panel
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number; // Width to reset to on double-click
  position?: 'left' | 'right';
  bufferSize?: number; // Size of hover detection area on each side
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  onResize,
  currentWidth,
  minWidth = 150,
  maxWidth = 600,
  defaultWidth = 220,
  position = 'right',
  bufferSize = 20,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isNearEdge, setIsNearEdge] = useState(false);
  const handleRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  const hasDragStartedRef = useRef<boolean>(false);
  const lastClickTimeRef = useRef<number>(0);
  const mouseDownRef = useRef<boolean>(false);
  const doubleClickCooldownRef = useRef<boolean>(false);

  useEffect(() => {
    if (!mouseDownRef.current || doubleClickCooldownRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Only start dragging after mouse has moved
      if (!hasDragStartedRef.current) {
        const deltaX = Math.abs(e.clientX - startXRef.current);
        if (deltaX > 3) { // 3px threshold to start drag
          hasDragStartedRef.current = true;
          setIsDragging(true);
          document.body.style.cursor = 'ew-resize';
          document.body.style.userSelect = 'none';
        } else {
          return; // Don't resize until drag threshold is met
        }
      }

      const delta = e.clientX - startXRef.current;
      const newWidth = startWidthRef.current + (position === 'right' ? delta : -delta);
      const constrainedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
      onResize(constrainedWidth);
    };

    const handleMouseUp = (e: MouseEvent) => {
      mouseDownRef.current = false;
      hasDragStartedRef.current = false;
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Check if mouse is still near the edge after release
      if (handleRef.current) {
        const rect = handleRef.current.getBoundingClientRect();
        const isStillNearEdge = 
          e.clientX >= rect.left && 
          e.clientX <= rect.right && 
          e.clientY >= rect.top && 
          e.clientY <= rect.bottom;
        
        if (!isStillNearEdge) {
          setIsNearEdge(false);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseDownRef.current, onResize, minWidth, maxWidth, position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    
    // Detect double-click (clicks within 300ms)
    if (timeSinceLastClick < 300 && timeSinceLastClick > 0) {
      e.preventDefault();
      e.stopPropagation();
      
      // Clean up any drag state
      mouseDownRef.current = false;
      hasDragStartedRef.current = false;
      setIsDragging(false);
      
      // Set cooldown to prevent immediate drag
      doubleClickCooldownRef.current = true;
      setTimeout(() => {
        doubleClickCooldownRef.current = false;
      }, 200);
      
      onResize(defaultWidth);
      lastClickTimeRef.current = 0;
      return; // Don't start dragging
    }
    
    // Record click time for double-click detection
    lastClickTimeRef.current = now;
    
    // Store initial state but don't start dragging yet
    e.preventDefault();
    startXRef.current = e.clientX;
    startWidthRef.current = currentWidth;
    mouseDownRef.current = true;
    hasDragStartedRef.current = false;
  };

  const handleMouseEnter = () => {
    setIsNearEdge(true);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsNearEdge(false);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Backup handler in case timing-based detection fails
    e.preventDefault();
    e.stopPropagation();
    onResize(defaultWidth);
  };

  return (
    <div
      ref={handleRef}
      className={`resize-handle resize-handle--${position} ${isDragging ? 'resize-handle--dragging' : ''} ${isNearEdge ? 'resize-handle--near-edge' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
      style={{
        '--buffer-size': `${bufferSize}px`,
      } as React.CSSProperties}
    >
      <div className="resize-handle__hit-area" />
      <div className="resize-handle__visual" />
      <div className="resize-handle__edge-highlight" />
    </div>
  );
};

