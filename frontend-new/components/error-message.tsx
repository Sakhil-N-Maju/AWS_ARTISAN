/**
 * Error message component with retry functionality
 */

import { AlertCircle, RefreshCw, Home, Grid } from 'lucide-react';
import Link from 'next/link';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showNavigation?: boolean;
}

export function ErrorMessage({ message, onRetry, showNavigation = false }: ErrorMessageProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center py-16">
      <div className="text-center">
        <div className="bg-red-50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        
        <h3 className="text-warm-charcoal mb-2 text-xl font-semibold">
          Oops! Something went wrong
        </h3>
        
        <p className="text-warm-charcoal/60 mb-6 max-w-md">
          {message}
        </p>
        
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-primary hover:bg-secondary flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          )}
          
          {showNavigation && (
            <>
              <Link
                href="/"
                className="border-primary text-primary hover:bg-primary flex items-center gap-2 rounded-lg border-2 px-6 py-3 font-semibold transition hover:text-white"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Link>
              
              <Link
                href="/products"
                className="border-border hover:bg-warm-sand flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition"
              >
                <Grid className="h-4 w-4" />
                Browse Products
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
