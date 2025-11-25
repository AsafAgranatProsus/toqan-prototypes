import React from 'react';
import type { NavItem, Conversation } from '../../types';
import { Icons } from '../Icons/Icons';
import { Logo } from '../Logo/Logo';
import Button from '../Button/Button';
import Tag from '../Tag/Tag';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import Collapsible from '../Collapsible/Collapsible';
import './Sidebar.css';

const navItems: NavItem[] = [
    { id: 'conversations', label: 'Conversations', icon: 'MessageSquare' },
    { id: 'agents', label: 'Agents', icon: 'Bot' },
    { id: 'data-analysts', label: 'Data Analysts', icon: 'Database' },
    { id: 'integrations', label: 'Integrations', icon: 'Plug', beta: true },
    { id: 'library', label: 'Library', icon: 'Library' },
];

const recentConversations: Conversation[] = [
    { id: '0', title: 'Let\'s Take Action!', tag: 'Today', date: 'Sep 18, 2025', pinned: true },
    { id: '1', title: 'Comparing Activation Functions in Neural Networks', tag: 'Yesterday', date: 'Sep 17, 2025', pinned: true },
    { id: '2', title: 'Examples of Mathematical Proofs and Theorems', tag: 'Yesterday', date: 'Sep 17, 2025' },
    { id: '3', title: 'Request for Typographic Variations and Font Pairings', tag: 'Yesterday', date: 'Sep 17, 2025' },
    { id: '4', title: 'Advanced Agent Creation and Configuration Guide', tag: 'Sep 17, 2025', date: 'Sep 17, 2025' },
    { id: '5', title: 'Comparing Activation Functions for Deep Learning', tag: 'Sep 16, 2025', date: 'Sep 16, 2025' },
    { id: '6', title: 'Inquiry About Today\'s Date', tag: 'Sep 04, 2025', date: 'Sep 04, 2025' },
    { id: '7', title: 'Inquiry About UI and Frontend Development Best Practices', tag: 'Sep 04, 2025', date: 'Sep 04, 2025' },
    { id: '8', title: 'Hen Party Weekend Planning and Activity Ideas', tag: 'Aug 30, 2025', date: 'Aug 30, 2025' },
    { id: '9', title: 'Customizable Horizontal Card Components with Props', tag: 'Aug 19, 2025', date: 'Aug 19, 2025' },
];

const ConversationItem: React.FC<{ conversation: Conversation, isActive?: boolean, shouldWrap?: boolean }> = ({ conversation, isActive, shouldWrap }) => {
    const itemClasses = ['convo-item', isActive ? 'convo-item--active' : ''].filter(Boolean).join(' ');
    const titleClasses = ['convo-item__title', shouldWrap ? 'convo-item__title--wrap' : ''].filter(Boolean).join(' ');
    return (
        <a className={itemClasses + " " + titleClasses} title={conversation.title} href="">{conversation.title}</a>
    );
};

// Fix: Defined the MenuItem component to render navigation links, resolving the "Cannot find name 'MenuItem'" error.
const MenuItem: React.FC<{ item: NavItem }> = ({ item }) => {
    const itemClasses = ['menu-item', item.id === 'conversations' ? 'menu-item--active' : ''].filter(Boolean).join(' ');

    return (
        <li>
            <a href="#" className={itemClasses}>
                <Icons name={item.icon} className="menu-item__icon" />
                <span>{item.label}</span>
                {item.beta && <Tag variant="beta" size="md">Beta</Tag>}
            </a>
        </li>
    );
};

interface SidebarProps {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobile }) => {
    const { flags } = useFeatureFlags();
    const sidebarClasses = [
        'sidebar',
        isMobile ? 'sidebar--mobile' : '',
        isOpen ? 'sidebar--open' : ''
    ].filter(Boolean).join(' ');

    // Separate pinned and non-pinned conversations
    const pinnedConversations = flags.conversationPin 
        ? recentConversations.filter(convo => convo.pinned) 
        : [];
    const unpinnedConversations = flags.conversationPin
        ? recentConversations.filter(convo => !convo.pinned)
        : recentConversations;

    // Group conversations by tag
    const groupConversations = (conversations: Conversation[]) => {
        return conversations.reduce((acc, convo) => {
            const { tag } = convo;
            if (!acc[tag]) {
                acc[tag] = [];
            }
            acc[tag].push(convo);
            return acc;
        }, {} as Record<string, Conversation[]>);
    };

    const groupedPinnedConversations = groupConversations(pinnedConversations);
    const groupedUnpinnedConversations = groupConversations(unpinnedConversations);

    return (
        <aside className={sidebarClasses}>
            <div className="sidebar__header-container">
                <div className="sidebar__header">
                    <Logo />
                </div>
                <Button className="new__button" icon="SquarePen">
                    New conversation
                </Button>
            </div>

            <nav className="sidebar__nav">
                <ul>
                    {navItems.map(item => <MenuItem key={item.id} item={item} />)}
                </ul>
            </nav>
            <div className="sidebar__recent">
                {/* Pinned Conversations Section - only show if feature flag is on and there are pinned conversations */}
                {flags.conversationPin && pinnedConversations.length > 0 && (
                    <>
                        <div>
                            <h3 className="sidebar__section-title">Pinned Conversations</h3>
                        </div>
                        <div className="sidebar__convo-list-container sidebar__convo-list-container--pinned">
                            <ul className="sidebar__convo-list">
                                {Object.entries(groupedPinnedConversations).map(([tag, convos]) => (
                                    <div key={`pinned-${tag}`} className="convo-group">
                                        <li className="convo-group__list">
                                            {convos.map((convo) => (
                                                <ConversationItem
                                                    key={convo.id}
                                                    conversation={convo}
                                                    isActive={false}
                                                    shouldWrap={flags.conversationWrap}
                                                />
                                            ))}
                                        </li>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* Recent Conversations Section */}
                {flags.conversationCollapsible ? (
                    <Collapsible closeOnOutsideClick={false} defaultOpen={false}>
                        <Collapsible.Trigger className="sidebar__section-trigger">
                            <h3 className="sidebar__section-title">Recent Conversations</h3>
                            <Icons name="ChevronDown" className="sidebar__section-chevron" />
                        </Collapsible.Trigger>
                        <Collapsible.Content className="sidebar__recent-content">
                            <div className="custom-scrollbar sidebar__convo-list-container">
                                <ul className="sidebar__convo-list">
                                    {Object.entries(groupedUnpinnedConversations).map(([tag, convos], groupIndex) => (
                                        <div key={tag} className="convo-group">
                                            <li className="convo-group__header">
                                                <Tag variant="primary" size="md">{tag}</Tag>
                                            </li>
                                            <li className="convo-group__list">
                                                {convos.map((convo, convoIndex) => (
                                                    <ConversationItem
                                                        key={convo.id}
                                                        conversation={convo}
                                                        isActive={!flags.conversationPin && groupIndex === 0 && convoIndex === 0}
                                                        shouldWrap={flags.conversationWrap}
                                                    />
                                                ))}
                                            </li>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </Collapsible.Content>
                    </Collapsible>
                ) : (
                    <>
                        <div>
                            <h3 className="sidebar__section-title">Recent Conversations</h3>
                        </div>
                        <div className="custom-scrollbar sidebar__convo-list-container">
                            <ul className="sidebar__convo-list">
                                {Object.entries(groupedUnpinnedConversations).map(([tag, convos], groupIndex) => (
                                    <div key={tag} className="convo-group">
                                        <li className="convo-group__header">
                                            <Tag variant="primary" size="md">{tag}</Tag>
                                        </li>
                                        <li className="convo-group__list">
                                            {convos.map((convo, convoIndex) => (
                                                <ConversationItem
                                                    key={convo.id}
                                                    conversation={convo}
                                                    isActive={!flags.conversationPin && groupIndex === 0 && convoIndex === 0}
                                                    shouldWrap={flags.conversationWrap}
                                                />
                                            ))}
                                        </li>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>

            <div className="sidebar__footer">
                <a href="#" className="menu-item">
                    <Icons name="User" className="menu-item__icon" />
                    <span>Account</span>
                </a>
                {flags.themes && <ThemeToggle />}
            </div>
        </aside>
    );
};

export default Sidebar;