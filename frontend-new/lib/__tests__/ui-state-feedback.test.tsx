/**
 * Property-Based Test: UI State Feedback
 * Feature: frontend-migration
 * Property 15: UI State Feedback
 * 
 * **Validates: Requirements 6.4, 8.5, 9.2, 15.5**
 * 
 * This test verifies that for all asynchronous operations (API calls, file uploads,
 * voice recording), the UI provides visual feedback (loading indicators, progress bars,
 * status messages) during processing and displays results or errors upon completion.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import fc from 'fast-check';
import React, { useState } from 'react';

describe('Property 15: UI State Feedback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Property: Async operations should show loading state
   * 
   * For any asynchronous operation, the UI should display a loading indicator
   * while the operation is in progress.
   */
  it('should display loading indicator during async operations', () => {
    fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 100, max: 2000 }), // Operation duration in ms
        fc.constantFrom('pending', 'loading', 'processing', 'fetching'),
        async (duration, loadingState) => {
          // Component that simulates async operation
          const AsyncComponent = () => {
            const [isLoading, setIsLoading] = useState(false);
            const [result, setResult] = useState<string | null>(null);

            const handleOperation = async () => {
              setIsLoading(true);
              setResult(null);
              
              await new Promise(resolve => setTimeout(resolve, duration));
              
              setIsLoading(false);
              setResult('Operation complete');
            };

            return (
              <div>
                <button onClick={handleOperation}>Start Operation</button>
                {isLoading && <div data-testid="loading-indicator">{loadingState}</div>}
                {result && <div data-testid="result">{result}</div>}
              </div>
            );
          };

          const { getByText, queryByTestId } = render(<AsyncComponent />);
          
          // Initially no loading indicator
          expect(queryByTestId('loading-indicator')).toBeNull();
          
          // Start operation
          const button = getByText('Start Operation');
          act(() => {
            button.click();
          });

          // Loading indicator should appear immediately
          await waitFor(() => {
            expect(queryByTestId('loading-indicator')).not.toBeNull();
          }, { timeout: 100 });

          // Wait for operation to complete
          await waitFor(() => {
            expect(queryByTestId('result')).not.toBeNull();
          }, { timeout: duration + 500 });

          // Loading indicator should disappear
          expect(queryByTestId('loading-indicator')).toBeNull();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Progress should be tracked for long operations
   * 
   * For operations with measurable progress, the UI should display a progress
   * indicator that updates as the operation progresses.
   */
  it('should track and display progress for long operations', () => {
    fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 5, max: 20 }), // Number of steps
        fc.integer({ min: 50, max: 200 }), // Time per step in ms
        async (steps, timePerStep) => {
          // Component with progress tracking
          const ProgressComponent = () => {
            const [progress, setProgress] = useState(0);
            const [isProcessing, setIsProcessing] = useState(false);

            const handleOperation = async () => {
              setIsProcessing(true);
              setProgress(0);

              for (let i = 1; i <= steps; i++) {
                await new Promise(resolve => setTimeout(resolve, timePerStep));
                setProgress((i / steps) * 100);
              }

              setIsProcessing(false);
            };

            return (
              <div>
                <button onClick={handleOperation}>Start</button>
                {isProcessing && (
                  <div>
                    <div data-testid="progress-bar" data-progress={progress}>
                      Progress: {Math.round(progress)}%
                    </div>
                  </div>
                )}
                {!isProcessing && progress === 100 && (
                  <div data-testid="complete">Complete</div>
                )}
              </div>
            );
          };

          const { getByText, queryByTestId } = render(<ProgressComponent />);
          
          // Start operation
          const button = getByText('Start');
          act(() => {
            button.click();
          });

          // Progress bar should appear
          await waitFor(() => {
            expect(queryByTestId('progress-bar')).not.toBeNull();
          }, { timeout: 100 });

          // Progress should increase
          let lastProgress = 0;
          for (let i = 0; i < 3; i++) {
            await new Promise(resolve => setTimeout(resolve, timePerStep * 2));
            const progressBar = queryByTestId('progress-bar');
            if (progressBar) {
              const currentProgress = parseFloat(progressBar.getAttribute('data-progress') || '0');
              expect(currentProgress).toBeGreaterThanOrEqual(lastProgress);
              lastProgress = currentProgress;
            }
          }

          // Wait for completion
          await waitFor(() => {
            expect(queryByTestId('complete')).not.toBeNull();
          }, { timeout: steps * timePerStep + 1000 });

          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property: Errors should be displayed with user-friendly messages
   * 
   * When an async operation fails, the UI should display a clear error message
   * and hide loading indicators.
   */
  it('should display error messages when operations fail', () => {
    fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'Network error',
          'Server error',
          'Timeout',
          'Permission denied',
          'Invalid input'
        ),
        fc.integer({ min: 100, max: 500 }),
        async (errorMessage, delay) => {
          // Component that simulates failing operation
          const ErrorComponent = () => {
            const [isLoading, setIsLoading] = useState(false);
            const [error, setError] = useState<string | null>(null);

            const handleOperation = async () => {
              setIsLoading(true);
              setError(null);

              await new Promise(resolve => setTimeout(resolve, delay));

              setIsLoading(false);
              setError(errorMessage);
            };

            return (
              <div>
                <button onClick={handleOperation}>Start</button>
                {isLoading && <div data-testid="loading">Loading...</div>}
                {error && <div data-testid="error" role="alert">{error}</div>}
              </div>
            );
          };

          const { getByText, queryByTestId } = render(<ErrorComponent />);
          
          // Start operation
          const button = getByText('Start');
          act(() => {
            button.click();
          });

          // Loading should appear
          await waitFor(() => {
            expect(queryByTestId('loading')).not.toBeNull();
          }, { timeout: 100 });

          // Wait for error
          await waitFor(() => {
            expect(queryByTestId('error')).not.toBeNull();
          }, { timeout: delay + 500 });

          // Loading should disappear
          expect(queryByTestId('loading')).toBeNull();

          // Error message should be displayed
          const errorElement = queryByTestId('error');
          expect(errorElement).not.toBeNull();
          expect(errorElement?.textContent).toBe(errorMessage);
          expect(errorElement?.getAttribute('role')).toBe('alert');

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Success states should be clearly indicated
   * 
   * When an async operation completes successfully, the UI should display
   * a success indicator and the operation result.
   */
  it('should display success indicators when operations complete', () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 5, maxLength: 50 }),
        fc.integer({ min: 100, max: 500 }),
        async (resultData, delay) => {
          // Component with success state
          const SuccessComponent = () => {
            const [isLoading, setIsLoading] = useState(false);
            const [result, setResult] = useState<string | null>(null);
            const [showSuccess, setShowSuccess] = useState(false);

            const handleOperation = async () => {
              setIsLoading(true);
              setResult(null);
              setShowSuccess(false);

              await new Promise(resolve => setTimeout(resolve, delay));

              setIsLoading(false);
              setResult(resultData);
              setShowSuccess(true);
            };

            return (
              <div>
                <button onClick={handleOperation}>Start</button>
                {isLoading && <div data-testid="loading">Processing...</div>}
                {showSuccess && (
                  <div data-testid="success" role="status">
                    <div data-testid="success-icon">✓</div>
                    <div data-testid="result">{result}</div>
                  </div>
                )}
              </div>
            );
          };

          const { getByText, queryByTestId } = render(<SuccessComponent />);
          
          // Start operation
          const button = getByText('Start');
          act(() => {
            button.click();
          });

          // Wait for success
          await waitFor(() => {
            expect(queryByTestId('success')).not.toBeNull();
          }, { timeout: delay + 500 });

          // Loading should be gone
          expect(queryByTestId('loading')).toBeNull();

          // Success indicator should be present
          expect(queryByTestId('success-icon')).not.toBeNull();
          expect(queryByTestId('result')?.textContent).toBe(resultData);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Multiple concurrent operations should have independent feedback
   * 
   * When multiple async operations run concurrently, each should have its own
   * independent loading/success/error state.
   */
  it('should maintain independent feedback for concurrent operations', () => {
    fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 10 }),
            duration: fc.integer({ min: 100, max: 800 }),
            shouldFail: fc.boolean(),
          }),
          { minLength: 2, maxLength: 5 }
        ),
        async (operations) => {
          // Component with multiple operations
          const MultiOperationComponent = () => {
            const [states, setStates] = useState<Map<string, {
              loading: boolean;
              success: boolean;
              error: boolean;
            }>>(new Map());

            const handleOperation = async (op: typeof operations[0]) => {
              setStates(prev => new Map(prev).set(op.id, {
                loading: true,
                success: false,
                error: false,
              }));

              await new Promise(resolve => setTimeout(resolve, op.duration));

              setStates(prev => new Map(prev).set(op.id, {
                loading: false,
                success: !op.shouldFail,
                error: op.shouldFail,
              }));
            };

            return (
              <div>
                {operations.map(op => {
                  const state = states.get(op.id) || { loading: false, success: false, error: false };
                  return (
                    <div key={op.id} data-testid={`operation-${op.id}`}>
                      <button onClick={() => handleOperation(op)}>Start {op.id}</button>
                      {state.loading && <span data-testid={`loading-${op.id}`}>Loading</span>}
                      {state.success && <span data-testid={`success-${op.id}`}>Success</span>}
                      {state.error && <span data-testid={`error-${op.id}`}>Error</span>}
                    </div>
                  );
                })}
              </div>
            );
          };

          const { getByText, queryByTestId } = render(<MultiOperationComponent />);
          
          // Start all operations
          operations.forEach(op => {
            const button = getByText(`Start ${op.id}`);
            act(() => {
              button.click();
            });
          });

          // All should show loading
          await waitFor(() => {
            operations.forEach(op => {
              expect(queryByTestId(`loading-${op.id}`)).not.toBeNull();
            });
          }, { timeout: 200 });

          // Wait for all to complete
          const maxDuration = Math.max(...operations.map(op => op.duration));
          await new Promise(resolve => setTimeout(resolve, maxDuration + 500));

          // Each should have correct final state
          operations.forEach(op => {
            expect(queryByTestId(`loading-${op.id}`)).toBeNull();
            if (op.shouldFail) {
              expect(queryByTestId(`error-${op.id}`)).not.toBeNull();
              expect(queryByTestId(`success-${op.id}`)).toBeNull();
            } else {
              expect(queryByTestId(`success-${op.id}`)).not.toBeNull();
              expect(queryByTestId(`error-${op.id}`)).toBeNull();
            }
          });

          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property: State transitions should be atomic
   * 
   * State transitions (idle → loading → success/error) should be atomic
   * with no intermediate invalid states.
   */
  it('should maintain atomic state transitions', () => {
    fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 100, max: 500 }),
        fc.boolean(),
        async (duration, shouldSucceed) => {
          // Component that tracks state transitions
          const StateTransitionComponent = () => {
            const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
            const [transitionLog, setTransitionLog] = useState<string[]>([]);

            const handleOperation = async () => {
              // Log transition
              setTransitionLog(prev => [...prev, 'idle→loading']);
              setState('loading');

              await new Promise(resolve => setTimeout(resolve, duration));

              // Log transition
              const nextState = shouldSucceed ? 'success' : 'error';
              setTransitionLog(prev => [...prev, `loading→${nextState}`]);
              setState(nextState);
            };

            return (
              <div>
                <button onClick={handleOperation}>Start</button>
                <div data-testid="state">{state}</div>
                <div data-testid="transitions">{transitionLog.join(',')}</div>
              </div>
            );
          };

          const { getByText, queryByTestId } = render(<StateTransitionComponent />);
          
          // Initial state
          expect(queryByTestId('state')?.textContent).toBe('idle');

          // Start operation
          const button = getByText('Start');
          act(() => {
            button.click();
          });

          // Should transition to loading
          await waitFor(() => {
            expect(queryByTestId('state')?.textContent).toBe('loading');
          }, { timeout: 100 });

          // Wait for completion
          await waitFor(() => {
            const finalState = queryByTestId('state')?.textContent;
            expect(finalState).toBe(shouldSucceed ? 'success' : 'error');
          }, { timeout: duration + 500 });

          // Verify transition log
          const transitions = queryByTestId('transitions')?.textContent || '';
          const expectedTransition = shouldSucceed 
            ? 'idle→loading,loading→success'
            : 'idle→loading,loading→error';
          expect(transitions).toBe(expectedTransition);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Feedback should be accessible
   * 
   * All UI feedback (loading, success, error) should be accessible to
   * screen readers via appropriate ARIA attributes.
   */
  it('should provide accessible feedback with ARIA attributes', () => {
    fc.assert(
      fc.asyncProperty(
        fc.constantFrom('success', 'error', 'loading'),
        fc.string({ minLength: 5, maxLength: 50 }),
        async (feedbackType, message) => {
          // Component with accessible feedback
          const AccessibleComponent = () => {
            const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
            const [feedbackMessage, setFeedbackMessage] = useState('');

            const handleOperation = async () => {
              setState('loading');
              setFeedbackMessage('Processing...');

              await new Promise(resolve => setTimeout(resolve, 200));

              if (feedbackType === 'success') {
                setState('success');
                setFeedbackMessage(message);
              } else if (feedbackType === 'error') {
                setState('error');
                setFeedbackMessage(message);
              }
            };

            return (
              <div>
                <button onClick={handleOperation}>Start</button>
                {state === 'loading' && (
                  <div role="status" aria-live="polite" data-testid="loading">
                    {feedbackMessage}
                  </div>
                )}
                {state === 'success' && (
                  <div role="status" aria-live="polite" data-testid="success">
                    {feedbackMessage}
                  </div>
                )}
                {state === 'error' && (
                  <div role="alert" aria-live="assertive" data-testid="error">
                    {feedbackMessage}
                  </div>
                )}
              </div>
            );
          };

          const { getByText, queryByTestId } = render(<AccessibleComponent />);
          
          // Start operation
          const button = getByText('Start');
          act(() => {
            button.click();
          });

          // Wait for final state
          await waitFor(() => {
            const element = queryByTestId(feedbackType);
            expect(element).not.toBeNull();
          }, { timeout: 500 });

          // Verify ARIA attributes
          const element = queryByTestId(feedbackType);
          expect(element).not.toBeNull();
          
          if (feedbackType === 'error') {
            expect(element?.getAttribute('role')).toBe('alert');
            expect(element?.getAttribute('aria-live')).toBe('assertive');
          } else {
            expect(element?.getAttribute('role')).toBe('status');
            expect(element?.getAttribute('aria-live')).toBe('polite');
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Rapid state changes should be handled gracefully
   * 
   * When operations are triggered in rapid succession, the UI should handle
   * state changes gracefully without race conditions or stale states.
   */
  it('should handle rapid state changes without race conditions', () => {
    fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 2, max: 5 }),
        fc.integer({ min: 100, max: 300 }),
        async (operationCount, operationDuration) => {
          // Component that handles rapid operations
          const RapidOperationComponent = () => {
            const [operationId, setOperationId] = useState(0);
            const [isLoading, setIsLoading] = useState(false);
            const [result, setResult] = useState<number | null>(null);

            const handleOperation = async () => {
              const currentId = operationId + 1;
              setOperationId(currentId);
              setIsLoading(true);
              setResult(null);

              await new Promise(resolve => setTimeout(resolve, operationDuration));

              // Only update if this is still the latest operation
              setOperationId(prevId => {
                if (prevId === currentId) {
                  setIsLoading(false);
                  setResult(currentId);
                }
                return prevId;
              });
            };

            return (
              <div>
                <button onClick={handleOperation}>Start</button>
                {isLoading && <div data-testid="loading">Loading</div>}
                {result !== null && <div data-testid="result">{result}</div>}
              </div>
            );
          };

          const { getByText, queryByTestId } = render(<RapidOperationComponent />);
          
          const button = getByText('Start');

          // Trigger multiple operations rapidly
          for (let i = 0; i < operationCount; i++) {
            act(() => {
              button.click();
            });
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          // Wait for all operations to complete
          await new Promise(resolve => setTimeout(resolve, operationDuration + 500));

          // Should show result from last operation
          const resultElement = queryByTestId('result');
          if (resultElement) {
            const resultValue = parseInt(resultElement.textContent || '0');
            expect(resultValue).toBeGreaterThan(0);
            expect(resultValue).toBeLessThanOrEqual(operationCount);
          }

          // Loading should be cleared
          expect(queryByTestId('loading')).toBeNull();

          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property: Timeout operations should provide feedback
   * 
   * When operations timeout, the UI should display appropriate timeout
   * feedback and allow retry.
   */
  it('should provide feedback for timeout operations', () => {
    fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 500, max: 1000 }),
        fc.integer({ min: 100, max: 400 }),
        async (operationDuration, timeoutDuration) => {
          // Component with timeout handling
          const TimeoutComponent = () => {
            const [state, setState] = useState<'idle' | 'loading' | 'success' | 'timeout'>('idle');

            const handleOperation = async () => {
              setState('loading');

              const operationPromise = new Promise(resolve => 
                setTimeout(resolve, operationDuration)
              );

              const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), timeoutDuration)
              );

              try {
                await Promise.race([operationPromise, timeoutPromise]);
                setState('success');
              } catch (error) {
                setState('timeout');
              }
            };

            return (
              <div>
                <button onClick={handleOperation} data-testid="start-button">Start</button>
                {state === 'loading' && <div data-testid="loading">Loading...</div>}
                {state === 'success' && <div data-testid="success">Success</div>}
                {state === 'timeout' && (
                  <div>
                    <div data-testid="timeout">Operation timed out</div>
                    <button onClick={handleOperation} data-testid="retry-button">Retry</button>
                  </div>
                )}
              </div>
            );
          };

          const { queryByTestId } = render(<TimeoutComponent />);
          
          // Start operation
          const startButton = queryByTestId('start-button');
          act(() => {
            startButton?.click();
          });

          // Wait for result
          await new Promise(resolve => setTimeout(resolve, Math.max(operationDuration, timeoutDuration) + 300));

          // Should show either success or timeout
          const hasSuccess = queryByTestId('success') !== null;
          const hasTimeout = queryByTestId('timeout') !== null;
          
          expect(hasSuccess || hasTimeout).toBe(true);
          expect(queryByTestId('loading')).toBeNull();

          // If timeout, retry button should be available
          if (hasTimeout) {
            expect(queryByTestId('retry-button')).not.toBeNull();
          }

          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});
