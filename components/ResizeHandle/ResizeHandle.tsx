import React, { useState, useRef, useCallback } from 'react';
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
  const lastClickTimeRef = useRef<number>(0);

  // Use refs for values needed in event handlers to avoid stale closures
  const positionRef = useRef(position);
  const minWidthRef = useRef(minWidth);
  const maxWidthRef = useRef(maxWidth);
  const onResizeRef = useRef(onResize);
  
  // Keep refs in sync with props
  positionRef.current = position;
  minWidthRef.current = minWidth;
  maxWidthRef.current = maxWidth;
  onResizeRef.current = onResize;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    
    // Detect double-click (clicks within 300ms)
    if (timeSinceLastClick < 300 && timeSinceLastClick > 0) {
      e.preventDefault();
      e.stopPropagation();
      onResizeRef.current(defaultWidth);
      lastClickTimeRef.current = 0;
      return;
    }
    
    lastClickTimeRef.current = now;
    e.preventDefault();
    
    // Capture initial state
    startXRef.current = e.clientX;
    startWidthRef.current = currentWidth;
    
    let hasDragStarted = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Only start dragging after mouse has moved beyond threshold
      if (!hasDragStarted) {
        const deltaX = Math.abs(moveEvent.clientX - startXRef.current);
        if (deltaX > 3) {
          hasDragStarted = true;
          setIsDragging(true);
          document.body.style.cursor = 'ew-resize';
          document.body.style.userSelect = 'none';
        } else {
          return;
        }
      }

      const delta = moveEvent.clientX - startXRef.current;
      const newWidth = startWidthRef.current + (positionRef.current === 'right' ? delta : -delta);
      const constrainedWidth = Math.min(Math.max(newWidth, minWidthRef.current), maxWidthRef.current);
      onResizeRef.current(constrainedWidth);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      // Clean up event listeners immediately
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Reset state
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Check if mouse is still near the edge after release
      if (handleRef.current) {
        const rect = handleRef.current.getBoundingClientRect();
        const isStillNearEdge = 
          upEvent.clientX >= rect.left && 
          upEvent.clientX <= rect.right && 
          upEvent.clientY >= rect.top && 
          upEvent.clientY <= rect.bottom;
        
        if (!isStillNearEdge) {
          setIsNearEdge(false);
        }
      }
    };

    // Attach listeners to document for drag tracking
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [currentWidth, defaultWidth]);

  const handleMouseEnter = useCallback(() => {
    setIsNearEdge(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging) {
      setIsNearEdge(false);
    }
  }, [isDragging]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onResize(defaultWidth);
  }, [onResize, defaultWidth]);

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

