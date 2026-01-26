/**
 * CopyButton Component
 * 
 * An agnostic copy-to-clipboard button with floating balloon animation.
 * When clicked, a "Copied!" message floats up like Instagram's heart animation.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import gsap from 'gsap';
import Button from '../Button/Button';
import { Icons } from '../Icons/Icons';
import './CopyButton.css';

interface CopyButtonProps {
  /** The content to copy (can be plain text or HTML) */
  content: string;
  
  /** Whether the content is HTML that should be stripped to plain text */
  stripHtml?: boolean;
  
  /** Additional class name */
  className?: string;
  
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Callback after successful copy */
  onCopy?: () => void;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  content,
  stripHtml = true,
  className = '',
  size = 'sm',
  onCopy,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const floatingRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Handle copy action
  const handleCopy = useCallback(async () => {
    if (isAnimating) return;
    
    try {
      let textToCopy = content;
      
      if (stripHtml && content.includes('<')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        textToCopy = tempDiv.textContent || tempDiv.innerText || '';
      }
      
      await navigator.clipboard.writeText(textToCopy);
      onCopy?.();
      
      // Trigger floating animation
      if (floatingRef.current) {
        setIsAnimating(true);
        
        // Kill any existing animation
        if (timelineRef.current) {
          timelineRef.current.kill();
        }
        
        const floating = floatingRef.current;
        const tl = gsap.timeline({
          onComplete: () => setIsAnimating(false),
        });
        timelineRef.current = tl;
        
        // Reset to starting position
        gsap.set(floating, {
          opacity: 0,
          scale: 0.5,
          y: 0,
          x: -10,
          display: 'flex',
        });
        
        // Pop in with scale
        tl.to(floating, {
          opacity: 1,
          scale: 1.2,
          duration: 0.15,
          ease: 'back.out(3)',
        }, 0);
        
        // Settle scale slightly
        tl.to(floating, {
          scale: 1,
          duration: 0.1,
          ease: 'power2.out',
        }, 0.15);
        
        // Float upward with exponential slowdown
        tl.to(floating, {
          y: -30,
          duration: 1.4,
          ease: 'power2.out', // Fast start, slow end
        }, 0.1);
        
        // Organic horizontal bobbing (balloon effect)
        tl.to(floating, {
          x: -13,
          duration: 0.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 3,
        }, 0.2);
        
        // Subtle rotation wobble
        tl.to(floating, {
          rotation: 2,
          duration: 0.35,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 4,
        }, 0.15);
        
        // Grow slightly as it rises (exponentially less)
        tl.to(floating, {
          scale: 1.2,
          duration: 1.2,
          ease: 'power2.out', // Fast growth at start, slows dramatically
        }, 0.25);
        
        // Fade out towards the end
        tl.to(floating, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.in',
        }, 0.9);
        
        // Hide after animation
        tl.set(floating, {
          display: 'none',
        });
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [content, stripHtml, isAnimating, onCopy]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div className={`copy-button ${className}`}>
      {/* The actual button */}
      <Button
        variant="icon"
        size={size}
        icon="Copy"
        transparent
        noBorder
        onClick={handleCopy}
        title="Copy"
        aria-label="Copy to clipboard"
      />
      
      {/* Floating "Copied!" message */}
      <div 
        ref={floatingRef}
        className="copy-button__floating"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        <Icons name="Check" className="copy-button__floating-icon" />
        <span className="copy-button__floating-label">Copied!</span>
      </div>
    </div>
  );
};

export default CopyButton;
