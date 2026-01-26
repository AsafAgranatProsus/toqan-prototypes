/**
 * Thinking Indicator Component
 * 
 * Shows an animated "thinking" state with rotating process messages
 * to simulate AI reasoning before generating a response.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../../components/Icons/Icons';
import './ThinkingIndicator.css';

// Process messages that cycle during thinking
const THINKING_PROCESSES = [
  'Analyzing context...',
  'Retrieving relevant data...',
  'Processing information...',
  'Formulating response...',
  'Checking constraints...',
  'Evaluating options...',
  'Cross-referencing sources...',
  'Generating insights...',
];

// Context-specific process messages
const CONTEXT_PROCESSES: Record<string, string[]> = {
  'priority-cash-flow': [
    'Analyzing cash flow projections...',
    'Checking upcoming obligations...',
    'Reviewing payment schedules...',
    'Calculating runway...',
    'Identifying risk factors...',
  ],
  'priority-overtime': [
    'Reviewing labor schedules...',
    'Calculating weekly hours...',
    'Checking overtime thresholds...',
    'Identifying affected employees...',
    'Evaluating shift options...',
  ],
  'priority-delivery': [
    'Tracking delivery status...',
    'Analyzing supply chain...',
    'Checking inventory levels...',
    'Evaluating menu impact...',
    'Identifying alternatives...',
  ],
};

interface ThinkingIndicatorProps {
  /** Whether currently in thinking state */
  isThinking: boolean;
  
  /** Optional context for specialized process messages */
  contextId?: string;
  
  /** Duration of thinking phase in ms (randomized around this value) */
  duration?: number;
  
  /** Callback when thinking completes */
  onComplete?: () => void;
  
  /** Callback to report the actual duration and processes when complete */
  onThinkingData?: (data: { duration: number; processes: string[] }) => void;
  
  /** Callback when expanded state changes */
  onExpandChange?: (isExpanded: boolean) => void;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  isThinking,
  contextId,
  duration = 3500,
  onComplete,
  onThinkingData,
  onExpandChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentProcess, setCurrentProcess] = useState('');
  const [processHistory, setProcessHistory] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [actualDuration, setActualDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Get process messages based on context
  const getProcesses = () => {
    if (contextId && CONTEXT_PROCESSES[contextId]) {
      return [...CONTEXT_PROCESSES[contextId], ...THINKING_PROCESSES.slice(0, 3)];
    }
    return THINKING_PROCESSES;
  };
  
  useEffect(() => {
    if (!isThinking || isComplete) {
      // Clear any running intervals/timeouts
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    
    const processes = getProcesses();
    let processIndex = 0;
    startTimeRef.current = Date.now();
    
    // Set initial process
    setCurrentProcess(processes[0]);
    setProcessHistory([processes[0]]);
    
    // Cycle through processes with variable timing
    const cycleProcess = () => {
      processIndex = (processIndex + 1) % processes.length;
      const newProcess = processes[processIndex];
      setCurrentProcess(newProcess);
      setProcessHistory(prev => {
        // Keep last 5 processes in history
        const updated = [...prev, newProcess];
        return updated.slice(-5);
      });
      
      // Schedule next cycle with random interval (300-600ms)
      intervalRef.current = setTimeout(cycleProcess, 300 + Math.random() * 300);
    };
    
    // Start cycling after initial delay
    intervalRef.current = setTimeout(cycleProcess, 400 + Math.random() * 200);
    
    // Randomize total duration (±40% for more variance)
    const variance = duration * 0.4;
    const computedDuration = duration + (Math.random() * variance * 2) - variance;
    
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      setActualDuration(elapsed);
      setIsComplete(true);
      onThinkingData?.({ duration: elapsed, processes: processHistory });
      onComplete?.();
    }, computedDuration);
    
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isThinking, contextId, duration, onComplete, isComplete]);
  
  // Don't render if never started thinking
  if (!isThinking && !isComplete) {
    return null;
  }
  
  return (
    <div className={`thinking-indicator ${isComplete ? 'thinking-indicator--completed' : ''}`}>
      <button 
        className="thinking-indicator__header"
        onClick={() => {
          const newExpanded = !isExpanded;
          setIsExpanded(newExpanded);
          onExpandChange?.(newExpanded);
        }}
        aria-expanded={isExpanded}
      >
        <div className="thinking-indicator__status">
          {isComplete ? (
            <Icons name="CheckCheck" className="thinking-indicator__check" />
          ) : (
            <div className="thinking-indicator__spinner" />
          )}
          <span className="thinking-indicator__label">
            {isComplete 
              ? `Thought for ${(actualDuration / 1000).toFixed(1)}s` 
              : 'Thinking'
            }
          </span>
        </div>
        <Icons name="ChevronDown" className="thinking-indicator__chevron" />
      </button>
      
      {isExpanded && (
        <div className="thinking-indicator__content">
          {processHistory.map((process, idx) => (
            <div 
              key={`${process}-${idx}`}
              className={`thinking-indicator__process ${
                !isComplete && idx === processHistory.length - 1 ? 'thinking-indicator__process--active' : ''
              }`}
            >
              <span className="thinking-indicator__bullet">{isComplete ?  <Icons name="Check" className="thinking-indicator__check" /> : '›'}</span>
              {process}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Completed thinking indicator (shown after response is done)
 */
export const CompletedThinkingIndicator: React.FC<{
  processes: string[];
  duration: number;
}> = ({ processes, duration }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="thinking-indicator thinking-indicator--completed">
      <button 
        className="thinking-indicator__header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="thinking-indicator__status">
          <Icons name="Check" />
          <span className="thinking-indicator__label">
            Thought for {(duration / 1000).toFixed(1)}s
          </span>
        </div>
        <Icons name={isExpanded ? 'ChevronUp' : 'ChevronDown'} />
      </button>
      
      {isExpanded && (
        <div className="thinking-indicator__content">
          {processes.map((process, idx) => (
            <div key={idx} className="thinking-indicator__process">
              <span className="thinking-indicator__bullet">✓</span>
              {process}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThinkingIndicator;
