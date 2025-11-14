import React from 'react';
import Portal from '../Portal/Portal';
import Background from '../Background/Background';
import './Modal.css';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
  containerProps?: any; // For framer-motion props
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children, backgroundColor, containerProps }) => {
  const Container = containerProps?.as || 'div';
  const { as, ...restContainerProps } = containerProps || {};
  
  return (
    <Portal>
      <Background show={show} onClick={onClose} />
      <Container 
        className={`modal-container ${show ? 'show' : ''}`}
        {...restContainerProps}
      >
        <div className="modal-content" style={backgroundColor ? { backgroundColor } : undefined}>
          <div className="modal-grain"></div>
          {children}
        </div>
      </Container>
    </Portal>
  );
};

export default Modal;