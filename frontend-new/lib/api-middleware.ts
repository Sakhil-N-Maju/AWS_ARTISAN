/**
 * API Middleware for Next.js Route Handlers
 * 
 * Provides authentication, error handling, and request validation
 * for API routes in the frontend application.
 */

import { NextRequest, NextResponse } from 'next/server';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  userRole?: string;
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized - No token provided' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      
      // Verify token with backend
      const verifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!verifyResponse.ok) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid token' },
          { status: 401 }
        );
      }

      const userData = await verifyResponse.json();
      
      // Attach user data to request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.userId = userData.userId;
      authenticatedReq.userRole = userData.role;

      return handler(authenticatedReq);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

/**
 * Error handling wrapper
 * Provides consistent error responses across all API routes
 */
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: any) {
      console.error('API route error:', {
        url: req.url,
        method: req.method,
        error: error.message,
        stack: error.stack,
      });

      // Handle specific error types
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.message },
          { status: 400 }
        );
      }

      if (error.response) {
        // Error from backend API
        return NextResponse.json(
          { 
            error: error.response.data?.error || 'Backend request failed',
            details: error.response.data?.details 
          },
          { status: error.response.status || 500 }
        );
      }

      // Generic error
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Combined middleware for authenticated routes with error handling
 */
export function withAuthAndErrorHandling(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withErrorHandling(withAuth(handler));
}

/**
 * Role-based access control middleware
 */
export function withRole(
  allowedRoles: string[],
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }
    return handler(req);
  });
}

/**
 * Request validation helper
 */
export async function validateRequest<T>(
  req: NextRequest,
  schema: {
    parse: (data: any) => T;
  }
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      ),
    };
  }
}
