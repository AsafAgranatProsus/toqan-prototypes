import React, { useState } from 'react';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import './ChatInput.css';
import { useScenarios } from '../../context/ScenarioContext';
import { scenarios } from '../../context/scenarios';
import { useFeatureFlags } from '../../context/FeatureFlagContext';

interface ChatInputProps {
  /** Optional custom send handler. If provided, overrides default scenario behavior. */
  onSend?: (message: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, placeholder }) => {
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const hasText = message.trim().length > 0;
  const { setActiveScenario, scenarios } = useScenarios();
  const { flags } = useFeatureFlags();

  const handleSend = () => {
    if (hasText) {
      if (onSend) {
        onSend(message);
      } else {
        setActiveScenario(message);
      }
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isNumberKey = /^[1-9]$/.test(e.key);
    if (isNumberKey && e.altKey) {
      e.preventDefault();
      const scenarioIndex = parseInt(e.key, 10) - 1;
      if (scenarios[scenarioIndex]) {
        setMessage(scenarios[scenarioIndex].prompt);
      }
    }
  };

  // New chat input layout (feature flag enabled)
  if (flags.newChatInput) {
    return (
      <>
        <div className="chat-input-container chat-input-container--new">
          <div className="chat-input-prefix">
            <Button icon="Plus" variant="text" shape="rounded" aria-label="Add content" />
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? "Message Toqan"}
            className="chat-input-field"
          />
          <div className="chat-input-suffix">
            {hasText ? (
              <Button
                variant="primary"
                icon="ArrowUp"
                aria-label="Send message"
                onClick={handleSend}
              />
            ) : (
              <Button
                icon="Mic"
                variant="text"
                shape="rounded"
                aria-label="Use microphone"
                onClick={() => setShowModal(true)}
              />
            )}
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
  }

  // Original chat input layout
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
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Message Toqan"}
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
