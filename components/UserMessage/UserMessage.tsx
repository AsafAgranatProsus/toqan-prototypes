import React from 'react';
import './UserMessage.css';

interface UserMessageProps {
  message: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className="user-message">
      <div className="message-bubble">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default UserMessage;
