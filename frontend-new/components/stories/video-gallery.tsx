'use client';

import { Play, Eye } from 'lucide-react';
import { useState } from 'react';

interface Video {
  id: number;
  title: string;
  description: string;
  artisan: string;
  craft: string;
  thumbnail: string;
  duration: string;
  views: number;
  date: string;
}

const videos: Video[] = [
  {
    id: 1,
    title: 'The Art of Hand-Weaving: A Complete Process',
    description:
      'Follow Priya Sharma through a complete day of hand-weaving, from selecting threads to final touches.',
    artisan: 'Priya Sharma',
    craft: 'Weaving',
    thumbnail: '/placeholder.svg?key=video1',
    duration: '12:45',
    views: 24500,
    date: '2 weeks ago',
  },
  {
    id: 2,
    title: 'Natural Dye Workshop with Priya Sharma',
    description:
      'Learn how natural indigo, turmeric, and other plants are transformed into vibrant dyes.',
    artisan: 'Priya Sharma',
    craft: 'Weaving',
    thumbnail: '/placeholder.svg?key=video2',
    duration: '18:30',
    views: 15800,
    date: '3 weeks ago',
  },
  {
    id: 3,
    title: 'Blue Pottery Creation: From Clay to Masterpiece',
    description:
      'Watch Rajesh Kumar create a stunning blue pottery piece using traditional Khurja techniques.',
    artisan: 'Rajesh Kumar',
    craft: 'Pottery',
    thumbnail: '/placeholder.svg?key=video3',
    duration: '14:20',
    views: 31200,
    date: '1 month ago',
  },
  {
    id: 4,
    title: 'Kundan Jewelry Making: Secrets Revealed',
    description:
      'Meera Patel unveils the intricate process of creating Kundan jewelry, piece by piece.',
    artisan: 'Meera Patel',
    craft: 'Jewelry',
    thumbnail: '/placeholder.svg?key=video4',
    duration: '16:15',
    views: 42100,
    date: '1 month ago',
  },
  {
    id: 5,
    title: 'Carving the Future: Woodcraft Mastery',
    description:
      'Kumar Woodcraft demonstrates advanced inlay techniques on a decorative wooden panel.',
    artisan: 'Kumar Woodcraft',
    craft: 'Woodcraft',
    thumbnail: '/placeholder.svg?key=video5',
    duration: '20:00',
    views: 12400,
    date: '6 weeks ago',
  },
  {
    id: 6,
    title: 'Madhubani Painting: Living Heritage',
    description:
      'Anita Singh paints a traditional Madhubani artwork while sharing cultural significance.',
    artisan: 'Anita Singh',
    craft: 'Painting',
    thumbnail: '/placeholder.svg?key=video6',
    duration: '15:45',
    views: 18900,
    date: '2 months ago',
  },
];

interface VideoGalleryProps {
  searchQuery: string;
}

export function VideoGallery({ searchQuery }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.craft.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {selectedVideo ? (
        <div className="mb-8">
          <button
            onClick={() => setSelectedVideo(null)}
            className="text-primary hover:text-warm-rust mb-6 px-4 py-2 font-semibold transition"
          >
            ← Back to Gallery
          </button>

          <div className="card-light space-y-6">
            <div className="bg-warm-charcoal aspect-video overflow-hidden rounded-lg">
              <img
                src={selectedVideo.thumbnail || '/placeholder.svg'}
                alt={selectedVideo.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-warm-charcoal mb-2 font-serif text-3xl font-bold">
                {selectedVideo.title}
              </h2>
              <div className="text-warm-charcoal/60 mb-4 flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{selectedVideo.views.toLocaleString()} views</span>
                </div>
                <span>{selectedVideo.date}</span>
              </div>
              <p className="text-warm-charcoal/70 leading-relaxed">{selectedVideo.description}</p>
            </div>

            <div className="border-border border-t pt-4">
              <p className="text-warm-charcoal mb-2 font-semibold">By {selectedVideo.artisan}</p>
              <p className="text-warm-charcoal/60 text-sm">{selectedVideo.craft}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="card-light group overflow-hidden text-left transition-all duration-300 hover:shadow-2xl"
            >
              <div className="bg-warm-sand relative mb-4 h-48 overflow-hidden rounded-lg">
                <img
                  src={video.thumbnail || '/placeholder.svg'}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="bg-warm-charcoal/40 group-hover:bg-warm-charcoal/20 absolute inset-0 flex items-center justify-center transition">
                  <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-full transition group-hover:scale-110">
                    <Play className="h-6 w-6 fill-white text-white" />
                  </div>
                </div>
                <div className="bg-warm-charcoal/80 absolute right-2 bottom-2 rounded px-2 py-1 text-xs font-semibold text-white">
                  {video.duration}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-warm-charcoal group-hover:text-primary line-clamp-2 font-serif text-lg font-bold transition">
                  {video.title}
                </h3>

                <p className="text-warm-charcoal/60 line-clamp-1 text-sm">{video.artisan}</p>

                <div className="text-warm-charcoal/60 flex items-center justify-between text-xs">
                  <span>{video.views.toLocaleString()} views</span>
                  <span>{video.date}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
