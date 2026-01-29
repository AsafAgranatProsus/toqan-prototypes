/**
 * Restaurant Home View Data
 * 
 * Contains pre-seeded data for the restaurant home view:
 * - At a Glance insights (linked to real priorities)
 * - Jump Back In items (linked to pre-seeded conversations)
 * - Agent actions
 */

import type { IconName } from '../../types';
import type { ChatSession, ChatHistoryEntry } from '../../shared/chatSession/types';

// ============================================
// At a Glance Insights (linked to priorities)
// ============================================

export interface GlanceInsight {
  id: string;
  value: string;
  label: string;
  sourceIcon: IconName;
  secondary?: string;
  trend?: 'up' | 'down' | 'neutral';
  /** Links to a priority ticket ID for navigation */
  linkedPriorityId?: string;
  /** Links to a location ID for navigation */
  linkedLocationId?: string;
  /** Links to a nav section */
  linkedNav?: 'priorities' | 'locations' | 'Library';
}

export const glanceInsights: GlanceInsight[] = [
  {
    id: 'cash-flow-warning',
    value: '$980',
    label: 'Projected Low Point',
    sourceIcon: 'AlertCircle',
    secondary: 'Feb 12th - below $1k',
    trend: 'down',
    linkedPriorityId: '1', // Low Cash Flow Warning
    linkedNav: 'priorities',
  },
  {
    id: 'sysco-delivery',
    value: '2h Late',
    label: 'Sysco Delivery',
    sourceIcon: 'Truck',
    secondary: 'Lunch prep at risk',
    trend: 'down',
    linkedPriorityId: '2', // Late Delivery Alert: Sysco
    linkedNav: 'priorities',
  },
  {
    id: 'overtime-risk',
    value: 'Mike T.',
    label: 'Overtime Risk',
    sourceIcon: 'Clock',
    secondary: '38h + 8h scheduled',
    trend: 'up',
    linkedPriorityId: '5', // Overtime Risk Detected
    linkedNav: 'priorities',
  },
  {
    id: 'salmon-price',
    value: '+18%',
    label: 'Salmon Price Surge',
    sourceIcon: 'TrendingUp',
    secondary: 'Affects 3 menu items',
    trend: 'up',
    linkedPriorityId: '4', // Salmon Price Surge
    linkedNav: 'priorities',
  },
];

// ============================================
// Jump Back In Items (linked to seeded sessions)
// ============================================

export interface JumpBackInItem {
  id: string;
  /** Must match a seeded session ID */
  sessionId: string;
  title: string;
  description?: string;
  icon: IconName;
  meta?: string;
}

export const jumpBackInItems: JumpBackInItem[] = [
  {
    id: 'sysco-email',
    sessionId: 'seeded-sysco-email',
    title: 'Email Draft: Sysco Price Negotiation',
    description: 'Follow up on produce pricing',
    icon: 'Mail',
    meta: '2h ago',
  },
  {
    id: 'schedule-review',
    sessionId: 'seeded-schedule-review',
    title: 'Weekly Schedule Review',
    description: 'Updated shifts for next week',
    icon: 'Clock',
    meta: 'Yesterday',
  },
  {
    id: 'inventory-report',
    sessionId: 'seeded-inventory-report',
    title: 'Inventory Report',
    description: 'Monthly stock analysis',
    icon: 'Package',
    meta: '2 days ago',
  },
];

// ============================================
// Agent Actions
// ============================================

export interface AgentAction {
  id: string;
  title: string;
  description?: string;
  icon: IconName;
}

export const agentActions: AgentAction[] = [
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

// ============================================
// Seeded Conversations
// ============================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const now = Date.now();
const hourAgo = now - 2 * 60 * 60 * 1000;
const dayAgo = now - 24 * 60 * 60 * 1000;
const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;

/**
 * Pre-seeded conversations that will be loaded into localStorage on first visit.
 * These provide realistic "Jump Back In" content for stakeholder demos.
 */
export const seededSessions: ChatSession[] = [
  // Sysco Email Draft conversation
  {
    id: 'seeded-sysco-email',
    flowId: null,
    currentNodeId: null,
    title: 'Email Draft: Sysco Price Negotiation',
    triggerType: 'freeText',
    createdAt: hourAgo,
    updatedAt: hourAgo + 5 * 60 * 1000,
    isPersisted: true,
    history: [
      {
        id: generateId(),
        type: 'user',
        content: 'Help me draft an email to Sysco about their recent price increases',
        timestamp: hourAgo,
      },
      {
        id: generateId(),
        type: 'assistant',
        content: `<p>I can help you draft that email. Based on your recent orders, I see Sysco increased prices on several produce items last week. Here's a draft:</p>
<div style="background: var(--theme-surface-raised); padding: 1rem; border-radius: 0.5rem; margin: 0.75rem 0; font-family: monospace; font-size: 0.875rem;">
<p><strong>Subject:</strong> Request for Price Review - Account #4521</p>
<p>Dear Sysco Team,</p>
<p>I'm writing regarding the recent price adjustments on our produce order. We've been a loyal customer for over 3 years and typically order $1,200-1,500 weekly.</p>
<p>I noticed increases of 15-20% on tomatoes, lettuce, and peppers. Could we schedule a call to discuss volume-based pricing or alternative products?</p>
<p>Best regards,<br/>Michael</p>
</div>
<p>Would you like me to adjust the tone or add specific pricing details from your last order?</p>`,
        timestamp: hourAgo + 1000,
      },
      {
        id: generateId(),
        type: 'user',
        content: 'Can you make it more assertive? Mention we might consider other suppliers',
        timestamp: hourAgo + 2 * 60 * 1000,
      },
      {
        id: generateId(),
        type: 'assistant',
        content: `<p>Here's a more assertive version:</p>
<div style="background: var(--theme-surface-raised); padding: 1rem; border-radius: 0.5rem; margin: 0.75rem 0; font-family: monospace; font-size: 0.875rem;">
<p><strong>Subject:</strong> Urgent: Price Review Required - Account #4521</p>
<p>Dear Sysco Team,</p>
<p>I need to address the recent 15-20% price increases on our core produce items. As a 3-year customer with consistent weekly orders of $1,200-1,500, these increases are unsustainable for our operation.</p>
<p>We've received competitive quotes from US Foods and Restaurant Depot that are significantly below your new pricing. Before making any changes to our supplier relationships, I'd like to discuss options.</p>
<p>Please contact me by end of week to arrange a pricing review.</p>
<p>Regards,<br/>Michael<br/>The Corner Bistro</p>
</div>
<p>This version emphasizes your loyalty, mentions competitors, and sets a deadline. Ready to send?</p>`,
        timestamp: hourAgo + 2 * 60 * 1000 + 1000,
      },
      {
        id: generateId(),
        type: 'user',
        content: 'Perfect. Save this as a draft, I\'ll send it tomorrow morning',
        timestamp: hourAgo + 5 * 60 * 1000,
      },
      {
        id: generateId(),
        type: 'assistant',
        content: `<p>✓ <strong>Draft saved.</strong> I'll remind you tomorrow morning at 9 AM to review and send this email.</p>
<p>In the meantime, I can also:</p>
<ul>
<li>Pull your last 3 months of Sysco invoices for reference</li>
<li>Compare current prices with US Foods quotes</li>
<li>Prepare talking points for a follow-up call</li>
</ul>
<p>Just let me know what would be helpful.</p>`,
        timestamp: hourAgo + 5 * 60 * 1000 + 1000,
      },
    ],
  },

  // Weekly Schedule Review conversation
  {
    id: 'seeded-schedule-review',
    flowId: null,
    currentNodeId: null,
    title: 'Weekly Schedule Review',
    triggerType: 'freeText',
    createdAt: dayAgo,
    updatedAt: dayAgo + 10 * 60 * 1000,
    isPersisted: true,
    history: [
      {
        id: generateId(),
        type: 'user',
        content: 'Show me next week\'s schedule',
        timestamp: dayAgo,
      },
      {
        id: generateId(),
        type: 'assistant',
        content: `<p>Here's next week's schedule overview:</p>
<table style="width: 100%; border-collapse: collapse; margin: 0.75rem 0; font-size: 0.875rem;">
<thead>
<tr style="border-bottom: 2px solid var(--theme-border);">
<th style="text-align: left; padding: 0.5rem;">Day</th>
<th style="text-align: left; padding: 0.5rem;">AM Shift</th>
<th style="text-align: left; padding: 0.5rem;">PM Shift</th>
<th style="text-align: left; padding: 0.5rem;">Coverage</th>
</tr>
</thead>
<tbody>
<tr><td style="padding: 0.5rem;">Mon</td><td>Sarah, Mike</td><td>Alex, Jordan</td><td style="color: var(--theme-success);">✓ Full</td></tr>
<tr><td style="padding: 0.5rem;">Tue</td><td>Sarah, Alex</td><td>Mike, Jordan</td><td style="color: var(--theme-success);">✓ Full</td></tr>
<tr style="background: var(--theme-warning-bg);"><td style="padding: 0.5rem;">Wed</td><td>Mike, Jordan</td><td>Sarah, —</td><td style="color: var(--theme-warning);">⚠ 1 short</td></tr>
<tr><td style="padding: 0.5rem;">Thu</td><td>Alex, Sarah</td><td>Mike, Jordan</td><td style="color: var(--theme-success);">✓ Full</td></tr>
<tr><td style="padding: 0.5rem;">Fri</td><td>Sarah, Mike</td><td>Alex, Jordan</td><td style="color: var(--theme-success);">✓ Full</td></tr>
</tbody>
</table>
<p>⚠️ <strong>Issue detected:</strong> Wednesday PM is short-staffed. Alex requested off for a medical appointment.</p>`,
        timestamp: dayAgo + 1000,
      },
      {
        id: generateId(),
        type: 'user',
        content: 'Can anyone cover Wednesday PM?',
        timestamp: dayAgo + 3 * 60 * 1000,
      },
      {
        id: generateId(),
        type: 'assistant',
        content: `<p>I checked availability and found two options:</p>
<ol>
<li><strong>Jordan</strong> can extend to a double shift (she's worked doubles before and her overtime cap allows 4 more hours this week)</li>
<li><strong>Mike T.</strong> could swap with Thursday, but he's already at 38 hours — this would push him into overtime</li>
</ol>
<p>My recommendation: <strong>Ask Jordan first.</strong> She mentioned last week she's saving for a trip, so extra hours might be welcome.</p>
<p>Want me to send Jordan a shift request?</p>`,
        timestamp: dayAgo + 3 * 60 * 1000 + 1000,
      },
      {
        id: generateId(),
        type: 'user',
        content: 'Yes, ask Jordan if she can cover',
        timestamp: dayAgo + 5 * 60 * 1000,
      },
      {
        id: generateId(),
        type: 'assistant',
        content: `<p>✓ <strong>Request sent to Jordan</strong> via the scheduling app.</p>
<p>Message: "Hi Jordan! Can you cover the PM shift on Wednesday (2pm-10pm)? Let me know by tonight if possible. Thanks!"</p>
<p>I'll notify you when she responds. If she declines, I'll automatically check if Mike's overtime is approved.</p>`,
        timestamp: dayAgo + 5 * 60 * 1000 + 1000,
      },
      {
        id: generateId(),
        type: 'user',
        content: 'Great, also remind me to update the POS system with new schedule',
        timestamp: dayAgo + 10 * 60 * 1000,
      },
      {
        id: generateId(),
        type: 'assistant',
        content: `<p>✓ <strong>Reminder set:</strong> Update POS with new schedule — Sunday 6 PM (before the new week starts).</p>
<p>Actually, I can sync the schedule to your POS automatically once Jordan confirms. Want me to enable that?</p>`,
        timestamp: dayAgo + 10 * 60 * 1000 + 1000,
      },
    ],
  },

  // Inventory Report conversation
  {
    id: 'seeded-inventory-report',
    flowId: null,
    currentNodeId: null,
    title: 'Inventory Report',
    triggerType: 'freeText',
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo + 8 * 60 * 1000,
    isPersisted: true,
    history: [
      {
        id: generateId(),
        type: 'user',
        content: 'Give me a quick inventory status',
        timestamp: twoDaysAgo,
      },
      {
        id: generateId(),
        type: 'assistant',
        content: `<p>Here's your current inventory status:</p>
<div style="display: grid; gap: 0.5rem; margin: 0.75rem 0;">
<div style="background: var(--theme-error-bg); padding: 0.75rem; border-radius: 0.5rem; border-left: 3px solid var(--theme-error);">
<strong style="color: var(--theme-error);">🔴 Critical (Reorder Now)</strong>
<ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem;">
<li>Salmon fillets — 4 portions left (2 days)</li>
<li>Heavy cream — 1 quart (1 day)</li>
</ul>
</div>
<div style="background: var(--theme-warning-bg); padding: 0.75rem; border-radius: 0.5rem; border-left: 3px solid var(--theme-warning);">
<strong style="color: var(--theme-warning);">🟡 Low (Order This Week)</strong>
<ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem;">
<li>Chicken breast — 12 lbs (4 days)</li>
<li>Parmesan — 2 lbs (5 days)</li>
<li>Olive oil — 1 gallon (6 days)</li>
</ul>
</div>
<div style="background: var(--theme-success-bg); padding: 0.75rem; border-radius: 0.5rem; border-left: 3px solid var(--theme-success);">
<strong style="color: var(--theme-success);">🟢 Good Stock</strong>
<p style="margin: 0.5rem 0 0 0;">Pasta, rice, canned goods, frozen items, beverages</p>
</div>
</div>`,
        timestamp: twoDaysAgo + 1000,
      },
      {
        id: generateId(),
        type: 'user',
        content: 'Add salmon and cream to the Sysco order',
        timestamp: twoDaysAgo + 2 * 60 * 1000,
      },
      {
        id: generateId(),
        type: 'assistant',
        content: `<p>✓ Added to your draft Sysco order:</p>
<ul>
<li><strong>Atlantic Salmon Fillet</strong> — 15 lbs @ $12.50/lb = $187.50</li>
<li><strong>Heavy Cream 36%</strong> — 4 quarts @ $4.25/qt = $17.00</li>
</ul>
<p>Your draft order total is now <strong>$1,247.50</strong> (delivery Thursday).</p>
<p>Should I also add the low-stock items to the order? That would bring it to ~$1,380.</p>`,
        timestamp: twoDaysAgo + 2 * 60 * 1000 + 1000,
      },
      {
        id: generateId(),
        type: 'user',
        content: 'Yes add them all',
        timestamp: twoDaysAgo + 4 * 60 * 1000,
      },
      {
        id: generateId(),
        type: 'assistant',
        content: `<p>✓ <strong>Order updated.</strong> Here's the complete draft:</p>
<table style="width: 100%; border-collapse: collapse; margin: 0.75rem 0; font-size: 0.875rem;">
<tr style="border-bottom: 1px solid var(--theme-border);"><td style="padding: 0.25rem 0;">Atlantic Salmon (15 lbs)</td><td style="text-align: right;">$187.50</td></tr>
<tr style="border-bottom: 1px solid var(--theme-border);"><td style="padding: 0.25rem 0;">Heavy Cream (4 qt)</td><td style="text-align: right;">$17.00</td></tr>
<tr style="border-bottom: 1px solid var(--theme-border);"><td style="padding: 0.25rem 0;">Chicken Breast (20 lbs)</td><td style="text-align: right;">$78.00</td></tr>
<tr style="border-bottom: 1px solid var(--theme-border);"><td style="padding: 0.25rem 0;">Parmesan Wedge (5 lbs)</td><td style="text-align: right;">$45.00</td></tr>
<tr style="border-bottom: 1px solid var(--theme-border);"><td style="padding: 0.25rem 0;">Olive Oil EVOO (2 gal)</td><td style="text-align: right;">$52.00</td></tr>
<tr style="font-weight: bold;"><td style="padding: 0.5rem 0;">Total</td><td style="text-align: right;">$1,379.50</td></tr>
</table>
<p>Ready to submit for Thursday delivery, or do you want to review first?</p>`,
        timestamp: twoDaysAgo + 4 * 60 * 1000 + 1000,
      },
      {
        id: generateId(),
        type: 'user',
        content: 'I\'ll review tomorrow and submit then',
        timestamp: twoDaysAgo + 8 * 60 * 1000,
      },
      {
        id: generateId(),
        type: 'assistant',
        content: `<p>✓ <strong>Draft saved.</strong> I've set a reminder for tomorrow at 10 AM to review and submit the Sysco order.</p>
<p>Note: To guarantee Thursday delivery, the order needs to be submitted by Wednesday 2 PM.</p>`,
        timestamp: twoDaysAgo + 8 * 60 * 1000 + 1000,
      },
    ],
  },
];

// ============================================
// Session Seeding Logic
// ============================================

const SEEDED_FLAG_KEY = 'toqan-sessions-seeded';
const STORAGE_KEY = 'toqan-chat-sessions';

/**
 * Seeds the pre-defined conversations into localStorage if not already done.
 * Called on app initialization.
 */
export function seedConversationsIfNeeded(): void {
  // Check if we've already seeded
  const alreadySeeded = localStorage.getItem(SEEDED_FLAG_KEY);
  if (alreadySeeded) {
    return;
  }

  try {
    // Load existing sessions (if any)
    const existingData = localStorage.getItem(STORAGE_KEY);
    const existing = existingData ? JSON.parse(existingData) : { sessions: [], activeSessionId: null };

    // Check if any seeded sessions already exist (by ID)
    const existingIds = new Set(existing.sessions.map((s: ChatSession) => s.id));
    const newSessions = seededSessions.filter(s => !existingIds.has(s.id));

    if (newSessions.length > 0) {
      // Add seeded sessions (at the end, so recent items appear first)
      const updatedSessions = [...existing.sessions, ...newSessions];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        sessions: updatedSessions,
        activeSessionId: existing.activeSessionId,
      }));

      console.log(`[HomeViewData] Seeded ${newSessions.length} conversations`);
    }

    // Mark as seeded
    localStorage.setItem(SEEDED_FLAG_KEY, 'true');
  } catch (error) {
    console.error('[HomeViewData] Failed to seed conversations:', error);
  }
}

/**
 * Gets the seeded session IDs for reference.
 */
export function getSeededSessionIds(): string[] {
  return seededSessions.map(s => s.id);
}
