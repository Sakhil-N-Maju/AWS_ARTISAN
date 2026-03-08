'use client';

import Link from 'next/link';
import { Heart, Share2, Calendar, User, BookmarkPlus } from 'lucide-react';
import { useState } from 'react';

interface Story {
  id: number;
  title: string;
  excerpt: string;
  artisan: string;
  craft: string;
  image: string;
  readTime: number;
  date: string;
  aiGenerated: boolean;
  likes: number;
  bookmarks: number;
}

const stories: Story[] = [
  {
    id: 1,
    title: "The Weaver's Legacy: 35 Years of Tradition in Jaipur",
    excerpt:
      'Priya Sharma carries forward the ancient art of hand-weaving, transforming threads into stories. Her journey spans three decades of dedication, natural dyes, and sacred patterns.',
    artisan: 'Priya Sharma',
    craft: 'Hand-Weaving',
    image: '/placeholder.svg?key=story1',
    readTime: 8,
    date: '2025-12-03',
    aiGenerated: true,
    likes: 1203,
    bookmarks: 342,
  },
  {
    id: 2,
    title: "Blue Pottery: Khurja's Art of Resilience",
    excerpt:
      'In the heart of Khurja, Rajesh Kumar preserves the 600-year-old tradition of blue pottery. Each piece is a meditation in clay, colors, and time-honored techniques.',
    artisan: 'Rajesh Kumar',
    craft: 'Pottery',
    image: '/placeholder.svg?key=story2',
    readTime: 7,
    date: '2025-12-02',
    aiGenerated: true,
    likes: 856,
    bookmarks: 267,
  },
  {
    id: 3,
    title: 'Kundan Jewelry: Where Light Meets Craft',
    excerpt:
      "Meera Patel's hands sparkle with the touch of centuries. Kundan and Meenakari jewelry aren't just adornments; they are wearable poetry and cultural pride.",
    artisan: 'Meera Patel',
    craft: 'Jewelry',
    image: '/placeholder.svg?key=story3',
    readTime: 6,
    date: '2025-12-01',
    aiGenerated: true,
    likes: 1567,
    bookmarks: 445,
  },
  {
    id: 4,
    title: 'Carving Souls: The Art of Woodcraft',
    excerpt:
      'Kumar Woodcraft transforms raw timber into expressions of spirituality and creativity. His inlay work speaks of patience, precision, and profound artistic vision.',
    artisan: 'Kumar Woodcraft',
    craft: 'Woodcraft',
    image: '/placeholder.svg?key=story4',
    readTime: 9,
    date: '2025-11-30',
    aiGenerated: true,
    likes: 723,
    bookmarks: 198,
  },
  {
    id: 5,
    title: 'Madhubani: Where Ancient Lines Paint Modern Dreams',
    excerpt:
      "Anita Singh breathes life into sacred patterns from Bihar's villages. Madhubani art is more than visual; it's a language of feminine power and ancestral wisdom.",
    artisan: 'Anita Singh',
    craft: 'Painting',
    image: '/placeholder.svg?key=story5',
    readTime: 8,
    date: '2025-11-29',
    aiGenerated: true,
    likes: 1034,
    bookmarks: 312,
  },
  {
    id: 6,
    title: 'Moradabad Brass: The Sound of Tradition',
    excerpt:
      "In the workshops of Moradabad, ancient metalworking techniques create functional art. Mohan Lal's brass pieces echo stories of generations and cultural continuity.",
    artisan: 'Mohan Lal',
    craft: 'Metalwork',
    image: '/placeholder.svg?key=story6',
    readTime: 7,
    date: '2025-11-28',
    aiGenerated: true,
    likes: 645,
    bookmarks: 156,
  },
];

interface StoryGridProps {
  searchQuery: string;
}

export function StoryGrid({ searchQuery }: StoryGridProps) {
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [liked, setLiked] = useState<number[]>([]);

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.craft.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleLike = (id: number) => {
    setLiked((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {filteredStories.map((story) => (
        <article
          key={story.id}
          className="card-light flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl"
        >
          {/* Image */}
          <div className="bg-warm-sand relative mb-4 h-48 overflow-hidden rounded-lg">
            <img
              src={story.image || '/placeholder.svg'}
              alt={story.title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            />
            {story.aiGenerated && (
              <div className="bg-primary absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold text-white">
                AI Story
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-secondary text-xs font-semibold tracking-wide uppercase">
                {story.craft}
              </p>
              <Link href={`/stories/${story.id}`}>
                <h3 className="text-warm-charcoal hover:text-primary line-clamp-2 font-serif text-lg font-bold transition">
                  {story.title}
                </h3>
              </Link>
            </div>

            <p className="text-warm-charcoal/70 line-clamp-2 text-sm">{story.excerpt}</p>

            {/* Meta */}
            <div className="text-warm-charcoal/60 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{story.artisan}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{story.readTime} min read</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-border space-y-4 border-t pt-4">
            <Link
              href={`/stories/${story.id}`}
              className="text-primary hover:text-warm-rust block py-2 text-center font-semibold transition"
            >
              Read Story
            </Link>

            <div className="flex justify-between">
              <button
                onClick={() => toggleLike(story.id)}
                className="text-warm-charcoal/60 hover:text-primary flex items-center gap-2 transition"
              >
                <Heart
                  className={`h-4 w-4 ${liked.includes(story.id) ? 'fill-primary text-primary' : ''}`}
                />
                <span className="text-xs">{story.likes}</span>
              </button>
              <button
                onClick={() => toggleBookmark(story.id)}
                className="text-warm-charcoal/60 hover:text-primary flex items-center gap-2 transition"
              >
                <BookmarkPlus
                  className={`h-4 w-4 ${bookmarked.includes(story.id) ? 'fill-primary text-primary' : ''}`}
                />
                <span className="text-xs">{bookmarked.includes(story.id) ? 'Saved' : 'Save'}</span>
              </button>
              <button className="text-warm-charcoal/60 hover:text-primary flex items-center gap-2 transition">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
