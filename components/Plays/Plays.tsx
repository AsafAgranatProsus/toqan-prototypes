import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card, { getColorFromName, getTextColor, AVATAR_COLORS_LIGHT, AVATAR_COLORS_DARK } from '../Card/Card';
import { useDesignSystem } from '../../context/DesignSystemContext';
import Avatar from 'boring-avatars';
import Modal from '../Modal/Modal';
import Portal from '../Portal/Portal';
import Background from '../Background/Background';
import Button from '../Button/Button';
import Collapsible from '../Collapsible/Collapsible';
import FlowDiagram from '../FlowDiagram/FlowDiagram';
import { Icons } from '../Icons/Icons';
import './Plays.css';

import { playsData } from './playsData';
import './Plays.css';

const generateRandomStyle = () => {
  const x = Math.floor(Math.random() * 100);
  const y = Math.floor(Math.random() * 100);
  const radius = Math.floor(Math.random() * 50) + 20;
  const hue = Math.floor(Math.random() * 360);
  const color = `hsl(${hue}, 100%, 85%)`;

  return {
    '--x': `${x}%`,
    '--y': `${y}%`,
    '--color': color,
  } as React.CSSProperties;
};

const Plays: React.FC = () => {
  const { isDark } = useDesignSystem();
  const [selectedPlay, setSelectedPlay] = useState<any>(null);
  const [selectedCardColor, setSelectedCardColor] = useState<string>('');
  const [selectedTextColor, setSelectedTextColor] = useState<string>('');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 for right, -1 for left
  const [isNavigating, setIsNavigating] = useState(false); // true when using arrow keys
  const [isHovered, setIsHovered] = useState(false);
  const [canCaptureScroll, setCanCaptureScroll] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Choose color palette based on theme
  const colorPalette = isDark ? AVATAR_COLORS_DARK : AVATAR_COLORS_LIGHT;

  const randomStyles = useMemo(() => {
    return playsData.map(() => generateRandomStyle());
  }, []);

  const handleCardClick = (play: any) => {
    const backgroundColor = getColorFromName(play.title, colorPalette);
    const textColor = getTextColor(backgroundColor);
    setSelectedCardColor(backgroundColor);
    setSelectedTextColor(textColor);
    setIsNavigating(false);
    setSelectedPlay(play);
  };

  const handleCloseModal = () => {
    // Reset navigation state first, then close after re-render
    setIsNavigating(false);
    setTimeout(() => {
      setSelectedPlay(null);
      setSelectedCardColor('');
      setSelectedTextColor('');
    }, 0);
  };

  const navigateToPlay = (newPlay: any, navDirection: 1 | -1) => {
    if (!newPlay) return;
    
    setDirection(navDirection);
    const backgroundColor = getColorFromName(newPlay.title, colorPalette);
    const textColor = getTextColor(backgroundColor);
    
    setSelectedCardColor(backgroundColor);
    setSelectedTextColor(textColor);
    
    // Small delay to allow state update to complete and component to re-render
    // with new animation props before changing the key
    setTimeout(() => {
      setSelectedPlay(newPlay);
    }, 0);
  };

  const handlePreviousPlay = () => {
    if (!selectedPlay) return;
    
    // Set navigation state first to update animation props
    setIsNavigating(true);
    
    const currentIndex = playsData.findIndex((play: any) => play.id === selectedPlay.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : playsData.length - 1;
    
    navigateToPlay(playsData[previousIndex], -1);
  };

  const handleNextPlay = () => {
    if (!selectedPlay) return;
    
    // Set navigation state first to update animation props
    setIsNavigating(true);
    
    const currentIndex = playsData.findIndex((play: any) => play.id === selectedPlay.id);
    const nextIndex = currentIndex < playsData.length - 1 ? currentIndex + 1 : 0;
    
    navigateToPlay(playsData[nextIndex], 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPlay) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePreviousPlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPlay();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseModal();
      }
    };

    if (selectedPlay) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedPlay]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Delay before enabling scroll capture (300ms delay)
    hoverTimerRef.current = setTimeout(() => {
      setCanCaptureScroll(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCanCaptureScroll(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (!canCaptureScroll || !carouselRef.current) return;

    // Prevent default vertical scroll
    e.preventDefault();
    
    // Convert vertical scroll to horizontal
    const scrollAmount = e.deltaY;
    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'auto' // Use 'auto' for immediate response to wheel
    });
  };

  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      
      // Calculate how far we are from the end
      const scrollEnd = scrollWidth - clientWidth;
      const distanceFromEnd = scrollEnd - scrollLeft;
      
      // Hide right arrow only when the last card is fully visible
      // Show it again if even 1px of the last card is overscrolled
      // Small threshold (1px) to ensure sensitivity
      setShowRightArrow(distanceFromEnd > 1);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      checkScrollPosition();
      carousel.addEventListener('scroll', checkScrollPosition);
      carousel.addEventListener('resize', checkScrollPosition);
      carousel.addEventListener('wheel', handleWheel, { passive: false });
      carousel.addEventListener('mouseenter', handleMouseEnter);
      carousel.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        carousel.removeEventListener('scroll', checkScrollPosition);
        carousel.removeEventListener('resize', checkScrollPosition);
        carousel.removeEventListener('wheel', handleWheel);
        carousel.removeEventListener('mouseenter', handleMouseEnter);
        carousel.removeEventListener('mouseleave', handleMouseLeave);
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
        }
      };
    }
  }, [canCaptureScroll]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = 320 + 16; // card width + gap
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = 320 + 16; // card width + gap
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="plays">
      <h2 className="section-title">Start creating agents</h2>
      <div className="carousel-wrapper">
        <button
          className={`carousel-nav-button carousel-nav-left ${showLeftArrow ? 'visible' : ''}`}
          onClick={scrollLeft}
          aria-label="Scroll left"
          aria-hidden={!showLeftArrow}
        >
          <Icons name="ChevronLeft" />
        </button>
        <div className="card-container" ref={carouselRef}>
          <div className="leading-spacer-card"></div>
          {playsData.map((item, index) => (
            <div key={item.id} onClick={() => handleCardClick(item)}>
              <Card
                title={item.title}
                // description={item.description}
                style={randomStyles[index]}
              />
            </div>
          ))}
          <div className="ending-spacer-card"></div>
        </div>
        <button
          className={`carousel-nav-button carousel-nav-right ${showRightArrow ? 'visible' : ''}`}
          onClick={scrollRight}
          aria-label="Scroll right"
          aria-hidden={!showRightArrow}
        >
          <Icons name="ChevronRight" />
        </button>
      </div>
      
      <Portal>
        <Background show={!!selectedPlay} onClick={handleCloseModal} />
        <AnimatePresence mode="popLayout" initial={false}>
          {selectedPlay && (
            <motion.div
              key={selectedPlay.id}
              className="modal-container show"
              initial={isNavigating ? {
                x: direction === 1 ? 'calc(100px - 50%)' : 'calc(-100px - 50%)',
                y: '-50%',
                opacity: 0,
                scale: 0.98,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  mass: 0.8,
                  delay: 0
                }
              } : {
                x: '-50%',
                y: '-50%',
                opacity: 0,
                scale: 0.9,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  mass: 0.8
                }
              }}
              animate={{
                x: '-50%',
                y: '-50%',
                opacity: 1,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                  delay: isNavigating ? 0.2 : 0
                }
              }}
              exit={isNavigating ? {
                x: direction === 1 ? 'calc(-100px - 50%)' : 'calc(100px - 50%)',
                y: '-50%',
                opacity: 0,
                scale: 0.98,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                  mass: 0.6
                }
              } : {
                x: '-50%',
                y: '-50%',
                opacity: 0,
                scale: 0.9,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.6
                }
              }}
            >
              <div className="modal-content" style={{ backgroundColor: selectedCardColor }}>
                <div className="modal-grain"></div>
                <div className="play-modal-wrapper">
                  <div className="modal-avatar">
                    <Avatar
                      name={selectedPlay.title}
                      colors={colorPalette}
                      variant="bauhaus"
                      size={260}
                    />
                  </div>
                  <div className="play-modal-content" style={{ color: selectedTextColor }}>
                    <div className="modal-header">
                      <button className="close-button" onClick={handleCloseModal}>
                        <Icons name="X" />
                      </button>


                    </div>
                    <div className="modal-body">
                      <div className="modal-left">
                        <h2>{selectedPlay.title}</h2>
                        <p className="modal-clarity">{selectedPlay.seedData.clarityStatement}</p>
                      </div>
                      <div className="modal-right">
                        <h3>Why you should create it</h3>
                        <p>{selectedPlay.seedData.whatItDoes}</p>
                        
                        <Collapsible closeOnOutsideClick={false}>
                          <Collapsible.Trigger className="how-it-works-trigger">
                            <h3>How the agent works</h3>
                            <Icons name="ChevronDown" />
                          </Collapsible.Trigger>
                          <Collapsible.Content>
                            <FlowDiagram />
                          </Collapsible.Content>
                        </Collapsible>
                        
                        {/* <ul>
                        {selectedPlay.seedData.howItWorks.map((step: string, i: number) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul> */}
                      </div>
                    </div>
                    <div className="modal-buttons">
                      <div className="modal-header-stats">
                        <div className="modal-usage">
                          <Icons name="Robot" />
                          <span>931</span>
                        </div>
                      </div>
                      <Button variant="primary" onClick={() => { }}>Create this agent</Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
};

export default Plays;
