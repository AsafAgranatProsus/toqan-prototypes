/**
 * Fallback Handler
 * 
 * Generates fallback responses when user input doesn't match any flow.
 * Analyzes current context to suggest relevant conversation starters.
 */

import type { ChatFlowNode, FallbackContext, ReplyButton } from './types';

/**
 * Generate a fallback node based on the current context.
 * Shows a prototype message and contextual starter suggestions.
 */
export function generateFallbackNode(
  userInput: string,
  context: FallbackContext
): ChatFlowNode {
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
 */
function getContextualStarters(context: FallbackContext): ReplyButton[] {
  const starters: ReplyButton[] = [];
  
  // Add concept-specific starters
  if (context.conceptId === 'restaurant') {
    starters.push(...getRestaurantStarters(context));
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
 */
export function createMinimalFallback(): ChatFlowNode {
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
