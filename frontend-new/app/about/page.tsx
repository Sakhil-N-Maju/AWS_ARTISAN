'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Heart, Users, Globe, Zap, Award, Target } from 'lucide-react';

export default function AboutPage() {
  const [scrolled] = useState(false);

  const values = [
    {
      icon: Heart,
      title: 'Authentic',
      description:
        'Every product is handcrafted by skilled artisans using traditional techniques passed down through generations.',
    },
    {
      icon: Users,
      title: 'Community',
      description:
        'We empower artisans by providing direct market access, fair prices, and recognition for their craft.',
    },
    {
      icon: Globe,
      title: 'Sustainable',
      description:
        'Supporting traditional crafts helps preserve cultural heritage and promotes sustainable, ethical production.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description:
        'We blend traditional craftsmanship with modern technology to create unique, timeless products.',
    },
  ];

  const stats = [
    { number: '2,340+', label: 'Artisans Connected' },
    { number: '45,000+', label: 'Products Available' },
    { number: '185', label: 'Countries Served' },
    { number: '98%', label: 'Customer Satisfaction' },
  ];

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      bio: 'Passionate about preserving Indian heritage crafts and connecting artisans with global markets.',
      image: '/smiling-woman.png',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Head of Artisan Relations',
      bio: 'Works directly with artisan communities to ensure fair practices and sustainable growth.',
      image: '/man-professional.jpg',
    },
    {
      name: 'Amisha Patel',
      role: 'Creative Director',
      bio: 'Curates collections that celebrate the beauty and diversity of Indian craftsmanship.',
      image: '/woman-creative.jpg',
    },
    {
      name: 'Vikram Singh',
      role: 'Operations Lead',
      bio: 'Ensures seamless logistics and delivery of artisan products to customers worldwide.',
      image: '/man-operations.jpg',
    },
  ];

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      {/* Hero Banner */}
      <section className="from-primary/15 to-secondary/15 relative h-96 overflow-hidden bg-gradient-to-br pt-20">
        <div className="absolute inset-0 opacity-40">
          <div className="bg-primary/20 absolute top-0 left-1/3 h-96 w-96 rounded-full blur-3xl" />
          <div className="bg-secondary/20 absolute right-1/4 bottom-0 h-80 w-80 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-warm-charcoal font-serif text-5xl font-bold sm:text-6xl">
              About Artisans of India
            </h1>
            <p className="text-warm-charcoal/70 text-lg">
              A platform dedicated to connecting the world with authentic handcrafted products from
              India's most talented artisans.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Our Story */}
        <section className="mb-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-warm-charcoal mb-6 font-serif text-4xl font-bold">Our Story</h2>
              <div className="text-warm-charcoal/70 space-y-4">
                <p>
                  Founded in 2019, Artisans of India began with a simple mission: to preserve and
                  celebrate the rich cultural heritage of Indian handcrafts while creating
                  sustainable livelihoods for artisans.
                </p>
                <p>
                  What started as a small initiative connecting 50 artisans has grown into a
                  thriving community of over 2,340 skilled craftspeople across 18 states of India,
                  reaching customers in more than 185 countries.
                </p>
                <p>
                  We believe that every handcrafted product tells a story of tradition, skill, and
                  passion. Our platform exists to ensure that artisans receive fair compensation,
                  recognition, and the opportunity to grow their businesses while preserving their
                  craft for future generations.
                </p>
              </div>
            </div>
            <div className="border-border rounded-lg border bg-white p-8 shadow-md">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 flex-shrink-0 rounded-lg p-3">
                    <Target className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-warm-charcoal mb-2 font-semibold">Our Mission</h3>
                    <p className="text-warm-charcoal/60 text-sm">
                      Empower artisans by connecting them with global markets while preserving
                      India's cultural heritage.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 flex-shrink-0 rounded-lg p-3">
                    <Award className="text-secondary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-warm-charcoal mb-2 font-semibold">Our Vision</h3>
                    <p className="text-warm-charcoal/60 text-sm">
                      To create a world where traditional crafts thrive in the modern economy and
                      artisans are valued as cultural ambassadors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20">
          <h2 className="text-warm-charcoal mb-12 text-center font-serif text-4xl font-bold">
            By The Numbers
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="border-border rounded-lg border bg-white p-6 text-center shadow-sm"
              >
                <p className="text-primary mb-2 text-3xl font-bold">{stat.number}</p>
                <p className="text-warm-charcoal/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-20">
          <h2 className="text-warm-charcoal mb-12 text-center font-serif text-4xl font-bold">
            Our Core Values
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div
                  key={idx}
                  className="border-border rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="bg-primary/10 mb-4 w-fit rounded-lg p-3">
                    <Icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-warm-charcoal mb-3 text-lg font-semibold">{value.title}</h3>
                  <p className="text-warm-charcoal/60 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <h2 className="text-warm-charcoal mb-12 text-center font-serif text-4xl font-bold">
            Meet Our Team
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="border-border overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
              >
                <img
                  src={member.image || '/placeholder.svg'}
                  alt={member.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-warm-charcoal mb-1 font-semibold">{member.name}</h3>
                  <p className="text-primary mb-3 text-sm font-medium">{member.role}</p>
                  <p className="text-warm-charcoal/60 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact */}
        <section className="from-primary/10 to-secondary/10 mb-20 rounded-lg bg-gradient-to-br p-12">
          <h2 className="text-warm-charcoal mb-8 text-center font-serif text-3xl font-bold">
            Our Impact
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-warm-charcoal text-lg font-semibold">Artisan Empowerment</h3>
              <p className="text-warm-charcoal/70">
                We've helped artisans increase their income by an average of 45%, provided business
                training to over 500 craftspeople, and created direct market access for traditional
                crafts.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-warm-charcoal text-lg font-semibold">Cultural Preservation</h3>
              <p className="text-warm-charcoal/70">
                By supporting traditional crafts, we're helping preserve dying art forms and
                ensuring that cultural knowledge is passed to the next generation of artisans.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-warm-charcoal text-lg font-semibold">Community Growth</h3>
              <p className="text-warm-charcoal/70">
                Our workshops and apprenticeship programs have trained over 800 individuals,
                creating new opportunities and strengthening artisan communities across India.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-20 space-y-6 text-center">
          <h2 className="text-warm-charcoal font-serif text-3xl font-bold">Join Our Community</h2>
          <p className="text-warm-charcoal/70 mx-auto max-w-2xl text-lg">
            Whether you're a conscious consumer, an aspiring artisan, or a collector of authentic
            crafts, there's a place for you in our community.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="bg-primary hover:bg-primary/90 rounded-lg px-8 py-3 font-semibold text-white transition">
              Start Shopping
            </button>
            <button className="border-primary text-primary hover:bg-primary rounded-lg border-2 px-8 py-3 font-semibold transition hover:text-white">
              Learn to Craft
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
