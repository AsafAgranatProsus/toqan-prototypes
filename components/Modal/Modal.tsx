import React from 'react';
import Portal from '../Portal/Portal';
import Background from '../Background/Background';
import './Modal.css';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  return (
    <Portal>
      <Background show={show} onClick={onClose} />
      <div className={`modal-container ${show ? 'show' : ''}`}>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;