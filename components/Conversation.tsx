import React from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import { Icons } from './Icons';
import Button from './Button';
import Dropdown from './Dropdown';
import Reasoning from './Reasoning';
import UserMessage from './UserMessage';
import './Conversation.css';

interface ConversationProps {
  message: string;
}

const Conversation: React.FC<ConversationProps> = ({ message }) => {
  return (
    <div className="conversation">
      <header className="conversation-header">
        <h2 className="conversation-title">Summarized Title</h2>
        <div className="action-buttons">
          <Button variant="secondary" icon="Mail" />
          <Button variant="secondary" icon="Trash" />
          <Button variant="secondary" icon="Terminal" />
        </div>
      </header>
      <div className="conversation-body">
        <div className="messages-container">

          <UserMessage message={message} />
          <Dropdown>
            <Dropdown.Trigger className="reasoning-dropdown-trigger">
              <span>Reasoning</span>
              <Icons name="ChevronDown" />
            </Dropdown.Trigger>
            <Dropdown.Menu>
              <Reasoning />
            </Dropdown.Menu>
          </Dropdown>
          <Message />
        </div>
      </div>

      <div className="conversation-footer">
        <ChatInput onSend={() => { }} />
        <p className="main-content__privacy-note">
          Toqan ensures your data stays secure and private.
        </p>
      </div>
    </div>
  );
};

export default Conversation;
