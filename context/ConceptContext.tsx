import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Available concepts - add new concepts here
export const CONCEPTS = {
  core: {
    id: 'core',
    name: 'Core Toqan',
    description: 'The main Toqan AI assistant prototype',
    routePrefix: '', // No prefix for core
  },
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Toqan for restaurant owners & SMBs',
    routePrefix: '/restaurant',
  },
  // Future concepts:
  // education: { id: 'education', name: 'Education', description: '...', routePrefix: '/education' },
} as const;

export type ConceptId = keyof typeof CONCEPTS;
export type Concept = typeof CONCEPTS[ConceptId];

interface ConceptContextType {
  activeConcept: Concept;
  conceptId: ConceptId;
  setConcept: (conceptId: ConceptId) => void;
  concepts: typeof CONCEPTS;
  isConceptActive: (conceptId: ConceptId) => boolean;
}

const ConceptContext = createContext<ConceptContextType | undefined>(undefined);

const STORAGE_KEY = 'toqan-active-concept';

// Load concept from localStorage and URL query parameters
const loadConceptFromStorage = (): ConceptId => {
  // 1. Check URL query parameter first (highest priority)
  const urlParams = new URLSearchParams(window.location.search);
  const urlConcept = urlParams.get('concept');
  if (urlConcept && urlConcept in CONCEPTS) {
    return urlConcept as ConceptId;
  }

  // 2. Check if URL path starts with a concept prefix
  const path = window.location.pathname;
  for (const [id, concept] of Object.entries(CONCEPTS)) {
    if (concept.routePrefix && path.startsWith(concept.routePrefix)) {
      return id as ConceptId;
    }
  }

  // 3. Load from localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in CONCEPTS) {
      return stored as ConceptId;
    }
  } catch (error) {
    console.error('Failed to load concept from localStorage:', error);
  }

  // 4. Default to core
  return 'core';
};

export const ConceptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conceptId, setConceptId] = useState<ConceptId>(loadConceptFromStorage);

  // Save concept to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, conceptId);
    } catch (error) {
      console.error('Failed to save concept to localStorage:', error);
    }
  }, [conceptId]);

  // Apply concept class to HTML element (like feature flags)
  useEffect(() => {
    const html = document.documentElement;
    
    // Remove all concept classes
    Object.keys(CONCEPTS).forEach(id => {
      html.classList.remove(`concept-${id}`);
    });
    
    // Add active concept class
    html.classList.add(`concept-${conceptId}`);
  }, [conceptId]);

  const setConcept = useCallback((newConceptId: ConceptId) => {
    if (newConceptId in CONCEPTS) {
      setConceptId(newConceptId);
    } else {
      console.warn(`Unknown concept: ${newConceptId}`);
    }
  }, []);

  const isConceptActive = useCallback((checkConceptId: ConceptId): boolean => {
    return conceptId === checkConceptId;
  }, [conceptId]);

  const activeConcept = CONCEPTS[conceptId];

  return (
    <ConceptContext.Provider value={{ 
      activeConcept, 
      conceptId, 
      setConcept, 
      concepts: CONCEPTS,
      isConceptActive 
    }}>
      {children}
    </ConceptContext.Provider>
  );
};

export const useConcept = (): ConceptContextType => {
  const context = useContext(ConceptContext);
  if (context === undefined) {
    throw new Error('useConcept must be used within a ConceptProvider');
  }
  return context;
};
