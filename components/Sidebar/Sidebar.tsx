import React from 'react';
import type { NavItem, Conversation } from '../../types';
import { Icons } from '../Icons/Icons';
import { Logo } from '../Logo/Logo';
import Button from '../Button/Button';
import Tag from '../Tag/Tag';

const navItems: NavItem[] = [
    { id: 'conversations', label: 'Conversations', icon: 'MessageSquare' },
    { id: 'agents', label: 'Agents', icon: 'Bot' },
    { id: 'data-analysts', label: 'Data Analysts', icon: 'Database' },
    { id: 'integrations', label: 'Integrations', icon: 'Plug', beta: true },
    { id: 'library', label: 'Library', icon: 'Library' },
];

const recentConversations: Conversation[] = [
    { id: '0', title: 'Let\'s Take Action!', tag: 'Today', date: 'Sep 18, 2025' },
    { id: '1', title: 'Comparing Activation Func...', tag: 'Yesterday', date: 'Sep 17, 2025' },
    { id: '2', title: 'Examples of Mathematical ...', tag: 'Yesterday', date: 'Sep 17, 2025' },
    { id: '3', title: 'Request for Typographic Va...', tag: 'Yesterday', date: 'Sep 17, 2025' },
    { id: '4', title: 'Advanced Agent Creation a...', tag: 'Sep 17, 2025', date: 'Sep 17, 2025' },
    { id: '5', title: 'Comparing Activation Fun...', tag: 'Sep 16, 2025', date: 'Sep 16, 2025' },
    { id: '6', title: 'Inquiry About Today\'s Date', tag: 'Sep 04, 2025', date: 'Sep 04, 2025' },
    { id: '7', title: 'Inquiry About UI and Fronte...', tag: 'Sep 04, 2025', date: 'Sep 04, 2025' },
    { id: '8', title: 'Hen Party Weekend Plannin...', tag: 'Aug 30, 2025', date: 'Aug 30, 2025' },
    { id: '9', title: 'Customizable Horizontal C...', tag: 'Aug 19, 2025', date: 'Aug 19, 2025' },
];

const ConversationItem: React.FC<{ conversation: Conversation, isActive?: boolean }> = ({ conversation, isActive }) => {
    const itemClasses = ['convo-item', isActive ? 'convo-item--active' : ''].filter(Boolean).join(' ');
    return (
        <a className={itemClasses + " convo-item__title"} title={conversation.title} href="">{conversation.title}</a>
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
    const sidebarClasses = [
        'sidebar',
        isMobile ? 'sidebar--mobile' : '',
        isOpen ? 'sidebar--open' : ''
    ].filter(Boolean).join(' ');

    const groupedConversations = recentConversations.reduce((acc, convo) => {
        const { tag } = convo;
        if (!acc[tag]) {
            acc[tag] = [];
        }
        acc[tag].push(convo);
        return acc;
    }, {} as Record<string, Conversation[]>);

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
            <div className="sidebar__recent custom-scrollbar">
                <h3 className="sidebar__section-title">Recent Conversations</h3>
                <ul className="sidebar__convo-list">
                    {Object.entries(groupedConversations).map(([tag, convos], groupIndex) => (
                        <div key={tag} className="convo-group">
                            <li className="convo-group__header">
                                <Tag variant="primary" size="md">{tag}</Tag>
                            </li>
                            <li className="convo-group__list">
                                {convos.map((convo, convoIndex) => (
                                    <ConversationItem
                                        key={convo.id}
                                        conversation={convo}
                                        isActive={groupIndex === 0 && convoIndex === 0}
                                    />
                                ))}
                            </li>
                        </div>
                    ))}
                </ul>
            </div>

            <div className="sidebar__footer">
                <a href="#" className="menu-item">
                    <Icons name="User" className="menu-item__icon" />
                    <span>Account</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;