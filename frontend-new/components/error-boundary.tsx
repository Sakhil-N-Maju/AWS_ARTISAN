'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Wraps components to prevent entire app crashes
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console with component stack trace
    console.error('Error Boundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="bg-warm-cream flex min-h-[400px] items-center justify-center p-6">
          <div className="card-light max-w-md text-center">
            <div className="bg-red-50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <h2 className="text-warm-charcoal mb-2 font-serif text-2xl font-bold">
              Something went wrong
            </h2>

            <p className="text-warm-charcoal/70 mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support
              if the problem persists.
            </p>

            {this.state.error && (
              <details className="text-warm-charcoal/60 mb-6 text-left text-sm">
                <summary className="cursor-pointer font-semibold">Error details</summary>
                <pre className="bg-warm-sand/50 mt-2 overflow-auto rounded p-3 text-xs">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="bg-primary hover:bg-secondary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap a component with an error boundary
 * @param Component - The component to wrap
 * @param fallback - Optional custom fallback UI
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.ComponentType<P> {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
