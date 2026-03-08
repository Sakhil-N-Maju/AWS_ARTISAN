'use client';

import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The Renaissance of Indian Handcrafts in the Digital Age',
    excerpt:
      'How technology is empowering artisans while preserving ancient traditions. Exploring the intersection of heritage and innovation.',
    author: 'Priya Sharma',
    date: 'Dec 3, 2025',
    category: 'Heritage',
    image: '/placeholder.svg?key=blog1',
    readTime: 10,
  },
  {
    id: 2,
    title: 'Sustainable Craftsmanship: The Environmental Impact',
    excerpt:
      'Understanding how handcrafted products contribute to environmental sustainability and circular economies.',
    author: 'Anita Singh',
    date: 'Dec 1, 2025',
    category: 'Sustainability',
    image: '/placeholder.svg?key=blog2',
    readTime: 8,
  },
  {
    id: 3,
    title: 'Natural Dyes: From Ancient Knowledge to Modern Practice',
    excerpt:
      'Discover the science and artistry behind natural dyes, and why artisans are returning to traditional methods.',
    author: 'Kumar Woodcraft',
    date: 'Nov 29, 2025',
    category: 'Craft Guide',
    image: '/placeholder.svg?key=blog3',
    readTime: 12,
  },
  {
    id: 4,
    title: 'The Economics of Fair Trade in Artisan Communities',
    excerpt:
      'How direct purchasing supports artisans and ensures fair compensation for their skilled labor.',
    author: 'Rajesh Kumar',
    date: 'Nov 27, 2025',
    category: 'Community',
    image: '/placeholder.svg?key=blog4',
    readTime: 9,
  },
  {
    id: 5,
    title: 'Women Artisans Leading the Craft Revolution',
    excerpt:
      'Celebrating the women redefining Indian craftsmanship and empowering future generations.',
    author: 'Meera Patel',
    date: 'Nov 25, 2025',
    category: 'Stories',
    image: '/placeholder.svg?key=blog5',
    readTime: 11,
  },
  {
    id: 6,
    title: 'Global Markets: How Indian Crafts are Winning Worldwide',
    excerpt:
      'Exploring how artisans are reaching international audiences and maintaining cultural authenticity.',
    author: 'Mohan Lal',
    date: 'Nov 23, 2025',
    category: 'Business',
    image: '/placeholder.svg?key=blog6',
    readTime: 8,
  },
];

interface BlogSectionProps {
  searchQuery: string;
}

export function BlogSection({ searchQuery }: BlogSectionProps) {
  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <Link href={`/blog/${filteredPosts[0].id}`}>
          <div className="card-light group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-warm-sand h-64 overflow-hidden rounded-lg">
                <img
                  src={filteredPosts[0].image || '/placeholder.svg'}
                  alt={filteredPosts[0].title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
                    {filteredPosts[0].category}
                  </p>
                  <h3 className="text-warm-charcoal group-hover:text-primary mb-3 font-serif text-3xl font-bold transition">
                    {filteredPosts[0].title}
                  </h3>
                  <p className="text-warm-charcoal/70 text-lg">{filteredPosts[0].excerpt}</p>
                </div>

                <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                  <div className="space-y-1">
                    <div className="text-warm-charcoal/60 flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>{filteredPosts[0].author}</span>
                    </div>
                    <div className="text-warm-charcoal/60 flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{filteredPosts[0].date}</span>
                    </div>
                  </div>
                  <div className="text-primary flex items-center gap-2 font-semibold transition group-hover:gap-3">
                    Read
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Blog Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.slice(1).map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <article className="card-light group flex h-full cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="bg-warm-sand mb-4 h-48 overflow-hidden rounded-lg">
                <img
                  src={post.image || '/placeholder.svg'}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="flex-1 space-y-3">
                <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                  {post.category}
                </p>
                <h3 className="text-warm-charcoal group-hover:text-primary line-clamp-2 font-serif text-lg font-bold transition">
                  {post.title}
                </h3>
                <p className="text-warm-charcoal/70 line-clamp-2 text-sm">{post.excerpt}</p>
              </div>

              <div className="border-border text-warm-charcoal/60 mt-4 space-y-2 border-t pt-3 text-xs">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {post.date} • {post.readTime} min read
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
