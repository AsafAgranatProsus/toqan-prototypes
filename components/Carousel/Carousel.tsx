import React, { useRef, useState, useEffect, useCallback } from 'react';
import Button from '../Button/Button';
import './Carousel.css';

export interface CarouselProps {
  children: React.ReactNode;
  
  /** Disables carousel behavior, content flows naturally */
  disabled?: boolean;
  
  /** Show/hide horizontal scrollbar (default: false) */
  showScrollbar?: boolean;
  
  /** Vertical mouse wheel scrolls horizontally (default: false) */
  captureVerticalWheel?: boolean;
  
  /** Delay in ms before capturing vertical wheel (default: 150ms) 
   *  Prevents hijacking scroll when user is scrolling the page
   */
  wheelCaptureDelay?: number;
  
  /** Enable shift+wheel horizontal scroll (default: true) */
  captureHorizontalScroll?: boolean;
  
  /** Show navigation arrows (default: true) */
  showArrows?: boolean;
  
  /** Arrow positioning style */
  arrowVariant?: 'overlay' | 'outside';
  
  /** Additional class name */
  className?: string;
  
  /** Inline styles */
  style?: React.CSSProperties;
  
  /** Gap between items (CSS value, e.g., '16px', 'var(--space-4)') */
  gap?: string;
  
  /** Scroll amount per arrow click (default: container width * 0.8) */
  scrollAmount?: number | 'full' | 'half';
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  disabled = false,
  showScrollbar = false,
  captureVerticalWheel = false,
  wheelCaptureDelay = 150,
  captureHorizontalScroll = true,
  showArrows = true,
  arrowVariant = 'overlay',
  className,
  style,
  gap,
  scrollAmount = 'half',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Delay state for wheel capture - prevents hijacking page scroll
  const [isWheelCaptureReady, setIsWheelCaptureReady] = useState(false);
  const wheelCaptureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate overflow state
  const updateOverflowState = useCallback(() => {
    const track = trackRef.current;
    if (!track || disabled) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = track;
    // Add small threshold to account for sub-pixel rendering
    const threshold = 1;
    
    setCanScrollLeft(scrollLeft > threshold);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - threshold);
  }, [disabled]);

  // Update on scroll
  const handleScroll = useCallback(() => {
    updateOverflowState();
  }, [updateOverflowState]);

  // Setup observers for resize and content changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track || disabled) return;

    // Initial check
    updateOverflowState();

    // ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateOverflowState();
    });
    resizeObserver.observe(track);

    // MutationObserver for children changes
    const mutationObserver = new MutationObserver(() => {
      updateOverflowState();
    });
    mutationObserver.observe(track, { childList: true, subtree: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [disabled, updateOverflowState]);

  // Cleanup wheel capture timeout on unmount
  useEffect(() => {
    return () => {
      if (wheelCaptureTimeoutRef.current) {
        clearTimeout(wheelCaptureTimeoutRef.current);
      }
    };
  }, []);

  // Mouse enter - start delay timer for wheel capture
  const handleMouseEnter = useCallback(() => {
    if (!captureVerticalWheel || disabled) return;
    
    // Clear any existing timeout
    if (wheelCaptureTimeoutRef.current) {
      clearTimeout(wheelCaptureTimeoutRef.current);
    }
    
    // Start delay timer
    wheelCaptureTimeoutRef.current = setTimeout(() => {
      setIsWheelCaptureReady(true);
    }, wheelCaptureDelay);
  }, [captureVerticalWheel, disabled, wheelCaptureDelay]);

  // Mouse leave - cancel timer and reset capture state
  const handleMouseLeave = useCallback(() => {
    if (wheelCaptureTimeoutRef.current) {
      clearTimeout(wheelCaptureTimeoutRef.current);
      wheelCaptureTimeoutRef.current = null;
    }
    setIsWheelCaptureReady(false);
  }, []);

  // Calculate scroll distance
  const getScrollDistance = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 200;

    const { clientWidth } = track;
    
    if (typeof scrollAmount === 'number') {
      return scrollAmount;
    }
    
    switch (scrollAmount) {
      case 'full':
        return clientWidth;
      case 'half':
      default:
        return clientWidth * 0.8;
    }
  }, [scrollAmount]);

  // Arrow click handlers
  const scrollLeft = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    
    track.scrollBy({
      left: -getScrollDistance(),
      behavior: 'smooth',
    });
  }, [getScrollDistance]);

  const scrollRight = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    
    track.scrollBy({
      left: getScrollDistance(),
      behavior: 'smooth',
    });
  }, [getScrollDistance]);

  // Wheel event handler
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || disabled) return;

    // Capture vertical wheel and convert to horizontal scroll
    // Only capture if delay has passed (isWheelCaptureReady)
    if (captureVerticalWheel && isWheelCaptureReady && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      track.scrollLeft += e.deltaY;
      return;
    }

    // Capture horizontal scroll (shift+wheel or trackpad horizontal)
    if (captureHorizontalScroll && e.deltaX !== 0) {
      // Native horizontal scroll - let it work naturally
      // but we could enhance here if needed
    }
  }, [disabled, captureVerticalWheel, captureHorizontalScroll, isWheelCaptureReady]);

  // Build class names
  const containerClasses = [
    'carousel',
    disabled ? 'carousel--disabled' : '',
    showScrollbar ? 'carousel--show-scrollbar' : '',
    arrowVariant === 'outside' ? 'carousel--arrows-outside' : '',
    className,
  ].filter(Boolean).join(' ');

  // Track styles with gap
  const trackStyle: React.CSSProperties = gap
    ? { '--carousel-gap': gap } as React.CSSProperties
    : {};

  // If disabled, render children without carousel wrapper behavior
  if (disabled) {
    return (
      <div className={containerClasses} style={style}>
        <div className="carousel__track" style={trackStyle}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={containerClasses} 
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Arrow */}
      {showArrows && (
        <div
          className={`carousel__arrow carousel__arrow--left ${
            canScrollLeft ? 'carousel__arrow--visible' : ''
          }`}
        >
          <Button
            variant="icon"
            shape="circle"
            icon="ChevronLeft"
            onClick={scrollLeft}
            aria-label="Scroll left"
            tabIndex={canScrollLeft ? 0 : -1}
          />
        </div>
      )}

      {/* Scrollable Track */}
      <div
        ref={trackRef}
        className="carousel__track"
        style={trackStyle}
        onScroll={handleScroll}
        onWheel={handleWheel}
      >
        {children}
      </div>

      {/* Right Arrow */}
      {showArrows && (
        <div
          className={`carousel__arrow carousel__arrow--right ${
            canScrollRight ? 'carousel__arrow--visible' : ''
          }`}
        >
          <Button
            variant="icon"
            shape="circle"
            icon="ChevronRight"
            onClick={scrollRight}
            aria-label="Scroll right"
            tabIndex={canScrollRight ? 0 : -1}
          />
        </div>
      )}
    </div>
  );
};

export default Carousel;
