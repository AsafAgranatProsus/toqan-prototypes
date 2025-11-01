import React from 'react';
import Portal from '../Portal/Portal';
import Background from '../Background/Background';
import './Modal.css';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children, backgroundColor }) => {
  return (
    <Portal>
      <Background show={show} onClick={onClose} />
      <div className={`modal-container ${show ? 'show' : ''}`}>
        <div className="modal-content" style={backgroundColor ? { backgroundColor } : undefined}>
          <div className="modal-grain"></div>
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;