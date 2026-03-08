'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { BookOpen, Video, Sparkles, Search } from 'lucide-react';
import { StoryGrid } from '@/components/stories/story-grid';
import { VideoGallery } from '@/components/stories/video-gallery';
import { BlogSection } from '@/components/stories/blog-section';

type ContentTab = 'stories' | 'videos' | 'blog';

export default function StoriesPage() {
  const [scrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentTab>('stories');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="bg-primary/10 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <Sparkles className="text-primary h-5 w-5" />
            <span className="text-primary text-sm font-semibold">AI-Powered Narratives</span>
          </div>
          <h1 className="text-warm-charcoal mb-4 font-serif text-5xl font-bold sm:text-6xl">
            Stories Behind the Craft
          </h1>
          <p className="text-warm-charcoal/60 mx-auto max-w-2xl text-lg">
            Discover the artisans, their heritage, and the ancient traditions preserved through
            handcrafted excellence. Each story celebrates culture, craftsmanship, and human
            connection.
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative">
            <Search className="text-warm-charcoal/40 absolute top-4 left-4 h-5 w-5" />
            <input
              type="text"
              placeholder="Search stories, artisans, or crafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border focus:ring-primary w-full rounded-lg border-2 py-3 pr-4 pl-12 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-border mb-12 flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 font-semibold transition ${
              activeTab === 'stories'
                ? 'text-primary border-primary'
                : 'text-warm-charcoal/60 hover:text-warm-charcoal border-transparent'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            AI Stories
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 font-semibold transition ${
              activeTab === 'videos'
                ? 'text-primary border-primary'
                : 'text-warm-charcoal/60 hover:text-warm-charcoal border-transparent'
            }`}
          >
            <Video className="h-5 w-5" />
            Video Gallery
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 font-semibold transition ${
              activeTab === 'blog'
                ? 'text-primary border-primary'
                : 'text-warm-charcoal/60 hover:text-warm-charcoal border-transparent'
            }`}
          >
            <span>Blog</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'stories' && <StoryGrid searchQuery={searchQuery} />}
        {activeTab === 'videos' && <VideoGallery searchQuery={searchQuery} />}
        {activeTab === 'blog' && <BlogSection searchQuery={searchQuery} />}
      </div>

      <Footer />
    </main>
  );
}
