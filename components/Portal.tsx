import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const portalElement = document.createElement('div');
    portalElement.setAttribute('data-portal-id', '');
    document.body.appendChild(portalElement);
    setElement(portalElement);

    return () => {
      document.body.removeChild(portalElement);
    };
  }, []);

  return element ? createPortal(children, element) : null;
};

export default Portal;
