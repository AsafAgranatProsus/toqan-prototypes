import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './GradientBackground.css';

interface Blob {
  id: number;
  top: string;
  left: string;
  size: number;
  color: string;
}

const GradientBackground: React.FC = () => {
  const { theme } = useTheme();
  const colors = theme.colors.gradientMelange;

  const generateBlob = (id: number): Blob => ({
    id,
    top: `${Math.random() * 80}%`,
    left: `${Math.random() * 80}%`,
    size: Math.random() * 300 + 200,
    color: colors[Math.floor(Math.random() * colors.length)],
  });

  const generateInitialBlobs = (count: number): Blob[] => {
    return Array.from({ length: count }, (_, i) => generateBlob(i));
  };
  
  const [blobs, setBlobs] = useState<Blob[]>(() => generateInitialBlobs(4));

  useEffect(() => {
    setBlobs(generateInitialBlobs(4));
    
    const interval = setInterval(() => {
      setBlobs(currentBlobs => 
        currentBlobs.map(blob => generateBlob(blob.id))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [colors]);

  return (
    <div className="gradient-background">
      <div className="gradient-blobs">
        {blobs.map((blob) => (
          <div
            key={blob.id}
            className="gradient-blob"
            style={{
              top: blob.top,
              left: blob.left,
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              backgroundColor: blob.color,
            }}
          />
        ))}
      </div>
      <div className="gradient-grain"></div>
    </div>
  );
};

export default GradientBackground;