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
import { useRestaurant } from '../../concepts/restaurant/context/RestaurantContext';
import BuiltByOthers from '../BuiltByOthers/BuiltByOthers';
import Plays from '../Plays/Plays';
import { Carousel } from '../Carousel';
import { Chip } from '../Chip';
import { InsightCard } from '../InsightCard';
import { ActionList } from '../ActionList';
import { ActionListItem } from '../ActionListItem';
import gsap from 'gsap';

// Quick action suggestions for restaurant home view
const quickActions = [
    { id: 'email-sysco', label: 'Draft Email to Sysco' },
    { id: 'check-overtime', label: 'Check Overtime' },
    { id: 'update-menu', label: 'Update Menu Price' },
    { id: 'review-schedule', label: 'Review Schedule' },
    { id: 'inventory-check', label: 'Inventory Check' },
];

// "At A Glance" insights for restaurant home view
import type { IconName } from '../../types';

interface GlanceInsight {
    id: string;
    value: string;
    label: string;
    sourceIcon: IconName;
    secondary?: string;
    trend?: 'up' | 'down' | 'neutral';
}

const glanceInsights: GlanceInsight[] = [
    {
        id: 'labor-cost',
        value: '$2,340',
        label: 'Labor This Week',
        sourceIcon: 'Users',
        secondary: '+12% vs last week',
        trend: 'up'
    },
    {
        id: 'inventory-alert',
        value: '3 Items',
        label: 'Low Stock Alert',
        sourceIcon: 'Package',
        secondary: 'Reorder soon',
        trend: 'down'
    },
    {
        id: 'deliveries',
        value: '2 Today',
        label: 'Scheduled Deliveries',
        sourceIcon: 'Truck',
    },
    {
        id: 'cash-flow',
        value: '$8.2k',
        label: 'Projected Cash Flow',
        sourceIcon: 'DollarSign',
        secondary: 'Next 7 days',
        trend: 'neutral'
    },
];

// "Jump Back In" recent items for restaurant home view
interface RecentItem {
    id: string;
    title: string;
    description?: string;
    icon: IconName;
    meta?: string;
}

const recentItems: RecentItem[] = [
    {
        id: 'sysco-email',
        title: 'Email Draft: Sysco Price Negotiation',
        description: 'Follow up on produce pricing',
        icon: 'Mail',
        meta: '2h ago',
    },
    {
        id: 'schedule-review',
        title: 'Weekly Schedule Review',
        description: 'Updated shifts for next week',
        icon: 'Clock',
        meta: 'Yesterday',
    },
    {
        id: 'inventory-report',
        title: 'Inventory Report',
        description: 'Monthly stock analysis',
        icon: 'Package',
        meta: '2 days ago',
    },
];

// "Run Agents" available agents for restaurant home view
interface AgentAction {
    id: string;
    title: string;
    description?: string;
    icon: IconName;
}

const agentActions: AgentAction[] = [
    {
        id: 'inventory-agent',
        title: 'Inventory Agent',
        description: 'Track stock levels and reorder alerts',
        icon: 'Package',
    },
    {
        id: 'scheduling-agent',
        title: 'Scheduling Agent',
        description: 'Optimize staff schedules',
        icon: 'Clock',
    },
    {
        id: 'finance-agent',
        title: 'Finance Agent',
        description: 'Monitor cash flow and expenses',
        icon: 'DollarSign',
    },
    {
        id: 'supplier-agent',
        title: 'Supplier Agent',
        description: 'Manage vendor relationships',
        icon: 'Truck',
    },
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
    const { saveMessage } = useRestaurant();
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

                    {/* Priority 1: New chat session system */}
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
                    ) : (
                        /* Default: Home view */
                        <div className="main-content__body">
                            <div className="main-content__inner">
                                {composer.id === 'restaurant' ? (
                                    /* Restaurant Home View */
                                    <>
                                        <header className="main-content__greeting">
                                            <h1 className="main-content__greeting-title">
                                                {getGreeting()}
                                            </h1>
                                            {flags.restaurantSubtitle && (
                                                <p className="main-content__greeting-subtitle">
                                                    Everything looks stable. <a href="#"><u>Cash flow is tight</u></a> next week.
                                                </p>
                                            )}
                                        </header>
                                        
                                        {/* At A Glance Section */}
                                        {flags.restaurantAtAGlance && (
                                            <section className="main-content__at-a-glance">
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
                                                                console.log('Insight clicked:', insight.label);
                                                            }}
                                                        />
                                                    ))}
                                                </Carousel>
                                            </section>
                                        )}

                                        <div className="main-content__chat-section">
                                            <div className="main-content__chat-input-wrapper main-content__chat-input-wrapper--home">
                                                <ChatInput />
                                            </div>
                                            
                                        {/* Quick Actions */}
                                        {flags.restaurantQuickActions && (
                                            <div className="main-content__quick-actions">
                                                <Carousel
                                                    showArrows={true}
                                                    gap="var(--space-2)"
                                                    captureVerticalWheel={true}
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
                                        </div>

                                        {/* Jump Back In & Run Agents */}
                                        {(flags.restaurantJumpBackIn || flags.restaurantRunAgents) && (
                                            <div className="main-content__action-lists">
                                                {flags.restaurantJumpBackIn && (
                                                    <ActionList title="Jump Back In" maxItems={3}>
                                                        {recentItems.map((item) => (
                                                            <ActionListItem
                                                                key={item.id}
                                                                title={item.title}
                                                                description={item.description}
                                                                icon={item.icon}
                                                                meta={item.meta}
                                                                onClick={() => {
                                                                    console.log('Recent item clicked:', item.title);
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
                                                                    console.log('Agent clicked:', agent.title);
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
        </main>
    );
};

export default MainContent;
