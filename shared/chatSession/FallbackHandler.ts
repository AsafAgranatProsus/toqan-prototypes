/**
 * Fallback Handler
 * 
 * Generates fallback responses when user input doesn't match any flow.
 * For restaurant context, shows a playful message and immediately continues
 * into a real scenario flow, providing full interactivity.
 */

import type { ChatFlowNode, FallbackContext, ReplyButton } from './types';
import { FlowRegistry } from './FlowRegistry';

/**
 * Fun redirect topics for restaurant context.
 * Each one provides a humorous segue into an actual flow.
 * The `pretendQuestion` is what we'll claim the user "really" asked.
 */
const RESTAURANT_REDIRECTS = [
  {
    pretendQuestion: '"Hey, what\'s going on with my cash flow next week?"',
    flowId: 'priority-cash-flow',
  },
  {
    pretendQuestion: '"Is anyone on my team about to hit overtime?"',
    flowId: 'priority-overtime',
  },
  {
    pretendQuestion: '"Where is that Sysco delivery? It\'s running late!"',
    flowId: 'priority-delivery',
  },
];

/**
 * Pick a random redirect for the funny fallback.
 */
function getRandomRedirect(): typeof RESTAURANT_REDIRECTS[0] {
  const index = Math.floor(Math.random() * RESTAURANT_REDIRECTS.length);
  return RESTAURANT_REDIRECTS[index];
}

/**
 * Generate a fallback node based on the current context.
 * For restaurant context, shows a playful intro and immediately continues
 * with the actual flow content, making the fallback fully interactive.
 */
export function generateFallbackNode(
  userInput: string,
  context: FallbackContext
): ChatFlowNode {
  // For restaurant context, use the fun redirect with actual flow content
  if (context.conceptId === 'restaurant') {
    const redirect = getRandomRedirect();
    const flow = FlowRegistry.getFlow(redirect.flowId);
    
    if (flow) {
      const initialNode = flow.nodes[flow.initialNodeId];
      
      if (initialNode) {
        // Combine the funny intro with the actual flow content
        const funnyIntro = `
          <div class="fallback-intro" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--theme-border-subtle, rgba(128,128,128,0.2));">
            <p><em>Ha!</em> Don't let my glorious appearance fool you into thinking this prototype can do <em>anything</em>!</p>
            <p>While I'm busy training my muscles to become omniscient, let's assume you asked me ${redirect.pretendQuestion}</p>
          </div>
        `;
        
        return {
          id: initialNode.id,
          content: funnyIntro + initialNode.content,
          replyButtons: initialNode.replyButtons,
          metadata: {
            isFallback: true,
            originalInput: userInput,
            context,
            redirectedFlowId: redirect.flowId,
            redirectedQuestion: redirect.pretendQuestion,
          },
        };
      }
    }
    
    // Flow not found - fall back to showing starters
    const starters = getContextualStarters(context);
    return {
      id: 'fallback',
      content: `
        <div class="fallback-response">
          <p><em>Ha!</em> Don't let my glorious appearance fool you into thinking this prototype can do <em>anything</em>!</p>
          <p>I'm still learning, but here are some things I <em>can</em> help with:</p>
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
 * Used as a fallback when flows aren't available.
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
 * @param isRestaurant - If true, use the fun restaurant version with flow content
 */
export function createMinimalFallback(isRestaurant = false): ChatFlowNode {
  if (isRestaurant) {
    const redirect = getRandomRedirect();
    const flow = FlowRegistry.getFlow(redirect.flowId);
    
    if (flow) {
      const initialNode = flow.nodes[flow.initialNodeId];
      
      if (initialNode) {
        const funnyIntro = `
          <div class="fallback-intro" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--theme-border-subtle, rgba(128,128,128,0.2));">
            <p><em>Ha!</em> Don't let my glorious appearance fool you into thinking this prototype can do <em>anything</em>!</p>
            <p>While I'm busy training my muscles to become omniscient, let's assume you asked me ${redirect.pretendQuestion}</p>
          </div>
        `;
        
        return {
          id: initialNode.id,
          content: funnyIntro + initialNode.content,
          replyButtons: initialNode.replyButtons,
        };
      }
    }
    
    // Fallback if flow not found
    return {
      id: 'minimal-fallback',
      content: `
        <div class="fallback-response">
          <p><em>Ha!</em> Don't let my glorious appearance fool you into thinking this prototype can do <em>anything</em>!</p>
          <p>Try clicking on a priority in the sidebar to get started.</p>
        </div>
      `,
      replyButtons: [],
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
