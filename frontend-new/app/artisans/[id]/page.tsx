'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Users,
  Package,
  Clock,
  BadgeCheck,
  MessageCircle,
  Share2,
  Heart,
  Eye,
  ArrowLeft,
  Phone,
} from 'lucide-react';
import { MessagePopup } from '@/components/message-popup';

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

export default function ArtisanProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isFollowing, setIsFollowing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/artisans?id=${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch artisan details');
        }

        const result = await response.json();
        setArtisan(result.data);
      } catch (err) {
        console.error('Error fetching artisan:', err);
        setError(err instanceof Error ? err.message : 'Failed to load artisan details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtisan();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="bg-warm-cream min-h-screen">
        <Navigation scrolled={scrolled} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-warm-charcoal/60 text-lg">Loading artisan profile...</div>
        </div>
      </main>
    );
  }

  if (error || !artisan) {
    return (
      <main className="bg-warm-cream min-h-screen">
        <Navigation scrolled={scrolled} />
        <div className="flex min-h-screen flex-col items-center justify-center">
          <p className="text-red-600 text-lg">{error || 'Artisan not found'}</p>
          <button
            onClick={() => router.push('/artisans')}
            className="text-primary hover:text-warm-rust mt-4 font-semibold"
          >
            Back to Artisans
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      <div className="w-full">
        {/* Back Button */}
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="text-warm-charcoal hover:text-primary group flex items-center gap-2 transition"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-semibold">Back</span>
          </button>
        </div>

        {/* Cover Image */}
        <div className="relative mt-4 h-64 overflow-hidden sm:h-80">
          <img
            src="/placeholder.svg"
            alt="Cover"
            className="h-full w-full object-cover"
          />
          <div className="from-warm-charcoal/60 absolute inset-0 bg-gradient-to-t to-transparent" />
        </div>

        {/* Profile Content */}
        <div className="relative z-10 mx-auto -mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-8 md:col-span-2">
              {/* Profile Header */}
              <div className="card-light space-y-6">
                <div className="flex flex-col items-start gap-6 sm:flex-row">
                  <img
                    src="/placeholder.svg"
                    alt={artisan.name}
                    className="h-32 w-32 rounded-2xl object-cover"
                  />

                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <h1 className="text-warm-charcoal font-serif text-4xl font-bold">
                          {artisan.name}
                        </h1>
                        {artisan.verified && <BadgeCheck className="text-primary h-8 w-8" />}
                      </div>
                      <p className="text-primary text-xl font-semibold">{artisan.craftType}</p>
                    </div>

                    <div className="text-warm-charcoal/60 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{artisan.region}</span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="text-warm-charcoal/60 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{artisan.phone}</span>
                      </div>
                      {artisan.email && (
                        <div className="text-warm-charcoal/60 flex items-center gap-2">
                          <span className="text-sm">{artisan.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      <button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={`rounded-lg px-6 py-2 font-semibold transition ${
                          isFollowing
                            ? 'bg-primary text-white'
                            : 'border-primary text-primary hover:bg-primary border-2 hover:text-white'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                      <button
                        onClick={() => setShowMessagePopup(true)}
                        className="border-primary text-primary hover:bg-primary flex items-center gap-2 rounded-lg border-2 px-6 py-2 font-semibold transition hover:text-white"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </button>
                      <button className="border-border text-warm-charcoal hover:bg-warm-sand rounded-lg border-2 px-6 py-2 font-semibold transition">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {artisan.bio && (
                  <div className="border-border border-t pt-6">
                    <p className="text-warm-charcoal/70 leading-relaxed">{artisan.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Verification Card */}
              {artisan.verified && (
                <div className="card-light space-y-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <BadgeCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-warm-charcoal font-bold">Verified Artisan</h3>
                    <p className="text-warm-charcoal/60 text-sm">100% authentic & reliable</p>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="card-light space-y-4">
                <h3 className="text-warm-charcoal font-bold">Contact Information</h3>
                <div className="space-y-3">
                  <div className="text-warm-charcoal/70 flex items-center gap-2">
                    <Phone className="text-primary h-5 w-5" />
                    <span className="text-sm">WhatsApp: {artisan.whatsappNumber}</span>
                  </div>
                  <div className="text-warm-charcoal/70 flex items-center gap-2">
                    <Users className="text-primary h-5 w-5" />
                    <span className="text-sm">Language: {artisan.language}</span>
                  </div>
                  <div className="text-warm-charcoal/70 flex items-center gap-2">
                    <Clock className="text-primary h-5 w-5" />
                    <span className="text-sm">
                      Joined: {new Date(artisan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20" />
      <Footer />

      {/* Message Popup */}
      {showMessagePopup && (
        <MessagePopup
          artisanId={id}
          artisanName={artisan.name}
          artisanImage="/placeholder.svg"
          onClose={() => setShowMessagePopup(false)}
        />
      )}
    </main>
  );
}
