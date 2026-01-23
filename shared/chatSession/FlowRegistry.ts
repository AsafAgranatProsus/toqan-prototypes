/**
 * Flow Registry
 * 
 * Central registry for chat flows. Concepts register their flows here,
 * and the engine looks them up by ID or matches them against user input.
 * 
 * Features:
 * - O(1) lookup by flow ID
 * - Keyword-indexed pattern matching for free text
 * - Category-based organization for lazy loading (future)
 */

import type { ChatFlow } from './types';

class FlowRegistryImpl {
  /** All registered flows, keyed by flow ID */
  private flows: Map<string, ChatFlow> = new Map();
  
  /** Keyword index for fast pattern matching: keyword → flowIds */
  private keywordIndex: Map<string, Set<string>> = new Map();
  
  /**
   * Register a flow with the registry.
   * Indexes match patterns for fast lookup.
   */
  register(flow: ChatFlow): void {
    // Store the flow
    this.flows.set(flow.id, flow);
    
    // Index match patterns for fast lookup
    if (flow.matchPatterns) {
      flow.matchPatterns.forEach(pattern => {
        const keywords = this.extractKeywords(pattern);
        keywords.forEach(keyword => {
          if (!this.keywordIndex.has(keyword)) {
            this.keywordIndex.set(keyword, new Set());
          }
          this.keywordIndex.get(keyword)!.add(flow.id);
        });
      });
    }
  }
  
  /**
   * Register multiple flows at once.
   */
  registerAll(flows: ChatFlow[]): void {
    flows.forEach(flow => this.register(flow));
  }
  
  /**
   * Get a flow by its ID.
   */
  getFlow(flowId: string): ChatFlow | null {
    return this.flows.get(flowId) ?? null;
  }
  
  /**
   * Get all flows in a category.
   */
  getFlowsByCategory(category: string): ChatFlow[] {
    return Array.from(this.flows.values()).filter(
      flow => flow.category === category
    );
  }
  
  /**
   * Match user input against registered flow patterns.
   * Returns the best matching flow, or null if no match.
   */
  matchFlow(userInput: string): ChatFlow | null {
    const inputKeywords = this.extractKeywords(userInput);
    
    if (inputKeywords.length === 0) {
      return null;
    }
    
    // Count matches per flow
    const matchCounts = new Map<string, number>();
    
    inputKeywords.forEach(keyword => {
      const flowIds = this.keywordIndex.get(keyword);
      if (flowIds) {
        flowIds.forEach(flowId => {
          matchCounts.set(flowId, (matchCounts.get(flowId) ?? 0) + 1);
        });
      }
    });
    
    if (matchCounts.size === 0) {
      return null;
    }
    
    // Find the flow with the highest match count
    let bestFlowId: string | null = null;
    let bestCount = 0;
    
    matchCounts.forEach((count, flowId) => {
      // Require at least 2 keyword matches for a valid match
      if (count > bestCount && count >= 2) {
        bestCount = count;
        bestFlowId = flowId;
      }
    });
    
    if (!bestFlowId) {
      return null;
    }
    
    return this.flows.get(bestFlowId) ?? null;
  }
  
  /**
   * Check if a flow exists.
   */
  hasFlow(flowId: string): boolean {
    return this.flows.has(flowId);
  }
  
  /**
   * Get all registered flow IDs.
   */
  getAllFlowIds(): string[] {
    return Array.from(this.flows.keys());
  }
  
  /**
   * Get count of registered flows.
   */
  getFlowCount(): number {
    return this.flows.size;
  }
  
  /**
   * Clear all registered flows (useful for testing).
   */
  clear(): void {
    this.flows.clear();
    this.keywordIndex.clear();
  }
  
  /**
   * Extract keywords from text for indexing/matching.
   * Filters out short words and common stop words.
   */
  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
      'would', 'could', 'should', 'may', 'might', 'must', 'shall',
      'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in',
      'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into',
      'through', 'during', 'before', 'after', 'above', 'below',
      'between', 'under', 'again', 'further', 'then', 'once',
      'here', 'there', 'when', 'where', 'why', 'how', 'all',
      'each', 'few', 'more', 'most', 'other', 'some', 'such',
      'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
      'too', 'very', 'just', 'and', 'but', 'if', 'or', 'because',
      'until', 'while', 'about', 'against', 'what', 'which', 'who',
      'this', 'that', 'these', 'those', 'am', 'it', 'its', 'my',
      'me', 'i', 'you', 'your', 'we', 'our', 'they', 'their', 'him',
      'her', 'his', 'she', 'he', 'tell', 'show', 'give', 'get',
    ]);
    
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }
}

// Singleton instance
export const FlowRegistry = new FlowRegistryImpl();

// Export the class for testing
export { FlowRegistryImpl };
