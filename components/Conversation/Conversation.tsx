import React from 'react';
import Message from '../Message/Message';
import ChatInput from '../ChatInput/ChatInput';
import { Icons } from '../Icons/Icons';
import Button from '../Button/Button';
import Reasoning from '../Reasoning/Reasoning';
import UserMessage from '../UserMessage/UserMessage';
import Collapsible from '../Collapsible/Collapsible';
import './Conversation.css';
import { Scenario, ScenarioView } from '../../types';
import HtmlRenderer from '../HtmlRenderer/HtmlRenderer';

interface ConversationProps {
  activeScenario: Scenario;
  scenarioView: ScenarioView;
}

const Conversation: React.FC<ConversationProps> = ({ activeScenario, scenarioView }) => {
  const output = scenarioView === 'before' ? activeScenario.outputBefore : activeScenario.outputAfter;

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
          <UserMessage message={activeScenario.prompt} />
          <div className="assistant-message">
            <Collapsible>
              <Collapsible.Trigger className="reasoning-dropdown-trigger dropdown-container--secondary">
                <span>Reasoning</span>
                <Icons name="ChevronDown" />
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Reasoning />
              </Collapsible.Content>
            </Collapsible>
            <div className="html-content prose modular-scale vertical-rhythm">
              <HtmlRenderer html={output} />
            </div>
          </div>
        </div>
      </div>

      <div className="conversation-footer">
        <ChatInput />
        <p className="main-content__privacy-note">
          Toqan ensures your data stays secure and private.
        </p>
      </div>
    </div>
  );
};

export default Conversation;