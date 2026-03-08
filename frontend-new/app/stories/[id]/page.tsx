'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { useParams } from 'next/navigation';
import { Heart, Share2, Bookmark, Calendar, User, Clock, ArrowRight } from 'lucide-react';

export default function StoryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const story = {
    id: Number.parseInt(id),
    title: "The Weaver's Legacy: 35 Years of Tradition in Jaipur",
    excerpt:
      'Priya Sharma carries forward the ancient art of hand-weaving, transforming threads into stories.',
    author: 'Priya Sharma',
    craft: 'Hand-Weaving',
    location: 'Jaipur, Rajasthan',
    date: 'December 3, 2025',
    readTime: 8,
    likes: 1203,
    image: '/placeholder.svg?key=story-detail',
    content: `
# The Weaver's Legacy: 35 Years of Tradition in Jaipur

In the bustling lanes of Jaipur, where the echo of looms has resonated for centuries, sits Priya Sharma—a master weaver whose hands have never forgotten the language of threads.

## A Journey Begins

At seven years old, Priya didn't choose weaving. Weaving chose her, as it had chosen her grandmother, and her grandmother before that. In the cramped quarters of their family workshop, surrounded by spools of thread and the rhythmic clack of wooden looms, she learned not just a craft, but a philosophy.

"My grandmother used to say," Priya recalls, her eyes distant with memory, "that every knot in the thread carries a story. Every pattern is a conversation between the weaver and the cloth."

## The Art of Natural Dyes

What sets Priya apart in the world of contemporary weaving is her unwavering commitment to natural dyes. While many artisans have shifted to synthetic colors for consistency and cost-effectiveness, Priya has devoted decades to mastering the unpredictable art of natural dyeing.

Her process begins not in the workshop, but in the fields and gardens around Jaipur. Indigo plants carefully cultivated. Turmeric from local farmers. Pomegranate leaves collected during specific seasons. Each ingredient is harvested with intention, processed with precision, and transformed into dyes that seem to hold the very essence of nature.

"Synthetic dyes are predictable," Priya explains while stirring a vat of deep blue indigo. "But natural dyes are alive. They change with the season, with the phase of the moon, with the energy you bring to them. That's what makes them real."

## The Pattern Language

Each saree Priya creates tells a distinct story through its patterns. The borders are not merely decorative—they are historical documents. Some patterns have remained unchanged for 300 years, while others are Priya's contemporary interpretations of ancient designs.

"When I design a new pattern," she says, "I think about the woman who will wear it. What is her story? What does she want to express? I try to weave her essence into the cloth."

## Challenges and Resilience

The journey hasn't been without its hardships. The rise of power looms in the 1990s threatened the entire handweaving industry. Cheaper, faster production methods made traditional weavers seem obsolete.

"There was a time I thought about stopping," Priya admits quietly. "Customers were fewer, profit margins were shrinking. My children asked if they should pursue other careers."

But Priya persisted. She began documenting her techniques, teaching younger artisans, and eventually, connecting with global customers who valued authenticity over price.

## A Living Legacy

Today, at 57, Priya stands at the intersection of tradition and progress. She has trained over 200 younger artisans, many of them women who might have otherwise had limited economic opportunities.

"The true legacy isn't just the sarees I've created," Priya reflects. "It's the knowledge I've passed on. It's the women I've trained. It's the thousands of customers around the world who understand and appreciate what hand-weaving truly means."

Her workshop is now a living museum of textile arts—looms from different eras, dye vats bubbling with color, walls adorned with photographs of satisfied customers from across continents.

## The Future of Handweaving

As technology disrupts every industry, Priya remains optimistic about handweaving's future. "Machines can replicate patterns," she says. "But they cannot replicate the human touch, the soul, the intention. That's what makes handmade textiles invaluable."

Her message to the younger generation is clear: "Don't see handweaving as a relic of the past. See it as a bridge between where we came from and where we're going. Every time someone chooses a handwoven saree over a machine-made one, they're choosing authenticity, sustainability, and human connection."

---

*Priya Sharma's work can be found on the Artisans of India platform, where each saree comes with a certificate of authenticity and the complete story of its creation.*
    `,
    relatedStories: [
      { id: 2, title: "Blue Pottery: Khurja's Art of Resilience", author: 'Rajesh Kumar' },
      { id: 5, title: 'Madhubani: Where Ancient Lines Paint Modern Dreams', author: 'Anita Singh' },
    ],
  };

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={false} />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
            {story.craft}
          </p>
          <h1 className="text-warm-charcoal text-balance-heading mb-4 font-serif text-5xl font-bold sm:text-6xl">
            {story.title}
          </h1>

          {/* Meta */}
          <div className="text-warm-charcoal/60 border-border mb-8 flex flex-wrap gap-6 border-b pb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{story.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{story.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{story.readTime} min read</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-8 flex gap-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="border-border hover:bg-warm-sand flex items-center gap-2 rounded-lg border px-4 py-2 transition"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : ''}`} />
              <span className="text-sm">{story.likes}</span>
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition ${
                isBookmarked ? 'border-primary bg-primary/10' : 'border-border hover:bg-warm-sand'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
              <span className="text-sm">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
            <button className="border-border hover:bg-warm-sand flex items-center gap-2 rounded-lg border px-4 py-2 transition">
              <Share2 className="h-5 w-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-warm-sand mb-12 h-96 w-full overflow-hidden rounded-2xl">
          <img
            src={story.image || '/placeholder.svg'}
            alt={story.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg mb-16 max-w-none">
          <div className="text-warm-charcoal/80 leading-relaxed whitespace-pre-line">
            {story.content}
          </div>
        </div>

        {/* Author Card */}
        <div className="card-light mb-16">
          <div className="flex items-start gap-4">
            <img
              src="/placeholder.svg?key=author-avatar"
              alt={story.author}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-warm-charcoal font-serif text-xl font-bold">{story.author}</h3>
              <p className="text-warm-charcoal/60 mb-3">
                {story.craft} Artisan from {story.location}
              </p>
              <p className="text-warm-charcoal/70 mb-4">
                Master craftsperson with decades of experience in preserving traditional techniques
                while connecting with global audiences.
              </p>
              <button className="text-primary hover:text-warm-rust font-semibold transition">
                View Full Profile
              </button>
            </div>
          </div>
        </div>

        {/* Related Stories */}
        {story.relatedStories.length > 0 && (
          <div>
            <h2 className="text-warm-charcoal mb-8 font-serif text-3xl font-bold">
              Related Stories
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {story.relatedStories.map((related) => (
                <div key={related.id} className="card-light transition hover:shadow-lg">
                  <h3 className="text-warm-charcoal mb-2 font-serif text-lg font-bold">
                    {related.title}
                  </h3>
                  <p className="text-warm-charcoal/60 mb-4 text-sm">By {related.author}</p>
                  <button className="text-primary flex items-center gap-2 font-semibold transition hover:gap-3">
                    Read Story
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </main>
  );
}
