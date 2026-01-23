import React, { useEffect, useRef, useState } from 'react';
import ChatInput from '../ChatInput/ChatInput';
import { Icons } from '../Icons/Icons';
import Button from '../Button/Button';
import Dropdown from '../Dropdown/Dropdown';
import type { Model, ScenarioView } from '../../types';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { useComposer } from '../../concepts/composer';
import GradientBackground from '../GradientBackground/GradientBackground';
import OldGradientBackground from '../OldGradientBackground/OldGradientBackground';
import Conversation from '../Conversation/Conversation';
import './MainContent.css';
import { useScenarios } from '../../context/ScenarioContext';
import { useChatSessionOptional, ChatSessionRenderer } from '../../shared/chatSession';
import BuiltByOthers from '../BuiltByOthers/BuiltByOthers';
import Plays from '../Plays/Plays';
import gsap from 'gsap';

const models: Model[] = [
    { id: '1', name: 'Claude Sonnet 4', description: 'Recommended for most tasks', tag: 'Recommended' },
    { id: '2', name: 'GPT 4.1', description: 'Recommended for quick responses' },
    { id: '3', name: 'GPT 4o', description: 'Recommended for simple, high-volume tasks' },
    { id: '4', name: 'GPT 5', description: 'OpenAI\'s newest and most powerful model. Occasional', tag: 'Beta' },
];

const agents = [
    { id: '1', name: 'Code Agent' },
    { id: '2', name: 'Doc Agent' },
    { id: '3', name: 'Creative Agent' },
];

const AgentSelector: React.FC = () => {
    const [selectedAgent, setSelectedAgent] = React.useState<{ id: string, name: string } | null>(null);

    return (
        <Dropdown icon={<Icons name="Bot" />}>
            <Dropdown.Trigger className="agent-selector">
                <span>{selectedAgent ? selectedAgent.name : 'Select an Agent'}</span>
            </Dropdown.Trigger>
            <Dropdown.Menu>
                {agents.map(agent => (
                    <Dropdown.Item
                        key={agent.id}
                        onClick={() => setSelectedAgent(agent)}
                        isSelected={selectedAgent?.id === agent.id}
                    >
                        {agent.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

const ModelSelector: React.FC = () => {
    const [selectedModel, setSelectedModel] = React.useState(models[0]);

    return (
        <Dropdown>
            <Dropdown.Trigger className="dropdown__button">
                <span className="dropdown__label">Toqan (Reasoning) - </span>
                <span className="dropdown__selected-value">{selectedModel.name}</span>
                {/* <Icons name="ChevronDown" className="dropdown__icon" /> */}
            </Dropdown.Trigger>
            <Dropdown.Menu className="toqan-model-selector">
                {models.map(model => (
                    <Dropdown.Item
                        key={model.id}
                        onClick={() => setSelectedModel(model)}
                        isSelected={selectedModel.id === model.id}
                    >
                        <div className="model-item">
                            <div className="model-item__info">
                                <span className="model-item__name">{`Toqan - ${model.name}`}</span>
                                <span className="model-item__description">{model.description}</span>
                            </div>
                            {model.tag && (
                                <span className={`model-item__tag model-item__tag--${model.tag.toLowerCase()}`}>
                                    {model.tag}
                                </span>
                            )}
                        </div>
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

interface MainContentProps {
    onMenuClick: () => void;
    isMobile: boolean;
    scenarioView: ScenarioView;
}

const MainContent: React.FC<MainContentProps> = ({ onMenuClick, isMobile, scenarioView }) => {
    const { flags } = useFeatureFlags();
    const { activeScenario } = useScenarios();
    const { composer } = useComposer();
    const chatSession = useChatSessionOptional();
    const [showGradient, setShowGradient] = useState(true);
    const gradientRef = useRef<HTMLDivElement>(null);

    // Check if we have an active conversation (either old scenario system or new chat session)
    const hasActiveConversation = activeScenario || chatSession?.isSessionActive;

    // Fade out and remove gradient when entering conversation view
    useEffect(() => {
        if (hasActiveConversation && gradientRef.current) {
            gsap.to(gradientRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.out',
                onComplete: () => {
                    setShowGradient(false);
                }
            });
        } else if (!hasActiveConversation && !showGradient) {
            // Fade back in when returning to home view
            setShowGradient(true);
            if (gradientRef.current) {
                gsap.fromTo(
                    gradientRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.4, ease: 'power2.in' }
                );
            }
        }
    }, [hasActiveConversation, showGradient]);

    return (
        <main className="main-content">
            <div className="main-content-wrapper">
                <div className="main-content-inner-wrapper">
                    {/* <GradientBackground /> */}
                    {showGradient && (
                        <div className="main-content__gradient" ref={gradientRef}>
                            {flags.newMainStage === false && (
                                <div className="main-content__old-gradient-wrapper" ref={gradientRef}>

                                    <OldGradientBackground />
                                </div>
                            )}
                            {flags.newGradientBackground === true && (
                                <div className="main-content__gradient-wrapper" ref={gradientRef}>
                                    <GradientBackground type="organic" />
                                </div>
                            )}
                        </div>
                    )}
                    <header className="main-content__header">
                        {isMobile && (
                            <Button variant="tertiary" icon="Menu" onClick={onMenuClick} aria-label="Open menu" />
                        )}
                        {!hasActiveConversation && composer.id !== 'restaurant' && <ModelSelector />}
                        {chatSession?.isSessionActive && (
                            <h2 className="conversation-title">
                                {chatSession.currentFlow?.name ?? 'Conversation'}
                            </h2>
                        )}
                    </header>

                    {/* Priority 1: New chat session system */}
                    {chatSession?.isSessionActive ? (
                        <>
                            <ChatSessionRenderer 
                                className="main-content__chat-session"
                            />
                            <div className="main-content__chat-input-wrapper">
                                <ChatInput 
                                    onSend={(message) => chatSession.handleUserInput(message)}
                                    placeholder="Type a message or click a button above..."
                                />
                            </div>
                        </>
                    ) : activeScenario ? (
                        /* Priority 2: Legacy scenario system */
                        <Conversation activeScenario={activeScenario} scenarioView={scenarioView} />
                    ) : (
                        /* Default: Home view */
                        <div className="main-content__body">
                            <div className="main-content__inner">
                                <h1 className="main-content__title">
                                    How can Toqan help you today?
                                </h1>
                                <div className="main-content__chat-section">
                                    {!flags.newChatInput && (
                                        <div className="main-content__agent-selector">
                                            <AgentSelector />
                                        </div>
                                    )}

                                    <ChatInput />

                                    <p className="main-content__privacy-note">
                                        Toqan ensures your data stays secure and private.
                                    </p>
                                </div>
                                <div className="galleries">
                                    {flags.plays && <Plays />}
                                    {/* {flags.builtByOther && <BuiltByOthers />} */}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default MainContent;
