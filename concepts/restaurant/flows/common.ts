/**
 * Common Flow Nodes
 * 
 * Shared nodes used across multiple restaurant flows.
 * These can be referenced by their IDs from other flows.
 */

import type { ChatFlowNode } from '../../../shared/chatSession';

/**
 * "Go back" style nodes - can be copied into flows.
 */
export const GO_BACK_NODE: ChatFlowNode = {
  id: 'go-back',
  content: '<p>Okay, going back to the previous options.</p>',
  replyButtons: [], // Will be populated by the flow
};

/**
 * "Tell me more" follow-up node template.
 */
export const TELL_ME_MORE_NODE: ChatFlowNode = {
  id: 'tell-me-more',
  content: '<p>Here are more details...</p>',
  replyButtons: [],
};

/**
 * End of flow summary node template.
 */
export const END_FLOW_NODE: ChatFlowNode = {
  id: 'end-flow',
  content: `
    <div class="flow-summary">
      <p>Is there anything else you'd like to explore?</p>
    </div>
  `,
  replyButtons: [
    { id: 'new-topic', label: 'Start a new topic', nextNodeId: null, variant: 'primary' },
    { id: 'priorities', label: 'Back to priorities', nextNodeId: null },
  ],
};

/**
 * Action confirmation node template.
 */
export const createConfirmationNode = (
  action: string,
  details: string
): ChatFlowNode => ({
  id: `confirm-${action.toLowerCase().replace(/\s+/g, '-')}`,
  content: `
    <div class="action-confirmation">
      <h3>Action: ${action}</h3>
      <p>${details}</p>
      <p><em>In a real implementation, this would execute the action.</em></p>
    </div>
  `,
  replyButtons: [
    { id: 'done', label: 'Done', nextNodeId: null, variant: 'primary' },
  ],
});
