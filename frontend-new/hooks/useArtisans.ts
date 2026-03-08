/**
 * Custom React hook for fetching artisans from the API
 */

import { useState, useEffect } from 'react';
import { Artisan } from '@/types';

interface UseArtisansOptions {
  limit?: number;
  offset?: number;
  craftType?: string;
  region?: string;
  search?: string;
}

interface UseArtisansReturn {
  artisans: Artisan[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useArtisans(options?: UseArtisansOptions): UseArtisansReturn {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());
      if (options?.craftType) params.append('craftType', options.craftType);
      if (options?.region) params.append('region', options.region);
      if (options?.search) params.append('search', options.search);
      params.append('status', 'verified'); // Only show verified artisans

      const response = await fetch(`/api/artisans?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch artisans: ${response.statusText}`);
      }

      const result = await response.json();
      setArtisans(result.data || result || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching artisans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, [options?.limit, options?.offset, options?.craftType, options?.region, options?.search]);

  return {
    artisans,
    loading,
    error,
    refetch: fetchArtisans,
  };
}
