import React, { useState } from 'react';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import './ChatInput.css';
import { useScenarios } from '../../context/ScenarioContext';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const hasText = message.trim().length > 0;
  const { setActiveScenario } = useScenarios();

  const handleSend = () => {
    if (hasText) {
      setActiveScenario(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <div className="chat-input-container">
        <div className="chat-input-prefix">
          <Button icon="Plus" variant="primary" shape="rounded" aria-label="Add content" />
          <Button
            icon="Mic"
            variant={hasText ? 'secondary' : 'primary'}
            shape="rounded"
            aria-label="Use microphone"
            disabled={hasText}
            onClick={() => setShowModal(true)}
          />
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message Toqan"
          className="chat-input-field"
        />
        <div className="chat-input-suffix">
          <Button
            variant={hasText ? 'primary' : 'secondary'}
            icon="ArrowUp"
            aria-label="Send message"
            onClick={handleSend}
          />
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div>
          <p>Microphone input is not yet implemented.</p>
          <Button onClick={() => setShowModal(false)}>OK</Button>
        </div>
      </Modal>
    </>
  );
};

export default ChatInput;
