/**
 * Home Exit Animation Hook
 * 
 * Provides performant exit animations for home view elements
 * using CSS Grid template-rows trick for height animation.
 * Respects prefers-reduced-motion.
 */

import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';

interface UseHomeExitAnimationOptions {
  /** Callback when exit animation completes */
  onExitComplete?: () => void;
  /** Callback when enter animation completes */
  onEnterComplete?: () => void;
  /** Duration in seconds */
  duration?: number;
}

interface UseHomeExitAnimationResult {
  /** Ref to attach to the container wrapping home content */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Ref to attach to the inner content wrapper */
  contentRef: React.RefObject<HTMLDivElement>;
  /** Play exit animation (collapse and fade out) */
  playExit: () => Promise<void>;
  /** Play enter animation (expand and fade in) */
  playEnter: () => Promise<void>;
  /** Reset to visible state without animation */
  reset: () => void;
  /** Whether animation is currently playing */
  isAnimating: boolean;
}

/**
 * Hook for managing home view exit animations.
 * 
 * Uses the CSS Grid template-rows trick for performant height animations:
 * - Container has `display: grid; grid-template-rows: 1fr;`
 * - On exit: animate to `grid-template-rows: 0fr;` with `overflow: hidden`
 * - This avoids layout thrashing from explicit height calculations
 * 
 * Usage:
 * ```tsx
 * const { containerRef, contentRef, playExit, playEnter } = useHomeExitAnimation();
 * 
 * // When leaving home view:
 * await playExit();
 * 
 * return (
 *   <div ref={containerRef} className="home-exit-container">
 *     <div ref={contentRef} className="home-exit-content">
 *       {children}
 *     </div>
 *   </div>
 * );
 * ```
 */
export const useHomeExitAnimation = (
  options: UseHomeExitAnimationOptions = {}
): UseHomeExitAnimationResult => {
  const {
    onExitComplete,
    onEnterComplete,
    duration = 0.25,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  /**
   * Play exit animation - collapse and fade out
   */
  const playExit = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const container = containerRef.current;
      const content = contentRef.current;

      if (!container || !content) {
        resolve();
        return;
      }

      // Instant hide for reduced motion
      if (prefersReducedMotion) {
        gsap.set(container, { gridTemplateRows: '0fr' });
        gsap.set(content, { opacity: 0 });
        onExitComplete?.();
        resolve();
        return;
      }

      if (isAnimatingRef.current) {
        animationRef.current?.kill();
      }

      isAnimatingRef.current = true;

      // Ensure container is in grid mode
      gsap.set(container, { 
        display: 'grid',
        gridTemplateRows: '1fr',
        overflow: 'hidden',
      });

      // Animate both the grid rows and content opacity
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
          onExitComplete?.();
          resolve();
        },
      });

      // Fade out content slightly faster
      tl.to(content, {
        opacity: 0,
        y: -8,
        duration: duration * 0.8,
        ease: 'power2.out',
      }, 0);

      // Collapse container height
      tl.to(container, {
        gridTemplateRows: '0fr',
        duration,
        ease: 'power2.out',
      }, 0);

      animationRef.current = tl as unknown as gsap.core.Tween;
    });
  }, [duration, onExitComplete, prefersReducedMotion]);

  /**
   * Play enter animation - expand and fade in
   */
  const playEnter = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const container = containerRef.current;
      const content = contentRef.current;

      if (!container || !content) {
        resolve();
        return;
      }

      // Instant show for reduced motion
      if (prefersReducedMotion) {
        gsap.set(container, { gridTemplateRows: '1fr' });
        gsap.set(content, { opacity: 1, y: 0 });
        onEnterComplete?.();
        resolve();
        return;
      }

      if (isAnimatingRef.current) {
        animationRef.current?.kill();
      }

      isAnimatingRef.current = true;

      // Set initial collapsed state
      gsap.set(container, { 
        display: 'grid',
        gridTemplateRows: '0fr',
        overflow: 'hidden',
      });
      gsap.set(content, { opacity: 0, y: 8 });

      // Animate expansion
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
          // Remove overflow hidden after animation
          gsap.set(container, { overflow: 'visible' });
          onEnterComplete?.();
          resolve();
        },
      });

      // Expand container
      tl.to(container, {
        gridTemplateRows: '1fr',
        duration,
        ease: 'power2.out',
      }, 0);

      // Fade in content slightly delayed
      tl.to(content, {
        opacity: 1,
        y: 0,
        duration: duration * 0.8,
        ease: 'power2.out',
      }, duration * 0.2);

      animationRef.current = tl as unknown as gsap.core.Tween;
    });
  }, [duration, onEnterComplete, prefersReducedMotion]);

  /**
   * Reset to visible state without animation
   */
  const reset = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (animationRef.current) {
      animationRef.current.kill();
    }

    if (container) {
      gsap.set(container, { 
        gridTemplateRows: '1fr',
        overflow: 'visible',
      });
    }

    if (content) {
      gsap.set(content, { opacity: 1, y: 0 });
    }

    isAnimatingRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return {
    containerRef,
    contentRef,
    playExit,
    playEnter,
    reset,
    isAnimating: isAnimatingRef.current,
  };
};

export default useHomeExitAnimation;
