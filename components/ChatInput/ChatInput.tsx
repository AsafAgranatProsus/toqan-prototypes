import React, { useState } from 'react';
import Button from '../Button/Button';
import './ChatInput.css';

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const hasText = message.trim().length > 0;

  const handleSend = () => {
    if (hasText) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-prefix">
        <Button icon="Plus" variant="primary" shape="rounded" aria-label="Add content" />
        <Button 
          icon="Mic" 
          variant={hasText ? "secondary" : "primary"} 
          shape="rounded" 
          aria-label="Use microphone" 
          disabled={hasText}
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
          variant={hasText ? "primary" : "secondary"} 
          icon="ArrowUp" 
          aria-label="Send message" 
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default ChatInput;