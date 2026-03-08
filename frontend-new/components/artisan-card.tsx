'use client';

import Link from 'next/link';
import { MapPin, Users, Clock, BadgeCheck, MessageCircle, Phone } from 'lucide-react';

interface ArtisanCardProps {
  artisan: {
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
  };
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <div className="card-light overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Image */}
      <div className="bg-warm-sand relative mb-4 h-64 overflow-hidden rounded-lg">
        <img
          src="/placeholder.svg"
          alt={artisan.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="from-warm-charcoal/40 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>

      {/* Info */}
      <div className="space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-warm-charcoal font-serif text-xl font-bold">{artisan.name}</h3>
                {artisan.verified && <BadgeCheck className="text-primary h-5 w-5" />}
              </div>
              <p className="text-primary text-sm font-semibold">{artisan.craftType}</p>
            </div>
          </div>

          <div className="text-warm-charcoal/60 mt-2 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{artisan.region}</span>
          </div>
        </div>

        {/* Bio */}
        {artisan.bio && (
          <p className="text-warm-charcoal/70 line-clamp-2 text-sm">{artisan.bio}</p>
        )}

        {/* Stats */}
        <div className="border-border grid grid-cols-2 gap-3 border-y py-3">
          <div>
            <div className="mb-1 flex items-center gap-1">
              <Phone className="text-primary h-4 w-4" />
              <span className="text-warm-charcoal text-xs font-semibold">Contact</span>
            </div>
            <p className="text-warm-charcoal/60 text-xs">WhatsApp Available</p>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1">
              <Users className="text-secondary h-4 w-4" />
              <span className="text-warm-charcoal text-xs font-semibold">{artisan.language}</span>
            </div>
            <p className="text-warm-charcoal/60 text-xs">Language</p>
          </div>
          <div className="col-span-2">
            <div className="mb-1 flex items-center gap-1">
              <Clock className="text-secondary h-4 w-4" />
              <span className="text-warm-charcoal text-xs font-semibold">
                Joined {new Date(artisan.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/artisans/${artisan.id}`}
            className="bg-primary hover:bg-warm-rust flex-1 rounded-lg py-3 text-center text-sm font-semibold text-white transition"
          >
            View Profile
          </Link>
          <button className="border-primary text-primary hover:bg-primary flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-3 font-semibold transition hover:text-white">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">Message</span>
          </button>
        </div>
      </div>
    </div>
  );
}
