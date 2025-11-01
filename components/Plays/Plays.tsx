import React, { useState, useMemo, useRef, useEffect } from 'react';
import Card, { getColorFromName, getTextColor, AVATAR_COLORS } from '../Card/Card';
import Avatar from 'boring-avatars';
import Modal from '../Modal/Modal';
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
  const [selectedPlay, setSelectedPlay] = useState<any>(null);
  const [selectedCardColor, setSelectedCardColor] = useState<string>('');
  const [selectedTextColor, setSelectedTextColor] = useState<string>('');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const randomStyles = useMemo(() => {
    return playsData.map(() => generateRandomStyle());
  }, []);

  const handleCardClick = (play: any) => {
    const backgroundColor = getColorFromName(play.title, AVATAR_COLORS);
    const textColor = getTextColor(backgroundColor);
    setSelectedCardColor(backgroundColor);
    setSelectedTextColor(textColor);
    setSelectedPlay(play);
  };

  const handleCloseModal = () => {
    setSelectedPlay(null);
    setSelectedCardColor('');
    setSelectedTextColor('');
  };

  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      // Check if we can scroll more to the right (with small tolerance for rounding)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      checkScrollPosition();
      carousel.addEventListener('scroll', checkScrollPosition);
      carousel.addEventListener('resize', checkScrollPosition);

      return () => {
        carousel.removeEventListener('scroll', checkScrollPosition);
        carousel.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

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
      <Modal show={!!selectedPlay} onClose={handleCloseModal} backgroundColor={selectedCardColor}>
        {selectedPlay && (
          <div className="play-modal-wrapper">
            <div className="modal-avatar">
              <Avatar
                name={selectedPlay.title}
                colors={AVATAR_COLORS}
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
        )}
      </Modal>
    </div>
  );
};

export default Plays;
