'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { useParams, useRouter } from 'next/navigation';
import { Clock, Users, MapPin, Heart, Share2, Check, Calendar } from 'lucide-react';
import { WorkshopCalendar } from '@/components/workshops/workshop-calendar';
import { VirtualTour } from '@/components/workshops/virtual-tour';
import type { Workshop, WorkshopSchedule } from '@/lib/workshop-booking-service';

export default function WorkshopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [schedules, setSchedules] = useState<WorkshopSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  // Fetch workshop details
  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await fetch(`/api/workshops/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setWorkshop(data.data);
        }
      } catch (error) {
        console.error('Error fetching workshop:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [id]);

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`/api/workshops/${id}/schedules`);
        const data = await response.json();
        
        if (data.success) {
          setSchedules(data.data);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    if (workshop) {
      fetchSchedules();
    }
  }, [id, workshop]);

  const handleBooking = async () => {
    if (!selectedSchedule || !workshop) {
      alert('Please select a date and time for the workshop');
      return;
    }

    setBookingInProgress(true);

    try {
      const response = await fetch('/api/workshops/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workshopId: workshop.id,
          scheduleId: selectedSchedule,
          participants: Array.from({ length: quantity }, (_, i) => ({
            name: `Participant ${i + 1}`,
            email: 'user@example.com',
            phone: '+91 1234567890',
          })),
          paymentMethod: {
            type: 'card',
            details: {
              // Payment details would come from a payment form
            },
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Workshop booked successfully! Confirmation code: ${data.data.booking.confirmationCode}`);
        router.push('/dashboard');
      } else {
        alert(`Booking failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error booking workshop:', error);
      alert('Failed to book workshop. Please try again.');
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-warm-cream min-h-screen">
        <Navigation scrolled={scrolled} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-warm-charcoal text-lg">Loading workshop details...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!workshop) {
    return (
      <main className="bg-warm-cream min-h-screen">
        <Navigation scrolled={scrolled} />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-warm-charcoal text-lg">Workshop not found</div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-warm-sand aspect-square overflow-hidden rounded-2xl">
              <img
                src={workshop.images[0] || '/placeholder.svg'}
                alt={workshop.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {workshop.images.slice(1, 4).map((img, idx) => (
                <button
                  key={idx}
                  className="border-primary aspect-square overflow-hidden rounded-lg border-2 transition hover:scale-105"
                >
                  <img
                    src={img || '/placeholder.svg'}
                    alt={`Gallery ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-secondary mb-2 text-sm font-semibold tracking-wide uppercase">
                {workshop.craftType}
              </p>
              <h1 className="text-warm-charcoal mb-3 font-serif text-4xl font-bold">
                {workshop.title}
              </h1>
              <p className="text-warm-charcoal/70">By {workshop.artisanName}</p>
            </div>

            {/* Rating */}
            {workshop.rating && (
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.floor(workshop.rating!)
                          ? 'text-xl text-yellow-400'
                          : 'text-warm-charcoal/20 text-xl'
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-warm-charcoal/60">{workshop.reviewCount} reviews</span>
              </div>
            )}

            {/* Details Grid */}
            <div className="bg-warm-sand/50 grid grid-cols-2 gap-4 rounded-lg p-4">
              <div>
                <p className="text-warm-charcoal/60 mb-1 text-sm">Duration</p>
                <p className="text-warm-charcoal flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4" />
                  {workshop.duration} hours
                </p>
              </div>
              <div>
                <p className="text-warm-charcoal/60 mb-1 text-sm">Group Size</p>
                <p className="text-warm-charcoal flex items-center gap-2 font-semibold">
                  <Users className="h-4 w-4" />
                  Max {workshop.maxParticipants}
                </p>
              </div>
              <div>
                <p className="text-warm-charcoal/60 mb-1 text-sm">Location</p>
                <p className="text-warm-charcoal flex items-center gap-2 font-semibold">
                  <MapPin className="h-4 w-4" />
                  {workshop.location.city}
                </p>
              </div>
              <div>
                <p className="text-warm-charcoal/60 mb-1 text-sm">Language</p>
                <p className="text-warm-charcoal font-semibold">{workshop.language.join(', ')}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-warm-charcoal/70 leading-relaxed">{workshop.description}</p>

            {/* Action Buttons */}
            <div className="border-border space-y-3 border-t pt-6">
              <div className="text-primary text-3xl font-bold">
                ₹{workshop.price.amount.toLocaleString()}
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="text-warm-charcoal font-semibold">Participants:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border-border rounded-lg border px-4 py-2"
                >
                  {Array.from({ length: workshop.maxParticipants }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="bg-primary hover:bg-warm-rust flex w-full items-center justify-center gap-2 rounded-lg py-4 font-semibold text-white transition"
              >
                <Calendar className="h-5 w-5" />
                {showCalendar ? 'Hide Calendar' : 'View Available Dates'}
              </button>

              <button
                onClick={handleBooking}
                disabled={!selectedSchedule || bookingInProgress}
                className="bg-secondary hover:bg-secondary/90 disabled:bg-warm-charcoal/30 w-full rounded-lg py-4 font-semibold text-white transition disabled:cursor-not-allowed"
              >
                {bookingInProgress ? 'Processing...' : 'Book This Workshop'}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="border-primary text-primary hover:bg-primary flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-3 font-semibold transition hover:text-white"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Saved' : 'Save'}
                </button>
                <button className="border-border text-warm-charcoal hover:bg-warm-sand flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-3 font-semibold transition">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        {showCalendar && schedules.length > 0 && (
          <div className="mb-12">
            <WorkshopCalendar
              sessions={schedules.map((s) => ({
                id: s.id,
                workshopId: workshop.id,
                date: s.date,
                startTime: s.startTime,
                endTime: s.endTime,
                availableSpots: s.availableSpots,
                totalSpots: s.availableSpots + s.bookedSpots,
                price: workshop.price.amount,
                status: s.status,
              }))}
              onBookSession={(sessionId) => setSelectedSchedule(sessionId)}
              workshopTitle={workshop.title}
            />
          </div>
        )}

        {/* Virtual Tour */}
        {workshop.virtualTourUrl && (
          <div className="mb-12">
            <button
              onClick={() => setShowVirtualTour(!showVirtualTour)}
              className="bg-secondary hover:bg-secondary/90 mb-4 rounded-lg px-6 py-3 font-semibold text-white transition"
            >
              {showVirtualTour ? 'Hide Virtual Tour' : 'View Virtual Tour'}
            </button>
            
            {showVirtualTour && (
              <VirtualTour
                title={workshop.title}
                location={`${workshop.location.city}, ${workshop.location.state}`}
                stops={[
                  {
                    id: '1',
                    title: 'Workshop Entrance',
                    description: 'Welcome to our traditional workshop space',
                    image: workshop.images[0] || '/placeholder.svg',
                    hotspots: [
                      {
                        x: 30,
                        y: 40,
                        label: 'Main Work Area',
                        info: 'This is where the magic happens',
                      },
                    ],
                  },
                  {
                    id: '2',
                    title: 'Crafting Area',
                    description: 'Where artisans create their masterpieces',
                    image: workshop.images[1] || '/placeholder.svg',
                  },
                  {
                    id: '3',
                    title: 'Display Gallery',
                    description: 'Finished works and inspiration',
                    image: workshop.images[2] || '/placeholder.svg',
                  },
                ]}
              />
            )}
          </div>
        )}

        {/* Learning Outcomes */}
        <div className="mb-12 grid gap-12 md:grid-cols-2">
          {/* What You'll Learn */}
          <div className="card-light">
            <h2 className="text-warm-charcoal mb-6 font-serif text-2xl font-bold">
              What You'll Learn
            </h2>
            <div className="space-y-3">
              {workshop.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span className="text-warm-charcoal/70">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="card-light">
            <h2 className="text-warm-charcoal mb-6 font-serif text-2xl font-bold">
              What's Included
            </h2>
            <div className="mb-8 space-y-3">
              {workshop.price.includes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span className="text-warm-charcoal/70">{item}</span>
                </div>
              ))}
            </div>

            {workshop.requirements && workshop.requirements.length > 0 && (
              <div className="border-border border-t pt-6">
                <h3 className="text-warm-charcoal mb-3 font-bold">What to Bring</h3>
                <ul className="text-warm-charcoal/70 space-y-2 text-sm">
                  {workshop.requirements.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="card-light mb-12">
          <h2 className="text-warm-charcoal mb-6 font-serif text-2xl font-bold">Features</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {workshop.features.certificateProvided && (
              <div className="bg-primary/5 rounded-lg p-4">
                <p className="text-warm-charcoal font-semibold">Certificate Provided</p>
              </div>
            )}
            {workshop.features.takeHomeProduct && (
              <div className="bg-primary/5 rounded-lg p-4">
                <p className="text-warm-charcoal font-semibold">Take Home Your Creation</p>
              </div>
            )}
            {workshop.features.refreshmentsIncluded && (
              <div className="bg-primary/5 rounded-lg p-4">
                <p className="text-warm-charcoal font-semibold">Refreshments Included</p>
              </div>
            )}
            {workshop.features.virtualOption && (
              <div className="bg-primary/5 rounded-lg p-4">
                <p className="text-warm-charcoal font-semibold">Virtual Option Available</p>
              </div>
            )}
            {workshop.features.transportationIncluded && (
              <div className="bg-primary/5 rounded-lg p-4">
                <p className="text-warm-charcoal font-semibold">Transportation Included</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
