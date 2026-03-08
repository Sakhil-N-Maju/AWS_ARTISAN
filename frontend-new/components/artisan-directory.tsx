'use client';

import { useEffect, useState } from 'react';
import { ArtisanCard } from '@/components/artisan-card';

interface Artisan {
  id: string;
  name: string;
  craftType: string;
  region: string;
  phone: string;
  whatsappNumber: string;
  email?: string;
  bio?: string;
  language: string;
  status: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ArtisanDirectoryProps {
  searchQuery: string;
  craft: string | null;
  region: string | null;
}

export function ArtisanDirectory({ searchQuery, craft, region }: ArtisanDirectoryProps) {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (craft) params.append('craftType', craft);
        if (region) params.append('region', region);
        params.append('status', 'VERIFIED'); // Only show verified artisans

        const response = await fetch(`/api/artisans?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch artisans');
        }

        const result = await response.json();
        setArtisans(result.data || []);
      } catch (err) {
        console.error('Error fetching artisans:', err);
        setError(err instanceof Error ? err.message : 'Failed to load artisans');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, [searchQuery, craft, region]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="text-warm-charcoal/60 text-lg">Loading artisans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600 text-lg">{error}</p>
        <p className="text-warm-charcoal/60 mt-2 text-sm">Please try again later</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-warm-charcoal/60 mb-8">
        Found {artisans.length} artisan{artisans.length !== 1 ? 's' : ''}
      </div>

      {artisans.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-warm-charcoal/60 text-lg">No artisans found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {artisans.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      )}
    </div>
  );
}
