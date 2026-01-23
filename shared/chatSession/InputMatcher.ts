/**
 * Input Matcher
 * 
 * Matches typed user input against reply buttons in the current node.
 * Supports exact matching (case-insensitive) and fuzzy matching (keyword-based).
 * 
 * This allows users to type what a button says instead of clicking it.
 */

import type { ReplyButton, InputMatchResult } from './types';

/**
 * Match user input against available reply buttons.
 * 
 * @param userInput - The text the user typed
 * @param buttons - Available reply buttons in the current node
 * @returns Match result with the matched button and confidence level
 */
export function matchReplyButton(
  userInput: string,
  buttons: ReplyButton[]
): InputMatchResult {
  if (!buttons || buttons.length === 0) {
    return { matched: false, confidence: 'none' };
  }
  
  const normalized = normalizeInput(userInput);
  
  if (!normalized) {
    return { matched: false, confidence: 'none' };
  }
  
  // 1. Try exact match (case-insensitive)
  const exactMatch = buttons.find(
    button => normalizeInput(button.label) === normalized
  );
  
  if (exactMatch) {
    return { matched: true, button: exactMatch, confidence: 'exact' };
  }
  
  // 2. Try fuzzy match using keywords
  const fuzzyMatch = findFuzzyMatch(normalized, buttons);
  
  if (fuzzyMatch) {
    return { matched: true, button: fuzzyMatch, confidence: 'fuzzy' };
  }
  
  // 3. No match found
  return { matched: false, confidence: 'none' };
}

/**
 * Find a fuzzy match by checking if input contains button keywords.
 */
function findFuzzyMatch(
  normalizedInput: string,
  buttons: ReplyButton[]
): ReplyButton | null {
  let bestMatch: ReplyButton | null = null;
  let bestScore = 0;
  
  for (const button of buttons) {
    // Use explicit matchKeywords if defined, otherwise extract from label
    const keywords = button.matchKeywords ?? extractKeywords(button.label);
    
    if (keywords.length === 0) {
      continue;
    }
    
    // Count how many keywords appear in the input
    const matchedKeywords = keywords.filter(keyword => 
      normalizedInput.includes(keyword)
    );
    
    const matchRatio = matchedKeywords.length / keywords.length;
    
    // Require at least 60% of keywords to match
    if (matchRatio >= 0.6 && matchedKeywords.length > bestScore) {
      bestMatch = button;
      bestScore = matchedKeywords.length;
    }
  }
  
  return bestMatch;
}

/**
 * Normalize input for comparison.
 */
function normalizeInput(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ');   // Normalize whitespace
}

/**
 * Extract keywords from button label for fuzzy matching.
 * Filters out short words and common words.
 */
function extractKeywords(label: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'to', 'me', 'my', 'i', 'you',
    'it', 'this', 'that', 'for', 'on', 'with', 'at', 'by', 'from',
  ]);
  
  return label
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

/**
 * Check if user input is likely asking for more information.
 * Useful for "tell me more" style buttons.
 */
export function isAskingForMore(userInput: string): boolean {
  const morePatterns = [
    'more',
    'detail',
    'explain',
    'elaborate',
    'tell me',
    'what else',
    'continue',
    'go on',
  ];
  
  const normalized = normalizeInput(userInput);
  return morePatterns.some(pattern => normalized.includes(pattern));
}

/**
 * Check if user input is trying to go back.
 */
export function isGoingBack(userInput: string): boolean {
  const backPatterns = [
    'back',
    'previous',
    'return',
    'go back',
    'never mind',
    'cancel',
  ];
  
  const normalized = normalizeInput(userInput);
  return backPatterns.some(pattern => normalized.includes(pattern));
}
