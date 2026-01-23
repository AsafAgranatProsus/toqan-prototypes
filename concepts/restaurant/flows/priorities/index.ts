/**
 * Priority Flows Index
 * 
 * Exports all priority-related flows for the restaurant concept.
 */

import type { ChatFlow } from '../../../../shared/chatSession';
import { cashFlowFlow } from './cashFlow';
import { overtimeFlow } from './overtime';
import { deliveryFlow } from './delivery';

// Export individual flows
export { cashFlowFlow } from './cashFlow';
export { overtimeFlow } from './overtime';
export { deliveryFlow } from './delivery';

// Export all priority flows as an array
export const priorityFlows: ChatFlow[] = [
  cashFlowFlow,
  overtimeFlow,
  deliveryFlow,
];

// Map of priority ticket IDs to flow IDs
export const PRIORITY_FLOW_MAP: Record<string, string> = {
  '1': 'priority-cash-flow',      // Low Cash Flow Warning
  '2': 'priority-delivery',       // Late Delivery Alert: Sysco
  '3': 'priority-overtime',       // Roster Conflict (using overtime flow for now)
  '4': 'priority-cash-flow',      // Salmon Price Surge (shares some cash flow concerns)
  '5': 'priority-overtime',       // Overtime Risk Detected
};

/**
 * Get the flow ID for a given priority ticket.
 */
export function getFlowIdForPriority(ticketId: string): string | null {
  return PRIORITY_FLOW_MAP[ticketId] ?? null;
}
