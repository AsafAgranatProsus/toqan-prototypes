import React, { useEffect, useRef, useState } from 'react';
import ChatInput from '../ChatInput/ChatInput';
import { Icons } from '../Icons/Icons';
import Button from '../Button/Button';
import Dropdown from '../Dropdown/Dropdown';
import Modal from '../Modal/Modal';
import type { Model, ScenarioView } from '../../types';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { useComposer } from '../../concepts/composer';
import GradientBackground from '../GradientBackground/GradientBackground';
import OldGradientBackground from '../OldGradientBackground/OldGradientBackground';
import Conversation from '../Conversation/Conversation';
import './MainContent.css';
import { useScenarios } from '../../context/ScenarioContext';
import { useChatSessionOptional, ChatSessionRenderer } from '../../shared/chatSession';
import { useRestaurant } from '../../concepts/restaurant/context/RestaurantContext';
import { useChatPanel, ContextualChatPanel, useHomeEntranceAnimation } from '../../shared/chatPanel';
import BuiltByOthers from '../BuiltByOthers/BuiltByOthers';
import Plays from '../Plays/Plays';
import { Carousel } from '../Carousel';
import { Chip } from '../Chip';
import { InsightCard } from '../InsightCard';
import { ActionList } from '../ActionList';
import { ActionListItem } from '../ActionListItem';
import { 
    glanceInsights, 
    jumpBackInItems, 
    agentActions,
} from '../../concepts/restaurant/homeViewData';
import gsap from 'gsap';

// Quick action suggestions for restaurant home view
const quickActions = [
    { id: 'email-sysco', label: 'Draft Email to Sysco' },
    { id: 'check-overtime', label: 'Check Overtime' },
    { id: 'update-menu', label: 'Update Menu Price' },
    { id: 'review-schedule', label: 'Review Schedule' },
    { id: 'inventory-check', label: 'Inventory Check' },
];

// Helper for time-based greeting
function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
}

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
    const { saveMessage, navigateToNav, openSecondaryPanel, selectPriority } = useRestaurant();
    const { conversationState, previousState } = useChatPanel();
    const [showGradient, setShowGradient] = useState(true);
    const gradientRef = useRef<HTMLDivElement>(null);
    
    // Modal state for "Agents coming soon" message
    const [showAgentsModal, setShowAgentsModal] = useState(false);

    // Check if we have an active conversation (either old scenario system or new chat session)
    const hasActiveConversation = activeScenario || chatSession?.isSessionActive;
    
    // Determine what to render based on conversation state
    // Priority: active session > legacy scenario > conversation state
    const showColdStart = !hasActiveConversation && conversationState === 'cold-start';
    const showContextualStart = !hasActiveConversation && conversationState === 'contextual-start';
    const showChatting = !hasActiveConversation && conversationState === 'chatting';
    
    // Home entrance animation - only for cold-start in restaurant concept
    const { refs: homeAnimRefs } = useHomeEntranceAnimation({
        enabled: showColdStart && composer.id === 'restaurant',
    });

    // Fix visibility when feature flags are toggled after entrance animation has played
    // Elements toggled on via meta menu need their opacity set to 1 manually
    useEffect(() => {
        if (showColdStart && composer.id === 'restaurant') {
            // When quick actions is toggled on, ensure it's visible
            if (flags.restaurantQuickActions && homeAnimRefs.quickActions.current) {
                gsap.set(homeAnimRefs.quickActions.current, { opacity: 1, y: 0 });
            }
            // Same for At a Glance
            if (flags.restaurantAtAGlance && homeAnimRefs.atAGlance.current) {
                gsap.set(homeAnimRefs.atAGlance.current, { opacity: 1, y: 0 });
            }
            // Same for action lists (Jump Back In / Run Agents)
            if ((flags.restaurantJumpBackIn || flags.restaurantRunAgents) && homeAnimRefs.actionLists.current) {
                gsap.set(homeAnimRefs.actionLists.current, { opacity: 1, y: 0 });
            }
        }
    }, [flags.restaurantQuickActions, flags.restaurantAtAGlance, flags.restaurantJumpBackIn, flags.restaurantRunAgents, showColdStart, composer.id, homeAnimRefs]);

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
        <main className="main-content panel-with-shadow">
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
                    {/* Header - only show if it has content */}
                    {(isMobile || (!hasActiveConversation && composer.id !== 'restaurant') || chatSession?.isSessionActive) && (
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
                    )}

                    {/* Priority 1: New chat session system (chatting with messages) */}
                    {chatSession?.isSessionActive ? (
                        <>
                            <ChatSessionRenderer
                                className="main-content__chat-session"
                                onSaveMessage={saveMessage}
                            />
                            <div className="main-content__chat-input-wrapper main-content__chat-input-wrapper--chat">
                                <ChatInput
                                    onSend={(message) => chatSession.handleUserInput(message)}
                                    placeholder="Type a message or click a button above..."
                                />
                            </div>
                        </>
                    ) : activeScenario ? (
                        /* Priority 2: Legacy scenario system */
                        <Conversation activeScenario={activeScenario} scenarioView={scenarioView} />
                    ) : showContextualStart && composer.id === 'restaurant' ? (
                        /* Priority 3: Contextual start - nav selected, centered chat + quick buttons */
                        <div className="main-content__body main-content__body--contextual-start">
                            <ContextualChatPanel 
                                onSend={(message) => chatSession?.handleUserInput?.(message)}
                                showQuickActions={true}
                            />
                        </div>
                    ) : showChatting && composer.id === 'restaurant' ? (
                        /* Priority 4: Chatting state - asset/location selected, chat input at bottom */
                        <div className="main-content__body main-content__body--chatting">
                            <ContextualChatPanel 
                                onSend={(message) => chatSession?.handleUserInput?.(message)}
                                showQuickActions={false}
                            />
                        </div>
                    ) : (
                        /* Default: Home view */
                        <div className="main-content__body">
                            <div className={`main-content__inner ${composer.id === 'restaurant' ? 'main-content__inner--animate-entrance' : ''}`}>
                                {composer.id === 'restaurant' ? (
                                    /* Restaurant Home View */
                                    <>
                                        <header className="main-content__greeting">
                                            <div 
                                                className="main-content__greeting-content"
                                                ref={homeAnimRefs.greeting as React.RefObject<HTMLDivElement>}
                                            >
                                                <h1 className="main-content__greeting-title">
                                                    {getGreeting()}
                                                </h1>
                                                {flags.restaurantSubtitle && (
                                                    <p className="main-content__greeting-subtitle">
                                                        Everything looks stable. <a href="#"><u>Cash flow is tight</u></a> next week.
                                                    </p>
                                                )}

                                            </div>

                                            <div 
                                                className="main-content__chat-section"
                                                ref={homeAnimRefs.chatInput as React.RefObject<HTMLDivElement>}
                                            >
                                                <div className="main-content__chat-input-wrapper main-content__chat-input-wrapper--home">
                                                    <ChatInput 
                                                        onSend={(message) => {
                                                            if (message.trim() && chatSession?.handleUserInput) {
                                                                chatSession.handleUserInput(message);
                                                            }
                                                        }}
                                                        placeholder="Ask me anything about your restaurant..."
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Quick Actions - separate element for staggered animation */}
                                            {flags.restaurantQuickActions && (
                                                <div 
                                                    className="main-content__quick-actions"
                                                    ref={homeAnimRefs.quickActions as React.RefObject<HTMLDivElement>}
                                                >
                                                    <Carousel
                                                        showArrows={true}
                                                        gap="var(--space-2)"
                                                        captureVerticalWheel={true}
                                                        showEdgeMask
                                                    >
                                                        {quickActions.map((action) => (
                                                            <Chip
                                                                weight="regular"
                                                                color="secondary"
                                                                key={action.id}
                                                                variant="filled"
                                                                hoverBg="subtle"
                                                                onClick={() => {
                                                                    // TODO: Handle quick action click
                                                                    console.log('Quick action:', action.label);
                                                                }}
                                                            >
                                                                {action.label}
                                                            </Chip>
                                                        ))}
                                                    </Carousel>
                                                </div>
                                            )}
                                        </header>

                                        {/* At A Glance Section */}
                                        {flags.restaurantAtAGlance && (
                                            <section 
                                                className="main-content__at-a-glance"
                                                ref={homeAnimRefs.atAGlance as React.RefObject<HTMLElement>}
                                            >
                                                {/* <h2 className="main-content__section-title">At A Glance</h2> */}
                                                <Carousel
                                                    showArrows={true}
                                                    gap="var(--space-3)"
                                                    captureVerticalWheel={true}
                                                >
                                                    {glanceInsights.map((insight) => (
                                                        <InsightCard
                                                            key={insight.id}
                                                            value={insight.value}
                                                            label={insight.label}
                                                            sourceIcon={insight.sourceIcon}
                                                            secondary={insight.secondary}
                                                            trend={insight.trend}
                                                            onClick={() => {
                                                                // Navigate to priorities and select the specific priority
                                                                if (insight.linkedNav === 'priorities' && insight.linkedPriorityId) {
                                                                    // Navigate and open the panel first
                                                                    navigateToNav('priorities');
                                                                    openSecondaryPanel();
                                                                    // Then select the priority (after navigateToNav clears selections)
                                                                    // Use setTimeout to ensure state updates in correct order
                                                                    setTimeout(() => {
                                                                        selectPriority(insight.linkedPriorityId!);
                                                                    }, 0);
                                                                }
                                                            }}
                                                        />
                                                    ))}
                                                </Carousel>
                                            </section>
                                        )}



                                        {/* Jump Back In & Run Agents */}
                                        {(flags.restaurantJumpBackIn || flags.restaurantRunAgents) && (
                                            <div 
                                                className="main-content__action-lists"
                                                ref={homeAnimRefs.actionLists as React.RefObject<HTMLDivElement>}
                                            >
                                                {flags.restaurantJumpBackIn && (
                                                    <ActionList title="Jump Back In" maxItems={3}>
                                                        {jumpBackInItems.map((item) => (
                                                            <ActionListItem
                                                                key={item.id}
                                                                title={item.title}
                                                                description={item.description}
                                                                icon={item.icon}
                                                                meta={item.meta}
                                                                onClick={() => {
                                                                    // Resume the seeded conversation
                                                                    if (chatSession) {
                                                                        chatSession.resumeSession(item.sessionId);
                                                                    }
                                                                }}
                                                            />
                                                        ))}
                                                    </ActionList>
                                                )}

                                                {flags.restaurantRunAgents && (
                                                    <ActionList title="Run Agents">
                                                        {agentActions.map((agent) => (
                                                            <ActionListItem
                                                                key={agent.id}
                                                                title={agent.title}
                                                                description={agent.description}
                                                                icon={agent.icon}
                                                                onClick={() => {
                                                                    // Show "agents coming soon" modal
                                                                    setShowAgentsModal(true);
                                                                }}
                                                            />
                                                        ))}
                                                    </ActionList>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Core Home View */
                                    <>
                                        <h1 className="main-content__title">
                                            How can Toqan help you today?
                                        </h1>
                                        <div className="main-content__chat-section">
                                            {!flags.newChatInput && (
                                                <div className="main-content__agent-selector">
                                                    <AgentSelector />
                                                </div>
                                            )}

                                            <div className="main-content__chat-input-wrapper main-content__chat-input-wrapper--home">
                                                <ChatInput />
                                            </div>

                                            <p className="main-content__privacy-note">
                                                Toqan ensures your data stays secure and private.
                                            </p>
                                        </div>
                                        <div className="galleries">
                                            {flags.plays && <Plays />}
                                            {/* {flags.builtByOther && <BuiltByOthers />} */}
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
            
            {/* Agents Coming Soon Modal */}
            <Modal show={showAgentsModal} onClose={() => setShowAgentsModal(false)}>
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <Icons name="Bot" style={{ width: 48, height: 48, marginBottom: '1rem', opacity: 0.6 }} />
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Agents are coming!</h3>
                    <p style={{ margin: '0 0 1.5rem 0', opacity: 0.7 }}>
                        Autonomous agents will soon be able to handle complex tasks for you.
                    </p>
                    <Button variant="filled" onClick={() => setShowAgentsModal(false)}>
                        OK
                    </Button>
                </div>
            </Modal>
        </main>
    );
};

export default MainContent;
