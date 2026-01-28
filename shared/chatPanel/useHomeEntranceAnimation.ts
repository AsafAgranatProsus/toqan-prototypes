/**
 * Home Entrance Animation Hook
 * 
 * Provides staggered entrance animations for home view elements
 * using GSAP timeline. Respects prefers-reduced-motion.
 */

import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

/**
 * Refs for home view elements that should be animated.
 * Elements are animated in the order they appear in this list.
 */
export interface HomeAnimationRefs {
  /** Greeting title and subtitle */
  greeting: React.RefObject<HTMLElement>;
  /** Chat input wrapper */
  chatInput: React.RefObject<HTMLElement>;
  /** Quick actions carousel */
  quickActions: React.RefObject<HTMLElement>;
  /** At-a-glance insights section */
  atAGlance: React.RefObject<HTMLElement>;
  /** Action lists (Jump Back In, Run Agents) */
  actionLists: React.RefObject<HTMLElement>;
}

interface UseHomeEntranceAnimationOptions {
  /** Whether the animation should play */
  enabled?: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Duration per element in seconds */
  duration?: number;
  /** Stagger delay between elements in seconds */
  stagger?: number;
}

interface UseHomeEntranceAnimationResult {
  /** Refs to attach to home view elements */
  refs: HomeAnimationRefs;
  /** Manually trigger the entrance animation */
  playEntrance: () => void;
  /** Whether animation is currently playing */
  isAnimating: boolean;
}

/**
 * Hook for managing home view entrance animations.
 * 
 * Usage:
 * ```tsx
 * const { refs, playEntrance, isAnimating } = useHomeEntranceAnimation({ enabled: true });
 * 
 * return (
 *   <div ref={refs.greeting}>...</div>
 *   <div ref={refs.chatInput}>...</div>
 *   // etc.
 * );
 * ```
 */
export const useHomeEntranceAnimation = (
  options: UseHomeEntranceAnimationOptions = {}
): UseHomeEntranceAnimationResult => {
  const {
    enabled = true,
    onComplete,
    duration = 0.5, // Longer duration to appreciate exponential tail
    stagger = 0.06,
  } = options;

  // Refs for each animatable section
  const greetingRef = useRef<HTMLElement>(null);
  const chatInputRef = useRef<HTMLElement>(null);
  const quickActionsRef = useRef<HTMLElement>(null);
  const atAGlanceRef = useRef<HTMLElement>(null);
  const actionListsRef = useRef<HTMLElement>(null);
  
  // Animation state
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false);
  const hasPlayedRef = useRef(false);

  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const refs: HomeAnimationRefs = {
    greeting: greetingRef,
    chatInput: chatInputRef,
    quickActions: quickActionsRef,
    atAGlance: atAGlanceRef,
    actionLists: actionListsRef,
  };

  /**
   * Set initial hidden state for all elements
   */
  const setInitialState = useCallback(() => {
    const elements = [
      greetingRef.current,
      chatInputRef.current,
      quickActionsRef.current,
      atAGlanceRef.current,
      actionListsRef.current,
    ].filter(Boolean);

    if (prefersReducedMotion) {
      // Show immediately for reduced motion
      elements.forEach(el => {
        if (el) {
          gsap.set(el, { opacity: 1, y: 0 });
        }
      });
    } else {
      // Hide for animation
      elements.forEach(el => {
        if (el) {
          gsap.set(el, { opacity: 0, y: 12 });
        }
      });
    }
  }, [prefersReducedMotion]);

  /**
   * Play the entrance animation
   */
  const playEntrance = useCallback(() => {
    if (isAnimatingRef.current || prefersReducedMotion) {
      return;
    }

    // Get all valid elements in order
    const elements = [
      greetingRef.current,
      chatInputRef.current,
      quickActionsRef.current,
      atAGlanceRef.current,
      actionListsRef.current,
    ].filter(Boolean);

    if (elements.length === 0) {
      return;
    }

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    isAnimatingRef.current = true;

    // Create staggered entrance timeline
    timelineRef.current = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        hasPlayedRef.current = true;
        onComplete?.();
      },
    });

    // Animate each element with stagger
    // Using expo.out for exponential slowdown - fast start, long gentle tail
    timelineRef.current.to(elements, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power4.out',
    });
  }, [duration, stagger, onComplete, prefersReducedMotion]);

  // Track previous enabled state to detect transitions
  const prevEnabledRef = useRef(enabled);

  // Set initial state when enabled changes or on mount
  useEffect(() => {
    const wasEnabled = prevEnabledRef.current;
    prevEnabledRef.current = enabled;
    
    if (!enabled) {
      // Reset visibility when disabled
      const elements = [
        greetingRef.current,
        chatInputRef.current,
        quickActionsRef.current,
        atAGlanceRef.current,
        actionListsRef.current,
      ].filter(Boolean);
      
      elements.forEach(el => {
        if (el) {
          gsap.set(el, { opacity: 1, y: 0 });
        }
      });
      
      // Reset hasPlayed when leaving home view so animation plays again on return
      hasPlayedRef.current = false;
      return;
    }

    // When becoming enabled (transitioning TO home view), always play animation
    const shouldAnimate = !wasEnabled || !hasPlayedRef.current;
    
    if (!shouldAnimate) {
      return;
    }

    // Small delay to ensure refs are attached
    const timer = setTimeout(() => {
      setInitialState();
      playEntrance();
    }, 50);

    return () => {
      clearTimeout(timer);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [enabled, setInitialState, playEntrance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      // Reset played state for next mount
      hasPlayedRef.current = false;
    };
  }, []);

  return {
    refs,
    playEntrance,
    isAnimating: isAnimatingRef.current,
  };
};

export default useHomeEntranceAnimation;
