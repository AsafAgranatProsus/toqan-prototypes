/**
 * Fallback Handler
 * 
 * Generates fallback responses when user input doesn't match any flow.
 * Analyzes current context to suggest relevant conversation starters.
 */

import type { ChatFlowNode, FallbackContext, ReplyButton } from './types';

/**
 * Fun redirect topics for restaurant context.
 * Each one provides a humorous segue into an actual flow.
 */
const RESTAURANT_REDIRECTS = [
  {
    topic: 'whether salmon prices are trying to bankrupt you',
    label: "What's happening with salmon prices?",
    nextNodeId: null,
    flowHint: 'priority-cash-flow',
    matchKeywords: ['salmon', 'price', 'expensive'],
  },
  {
    topic: 'if Mike is about to hit overtime again',
    label: 'Show me overtime risks',
    nextNodeId: null,
    flowHint: 'priority-overtime',
    matchKeywords: ['overtime', 'mike', 'hours'],
  },
  {
    topic: 'where on earth that Sysco delivery is',
    label: "Where's my Sysco delivery?",
    nextNodeId: null,
    flowHint: 'priority-delivery',
    matchKeywords: ['sysco', 'delivery', 'late'],
  },
  {
    topic: 'why your cash flow looks like a rollercoaster',
    label: 'Review my cash flow',
    nextNodeId: null,
    flowHint: 'priority-cash-flow',
    matchKeywords: ['cash', 'flow', 'money', 'balance'],
  },
  {
    topic: 'how the weekly schedule is shaping up',
    label: 'Show me the schedule',
    nextNodeId: null,
    flowHint: null, // Free text handled
    matchKeywords: ['schedule', 'shifts', 'staff'],
  },
];

/**
 * Pick a random redirect topic for the funny fallback.
 */
function getRandomRedirect(): typeof RESTAURANT_REDIRECTS[0] {
  const index = Math.floor(Math.random() * RESTAURANT_REDIRECTS.length);
  return RESTAURANT_REDIRECTS[index];
}

/**
 * Generate a fallback node based on the current context.
 * Shows a playful prototype message and redirects to a real scenario.
 */
export function generateFallbackNode(
  userInput: string,
  context: FallbackContext
): ChatFlowNode {
  // For restaurant context, use the fun redirect
  if (context.conceptId === 'restaurant') {
    const redirect = getRandomRedirect();
    const starters = getContextualStarters(context, redirect);
    
    return {
      id: 'fallback',
      content: `
        <div class="fallback-response">
          <p><em>Ha!</em> Don't let my glorious appearance fool you into thinking this prototype can do <em>anything</em>!</p>
          <p>While I'm busy training my muscles to become omniscient, let's assume you asked me <strong>${redirect.topic}</strong>.</p>
        </div>
      `,
      replyButtons: starters,
      metadata: {
        isFallback: true,
        originalInput: userInput,
        context,
        redirectedTopic: redirect.topic,
      },
    };
  }

  // Default fallback for non-restaurant contexts
  const starters = getContextualStarters(context);
  
  return {
    id: 'fallback',
    content: `
      <div class="fallback-response">
        <p>I'm a prototype and don't have a specific response for that yet.</p>
        ${starters.length > 0 
          ? '<p>But based on what you\'re looking at, here are some things I can help with:</p>'
          : '<p>Try one of the suggested options, or click on a specific item for more context.</p>'
        }
      </div>
    `,
    replyButtons: starters,
    metadata: {
      isFallback: true,
      originalInput: userInput,
      context,
    },
  };
}

/**
 * Get contextual starter suggestions based on current state.
 * @param context - The fallback context
 * @param priorityRedirect - Optional redirect to show as the primary option
 */
function getContextualStarters(
  context: FallbackContext,
  priorityRedirect?: typeof RESTAURANT_REDIRECTS[0]
): ReplyButton[] {
  const starters: ReplyButton[] = [];
  
  // If we have a priority redirect, add it first
  if (priorityRedirect) {
    starters.push({
      id: 'redirect-primary',
      label: priorityRedirect.label,
      nextNodeId: priorityRedirect.nextNodeId,
      variant: 'primary',
      matchKeywords: priorityRedirect.matchKeywords,
    });
  }
  
  // Add concept-specific starters
  if (context.conceptId === 'restaurant') {
    const restaurantStarters = getRestaurantStarters(context);
    // Filter out duplicates if redirect matches an existing starter
    const filteredStarters = priorityRedirect 
      ? restaurantStarters.filter(s => 
          !priorityRedirect.matchKeywords?.some(kw => 
            s.matchKeywords?.includes(kw)
          )
        )
      : restaurantStarters;
    starters.push(...filteredStarters);
  } else {
    // Default starters for core Toqan
    starters.push(...getDefaultStarters());
  }
  
  // Limit to 4 starters max
  return starters.slice(0, 4);
}

/**
 * Restaurant-specific starter suggestions.
 */
function getRestaurantStarters(context: FallbackContext): ReplyButton[] {
  const starters: ReplyButton[] = [];
  
  // If viewing a specific asset, offer related actions
  if (context.selectedAssetId) {
    starters.push({
      id: 'analyze-current',
      label: 'Analyze this report',
      nextNodeId: null, // Will be resolved by flow
      variant: 'primary',
      matchKeywords: ['analyze', 'report', 'this'],
    });
  }
  
  // Always offer high-value starters for restaurant
  starters.push({
    id: 'pnl-status',
    label: "What's my P&L status?",
    nextNodeId: null, // Will be resolved by flow
    variant: 'primary',
    matchKeywords: ['pnl', 'profit', 'loss', 'status', 'financial'],
  });
  
  starters.push({
    id: 'urgent-priorities',
    label: 'Show urgent priorities',
    nextNodeId: null,
    variant: 'secondary',
    matchKeywords: ['urgent', 'priorities', 'important', 'critical'],
  });
  
  starters.push({
    id: 'labor-overview',
    label: 'Review labor costs',
    nextNodeId: null,
    variant: 'secondary',
    matchKeywords: ['labor', 'staff', 'costs', 'payroll', 'overtime'],
  });
  
  starters.push({
    id: 'inventory-check',
    label: 'Check inventory status',
    nextNodeId: null,
    variant: 'secondary',
    matchKeywords: ['inventory', 'stock', 'supplies', 'order'],
  });
  
  return starters;
}

/**
 * Default starters for core Toqan (non-concept-specific).
 */
function getDefaultStarters(): ReplyButton[] {
  return [
    {
      id: 'help',
      label: 'What can you help me with?',
      nextNodeId: null,
      variant: 'primary',
      matchKeywords: ['help', 'what', 'can', 'do'],
    },
    {
      id: 'data',
      label: 'Show me my data',
      nextNodeId: null,
      variant: 'secondary',
      matchKeywords: ['data', 'show', 'display'],
    },
    {
      id: 'insights',
      label: 'What insights do you have?',
      nextNodeId: null,
      variant: 'secondary',
      matchKeywords: ['insights', 'analysis', 'findings'],
    },
  ];
}

/**
 * Create a simple "no flow found" fallback node.
 * Used when there's minimal context.
 * @param isRestaurant - If true, use the fun restaurant version
 */
export function createMinimalFallback(isRestaurant = false): ChatFlowNode {
  if (isRestaurant) {
    const redirect = getRandomRedirect();
    return {
      id: 'minimal-fallback',
      content: `
        <div class="fallback-response">
          <p><em>Ha!</em> Don't let my glorious appearance fool you into thinking this prototype can do <em>anything</em>!</p>
          <p>While I'm busy training my muscles to become omniscient, let's assume you asked me <strong>${redirect.topic}</strong>.</p>
        </div>
      `,
      replyButtons: [
        {
          id: 'redirect-primary',
          label: redirect.label,
          nextNodeId: redirect.nextNodeId,
          variant: 'primary',
          matchKeywords: redirect.matchKeywords,
        },
      ],
    };
  }

  return {
    id: 'minimal-fallback',
    content: `
      <div class="fallback-response">
        <p>I'm not sure how to help with that yet.</p>
        <p>This is a prototype with limited responses. Try clicking on specific items in the sidebar for more context.</p>
      </div>
    `,
    replyButtons: [],
  };
}
