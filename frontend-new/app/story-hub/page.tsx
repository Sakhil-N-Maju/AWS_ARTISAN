'use client';

import { useState, useRef } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Mic,
  MicOff,
  Upload,
  Image as ImageIcon,
  Video,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Pause,
  BookOpen,
  MapPin,
  Calendar,
  Eye,
  Filter,
  Search,
  CheckCircle2,
  Loader2,
  X,
  Plus,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Story {
  id: string;
  artisan: {
    name: string;
    avatar: string;
    craft: string;
    location: string;
  };
  title: string;
  content: string;
  media: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  voiceRecording?: {
    duration: number;
    url: string;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  tags: string[];
  publishedAt: string;
  featured: boolean;
}

export default function StoryHub() {
  const [scrolled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [transcribedText, setTranscribedText] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample stories data
  const stories: Story[] = [
    {
      id: '1',
      artisan: {
        name: 'Rajesh Kumar',
        avatar: '/potter-making-clay-pots.jpg',
        craft: 'Blue Pottery',
        location: 'Jaipur, Rajasthan',
      },
      title: 'Three Generations of Blue Pottery Legacy',
      content:
        "My grandfather started this craft in 1945, and today I continue the tradition with pride. Blue pottery is not just a craft; it's our family's heartbeat. Every piece tells a story of dedication, patience, and artistic vision passed down through generations. The unique blue dye comes from a special mixture that my grandfather perfected over decades.",
      media: [
        { type: 'image', url: '/blue-pottery-bowl.jpg' },
        { type: 'image', url: '/traditional-indian-pottery-ceramic.jpg' },
      ],
      voiceRecording: {
        duration: 245,
        url: '/audio/story1.mp3',
      },
      stats: {
        views: 12500,
        likes: 890,
        comments: 156,
      },
      tags: ['pottery', 'heritage', 'family-tradition', 'jaipur'],
      publishedAt: '2024-11-15',
      featured: true,
    },
    {
      id: '2',
      artisan: {
        name: 'Meera Devi',
        avatar: '/indian-woman-weaving.jpg',
        craft: 'Handloom Weaving',
        location: 'Varanasi, Uttar Pradesh',
      },
      title: 'Weaving Dreams Into Silk Sarees',
      content:
        'Every thread I weave carries the dreams of my village. Handloom weaving is a meditation for me. It takes 15-20 days to create one Banarasi saree, with intricate patterns that have been perfected over centuries. The sound of the loom is music to my ears, and seeing a bride wear my creation fills my heart with joy.',
      media: [
        { type: 'image', url: '/hand-woven-saree.jpg' },
        { type: 'video', url: '/videos/weaving.mp4', thumbnail: '/indian-woman-weaving.jpg' },
      ],
      voiceRecording: {
        duration: 180,
        url: '/audio/story2.mp3',
      },
      stats: {
        views: 8900,
        likes: 645,
        comments: 89,
      },
      tags: ['weaving', 'silk', 'banarasi', 'sarees'],
      publishedAt: '2024-11-20',
      featured: true,
    },
    {
      id: '3',
      artisan: {
        name: 'Amit Sharma',
        avatar: '/man-operations.jpg',
        craft: 'Wood Carving',
        location: 'Saharanpur, Uttar Pradesh',
      },
      title: 'From Forest to Fine Art: My Wood Carving Journey',
      content:
        'I learned wood carving from my uncle at age 12. Each piece of wood speaks to me, telling me what it wants to become. My specialty is creating intricate floral patterns and religious motifs. The smell of fresh sandalwood as I carve is therapeutic. This craft requires patience - sometimes a single piece takes months to complete.',
      media: [
        { type: 'image', url: '/carved-wood-art.jpg' },
        { type: 'image', url: '/wooden-handicraft-indian-carving.jpg' },
      ],
      stats: {
        views: 6700,
        likes: 423,
        comments: 67,
      },
      tags: ['woodwork', 'carving', 'handmade', 'saharanpur'],
      publishedAt: '2024-11-25',
      featured: false,
    },
    {
      id: '4',
      artisan: {
        name: 'Lakshmi Bai',
        avatar: '/woman-creative.jpg',
        craft: 'Temple Jewelry Making',
        location: 'Chennai, Tamil Nadu',
      },
      title: 'Crafting Divine Beauty: Temple Jewelry Art',
      content:
        "Temple jewelry is not just ornamental; it's spiritual. Each piece is designed to adorn deities and brides with divine elegance. I use traditional techniques passed down through 8 generations. The intricate designs require precision and devotion. Working with gold and precious stones, I create pieces that become family heirlooms.",
      media: [
        { type: 'image', url: '/traditional-jewelry.png' },
        { type: 'image', url: '/kundan-necklace.jpg' },
      ],
      stats: {
        views: 9200,
        likes: 712,
        comments: 134,
      },
      tags: ['jewelry', 'gold', 'temple-art', 'chennai'],
      publishedAt: '2024-11-28',
      featured: false,
    },
    {
      id: '5',
      artisan: {
        name: 'Hassan Khan',
        avatar: '/man-professional.jpg',
        craft: 'Brass Metalwork',
        location: 'Moradabad, Uttar Pradesh',
      },
      title: 'The Golden Touch of Moradabad Brass',
      content:
        "Moradabad is known as the Brass City, and I'm proud to be part of this legacy. I create everything from intricate lamps to decorative pieces. The process involves heating, hammering, and etching - all done by hand. Each strike of the hammer is calculated, each curve intentional. Modern machines can't replicate the soul in handcrafted brass.",
      media: [
        { type: 'image', url: '/brass-lamp.jpg' },
        { type: 'image', url: '/brass-copper-metalwork.jpg' },
      ],
      voiceRecording: {
        duration: 195,
        url: '/audio/story5.mp3',
      },
      stats: {
        views: 5600,
        likes: 389,
        comments: 52,
      },
      tags: ['metalwork', 'brass', 'moradabad', 'lamps'],
      publishedAt: '2024-12-01',
      featured: false,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Stories', count: stories.length },
    { id: 'pottery', label: 'Pottery', count: 1 },
    { id: 'textiles', label: 'Textiles', count: 1 },
    { id: 'woodwork', label: 'Woodwork', count: 1 },
    { id: 'jewelry', label: 'Jewelry', count: 1 },
    { id: 'metalwork', label: 'Metalwork', count: 1 },
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    // Store interval ID to clear later
    (window as any).recordingInterval = interval;
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    clearInterval((window as any).recordingInterval);

    // Simulate AI transcription
    setIsProcessing(true);
    setProcessingProgress(0);

    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsProcessing(false);
          setTranscribedText(
            'This is a sample transcription of your voice recording. In a real implementation, this would use speech-to-text AI to convert your voice into text. You can edit this text before publishing your story.'
          );
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Simulate AI optimization
      setIsProcessing(true);
      setProcessingProgress(0);

      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsProcessing(false);
            return 100;
          }
          return prev + 15;
        });
      }, 400);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredStories = stories.filter((story) => {
    const matchesCategory = selectedCategory === 'all' || story.tags.includes(selectedCategory);
    const matchesSearch =
      searchQuery === '' ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.artisan.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      {/* Header */}
      <div className="from-warm-terracotta to-warm-rust bg-gradient-to-r py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-black" />
            <h1 className="font-serif text-4xl font-bold text-black sm:text-5xl">Story Hub</h1>
          </div>
          <p className="max-w-3xl text-lg text-white/90">
            Share your craft journey with voice, images, and videos. Every artisan has a unique
            story - let AI help you tell it beautifully.
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="text-primary mt-6 bg-white hover:bg-white/90">
                <Plus className="mr-2 h-5 w-5" />
                Share Your Story
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Create Your Story</DialogTitle>
                <DialogDescription>
                  Use voice recording, add images/videos, and let AI optimize your story for maximum
                  impact
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-6">
                {/* Story Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">Story Title</label>
                  <Input
                    placeholder="e.g., My Journey in Traditional Pottery"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Voice Recording Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      Voice Recording
                    </CardTitle>
                    <CardDescription>
                      Record your story using your voice - AI will transcribe it
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-warm-sand flex items-center justify-center rounded-lg p-8">
                      {!isRecording ? (
                        <Button size="lg" onClick={handleStartRecording} className="gap-2">
                          <Mic className="h-5 w-5" />
                          Start Recording
                        </Button>
                      ) : (
                        <div className="space-y-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="h-4 w-4 animate-pulse rounded-full bg-red-500" />
                            <span className="font-mono text-2xl font-bold">
                              {formatDuration(recordingTime)}
                            </span>
                          </div>
                          <Button
                            size="lg"
                            variant="destructive"
                            onClick={handleStopRecording}
                            className="gap-2"
                          >
                            <MicOff className="h-5 w-5" />
                            Stop Recording
                          </Button>
                        </div>
                      )}
                    </div>

                    {transcribedText && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm font-semibold">
                            Voice transcribed successfully!
                          </span>
                        </div>
                        <Textarea
                          value={transcribedText}
                          onChange={(e) => setTranscribedText(e.target.value)}
                          rows={6}
                          placeholder="Your transcribed story will appear here..."
                          className="w-full"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Media Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Add Images & Videos
                    </CardTitle>
                    <CardDescription>
                      Upload media files - AI will optimize them automatically
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                    />

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images or Videos
                    </Button>

                    {uploadedFiles.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="group relative">
                            <div className="bg-warm-sand flex aspect-square items-center justify-center rounded-lg">
                              {file.type.startsWith('image/') ? (
                                <ImageIcon className="text-muted-foreground h-8 w-8" />
                              ) : (
                                <Video className="text-muted-foreground h-8 w-8" />
                              )}
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <p className="mt-1 truncate text-xs">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AI Processing Status */}
                {isProcessing && (
                  <Alert>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold">AI is processing your content...</p>
                        <Progress value={processingProgress} className="w-full" />
                        <p className="text-muted-foreground text-xs">
                          Optimizing images, enhancing audio quality, and preparing your story
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Manual Text Input */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Or Write Your Story Manually
                  </label>
                  <Textarea
                    rows={6}
                    placeholder="Share your craft journey, techniques, inspiration, and what makes your work special..."
                    className="w-full"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">Tags</label>
                  <Input placeholder="e.g., pottery, handmade, traditional" className="w-full" />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button className="flex-1 gap-2" disabled={isProcessing}>
                    <Sparkles className="h-4 w-4" />
                    Publish Story
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                placeholder="Search stories by artisan, craft, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.label}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Stories */}
        {selectedCategory === 'all' && (
          <div className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold">
              <Sparkles className="text-primary h-6 w-6" />
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {stories
                .filter((s) => s.featured)
                .map((story) => (
                  <Card key={story.id} className="overflow-hidden transition hover:shadow-lg">
                    <div className="relative h-64">
                      <img
                        src={story.media[0]?.url}
                        alt={story.title}
                        className="h-full w-full object-cover"
                      />
                      {story.media[0]?.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-16 w-16 text-white" />
                        </div>
                      )}
                      {story.voiceRecording && (
                        <Badge className="absolute top-4 right-4 gap-1">
                          <Mic className="h-3 w-3" />
                          Voice Story
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={story.artisan.avatar} />
                          <AvatarFallback>{story.artisan.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{story.artisan.name}</p>
                          <p className="text-muted-foreground text-sm">{story.artisan.craft}</p>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{story.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{story.content}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-muted-foreground mb-4 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {story.stats.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {story.stats.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {story.stats.comments}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {story.artisan.location.split(',')[0]}
                        </span>
                      </div>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {story.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full">Read Full Story</Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Stories Grid */}
        <div>
          <h2 className="mb-6 font-serif text-2xl font-bold">
            {selectedCategory === 'all'
              ? 'All Stories'
              : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Stories`}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <Card key={story.id} className="overflow-hidden transition hover:shadow-lg">
                <div className="relative h-48">
                  <img
                    src={story.media[0]?.url}
                    alt={story.title}
                    className="h-full w-full object-cover"
                  />
                  {story.media[0]?.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  )}
                  {story.voiceRecording && (
                    <Badge className="absolute top-2 right-2 gap-1 text-xs">
                      <Mic className="h-3 w-3" />
                      Voice
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={story.artisan.avatar} />
                      <AvatarFallback>{story.artisan.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{story.artisan.name}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {story.artisan.craft}
                      </p>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">{story.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {story.content}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-muted-foreground mb-3 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {story.stats.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {story.stats.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {story.stats.comments}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="py-12 text-center">
              <BookOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h3 className="mb-2 text-xl font-semibold">No stories found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
