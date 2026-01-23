/**
 * Restaurant Flows Index
 * 
 * Central registry for all restaurant concept flows.
 * Registers flows with the FlowRegistry on import.
 */

import { FlowRegistry, type ChatFlow } from '../../../shared/chatSession';
import { priorityFlows, getFlowIdForPriority } from './priorities';

// Export utilities
export { getFlowIdForPriority } from './priorities';

// Combine all restaurant flows
export const restaurantFlows: ChatFlow[] = [
  ...priorityFlows,
  // Add more flow categories here:
  // ...assetFlows,
  // ...starterFlows,
];

/**
 * Register all restaurant flows with the FlowRegistry.
 * Call this function during app initialization.
 */
export function registerRestaurantFlows(): void {
  FlowRegistry.registerAll(restaurantFlows);
  console.log(`[Restaurant] Registered ${restaurantFlows.length} flows`);
}

/**
 * Get a flow by ID (convenience wrapper).
 */
export function getRestaurantFlow(flowId: string): ChatFlow | null {
  return FlowRegistry.getFlow(flowId);
}
