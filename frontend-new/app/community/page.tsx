'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MessageCircle,
  ThumbsUp,
  Eye,
  Pin,
  Lock,
  Trash2,
  Flag,
  Search,
  Plus,
  TrendingUp,
  Clock,
  Award,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  communityForumSystem,
  ForumCategory,
  ForumTopic,
  ForumPost,
} from '@/lib/community-forum-system';

export default function CommunityPage() {
  const [scrolled] = useState(false);
  const { role, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  
  // Mock user data - in production this would come from auth context
  const user = isAuthenticated ? {
    id: 'user-1',
    name: role === 'artisan' ? 'Artisan User' : 'Customer User',
    avatar: '/placeholder.svg',
  } : null;

  // New topic form
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicTags, setNewTopicTags] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Reply form
  const [replyContent, setReplyContent] = useState('');
  const [replyToId, setReplyToId] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadCategories();
    loadTopics();
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    if (selectedTopic) {
      loadPosts(selectedTopic.id);
    }
  }, [selectedTopic]);

  const loadCategories = async () => {
    const cats = await communityForumSystem.getCategories();
    setCategories(cats);
  };

  const loadTopics = async () => {
    if (selectedCategory === 'all') {
      // Load all topics from all categories
      const allTopics: ForumTopic[] = [];
      for (const cat of categories) {
        const catTopics = await communityForumSystem.getTopicsByCategory(cat.id, {
          sortBy,
          limit: 50,
        });
        allTopics.push(...catTopics);
      }
      setTopics(allTopics);
    } else {
      const catTopics = await communityForumSystem.getTopicsByCategory(selectedCategory, {
        sortBy,
        limit: 50,
      });
      setTopics(catTopics);
    }
  };

  const loadPosts = async (topicId: string) => {
    const topicPosts = await communityForumSystem.getPostsByTopic(topicId);
    setPosts(topicPosts);
  };

  const handleCreateTopic = async () => {
    if (!user || !newTopicTitle || !newTopicContent || !newTopicCategory) {
      return;
    }

    try {
      await communityForumSystem.createTopic({
        categoryId: newTopicCategory,
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: role === 'artisan' ? 'artisan' : 'user',
          reputation: 0,
        },
        title: newTopicTitle,
        content: newTopicContent,
        tags: newTopicTags.split(',').map((t) => t.trim()).filter(Boolean),
      });

      setNewTopicTitle('');
      setNewTopicContent('');
      setNewTopicTags('');
      setNewTopicCategory('');
      setIsCreateDialogOpen(false);
      loadTopics();
    } catch (error) {
      console.error('Failed to create topic:', error);
    }
  };

  const handleCreateReply = async () => {
    if (!user || !selectedTopic || !replyContent) {
      return;
    }

    try {
      await communityForumSystem.createPost({
        topicId: selectedTopic.id,
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: role === 'artisan' ? 'artisan' : 'user',
          reputation: 0,
        },
        content: replyContent,
        replyToId,
      });

      setReplyContent('');
      setReplyToId(undefined);
      loadPosts(selectedTopic.id);
      loadTopics(); // Refresh to update reply counts
    } catch (error) {
      console.error('Failed to create reply:', error);
    }
  };

  const handleUpvoteTopic = async (topicId: string) => {
    if (!user) return;
    await communityForumSystem.upvote({ type: 'topic', id: topicId, userId: user.id });
    loadTopics();
  };

  const handleUpvotePost = async (postId: string) => {
    if (!user) return;
    await communityForumSystem.upvote({ type: 'post', id: postId, userId: user.id });
    if (selectedTopic) {
      loadPosts(selectedTopic.id);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTopics();
      return;
    }

    const results = await communityForumSystem.search(searchQuery, {
      categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
    });

    const topicResults = results.filter((r) => r.type === 'topic');
    const topicIds = topicResults.map((r) => r.id);

    // Filter topics to show only search results
    const filteredTopics = topics.filter((t) => topicIds.includes(t.id));
    setTopics(filteredTopics);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'moderator':
        return 'bg-purple-500';
      case 'artisan':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (selectedTopic) {
    // Topic detail view
    return (
      <main className="bg-warm-cream min-h-screen">
        <Navigation scrolled={scrolled} />

        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedTopic(null)}
            className="mb-6"
          >
            ← Back to Topics
          </Button>

          {/* Topic Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedTopic.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                    {selectedTopic.status === 'locked' && <Lock className="h-4 w-4 text-gray-500" />}
                    <CardTitle className="text-2xl">{selectedTopic.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <img
                        src={selectedTopic.author.avatar || '/placeholder.svg'}
                        alt={selectedTopic.author.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="font-medium">{selectedTopic.author.name}</span>
                      <Badge className={getRoleBadgeColor(selectedTopic.author.role)}>
                        {selectedTopic.author.role}
                      </Badge>
                    </div>
                    <span>•</span>
                    <span>{formatTimeAgo(selectedTopic.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpvoteTopic(selectedTopic.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {selectedTopic.upvotes}
                  </Button>
                  {(isAuthenticated || user?.id === selectedTopic.author.id) && (
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-4">
                <p className="whitespace-pre-wrap">{selectedTopic.content}</p>
              </div>
              <div className="flex gap-2">
                {selectedTopic.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {selectedTopic.views} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {selectedTopic.replies} replies
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="space-y-4 mb-6">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={post.author.avatar || '/placeholder.svg'}
                        alt={post.author.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpvotePost(post.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="ml-1">{post.upvotes}</span>
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{post.author.name}</span>
                        <Badge className={getRoleBadgeColor(post.author.role)}>
                          {post.author.role}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {formatTimeAgo(post.createdAt)}
                        </span>
                        {post.isAcceptedAnswer && (
                          <Badge className="bg-green-500">
                            <Award className="h-3 w-3 mr-1" />
                            Accepted Answer
                          </Badge>
                        )}
                      </div>
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap">{post.content}</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyToId(post.id)}
                        >
                          Reply
                        </Button>
                        {(isAuthenticated || user?.id === post.author.id) && (
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reply Form */}
          {user && selectedTopic.status !== 'locked' && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {replyToId ? 'Reply to Comment' : 'Add Your Reply'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                  className="mb-4"
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateReply}>Post Reply</Button>
                  {replyToId && (
                    <Button variant="outline" onClick={() => setReplyToId(undefined)}>
                      Cancel Reply
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Footer />
      </main>
    );
  }

  // Topic list view
  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-warm-charcoal mb-4 font-serif text-5xl font-bold sm:text-6xl">
            Community Forum
          </h1>
          <p className="text-warm-charcoal/60 text-lg">
            Connect with artisans, share knowledge, and discuss traditional crafts
          </p>
        </div>

        {/* Search and Create */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {user && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Topic
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Topic</DialogTitle>
                  <DialogDescription>
                    Start a new discussion in the community forum
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={newTopicCategory}
                      onChange={(e) => setNewTopicCategory(e.target.value)}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      placeholder="Enter topic title..."
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Content</label>
                    <Textarea
                      placeholder="Describe your topic..."
                      value={newTopicContent}
                      onChange={(e) => setNewTopicContent(e.target.value)}
                      rows={6}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Tags (comma-separated)
                    </label>
                    <Input
                      placeholder="e.g., pottery, techniques, beginner"
                      value={newTopicTags}
                      onChange={(e) => setNewTopicTags(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateTopic}>Create Topic</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory('all')}
                >
                  All Topics
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort Tabs */}
            <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)} className="mb-6">
              <TabsList>
                <TabsTrigger value="recent">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="popular">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Popular
                </TabsTrigger>
                <TabsTrigger value="trending">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Topics List */}
            <div className="space-y-4">
              {topics.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    No topics found. Be the first to start a discussion!
                  </CardContent>
                </Card>
              ) : (
                topics.map((topic) => (
                  <Card
                    key={topic.id}
                    className="cursor-pointer hover:shadow-md transition"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpvoteTopic(topic.id);
                            }}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium">{topic.upvotes}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {topic.isPinned && (
                                  <Pin className="h-4 w-4 text-yellow-500" />
                                )}
                                {topic.status === 'locked' && (
                                  <Lock className="h-4 w-4 text-gray-500" />
                                )}
                                <h3 className="text-lg font-semibold">{topic.title}</h3>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {topic.content}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <img
                                  src={topic.author.avatar || '/placeholder.svg'}
                                  alt={topic.author.name}
                                  className="h-6 w-6 rounded-full"
                                />
                                <span>{topic.author.name}</span>
                                <Badge className={getRoleBadgeColor(topic.author.role)}>
                                  {topic.author.role}
                                </Badge>
                                <span>•</span>
                                <span>{formatTimeAgo(topic.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {topic.replies}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {topic.views}
                            </span>
                            <div className="flex gap-1">
                              {topic.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
