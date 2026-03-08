import { describe, it, expect, beforeEach } from 'vitest';
import { CommunityForumSystem } from '@/lib/community-forum-system';

describe('Community Forum Integration', () => {
  let forumSystem: CommunityForumSystem;

  beforeEach(() => {
    forumSystem = new CommunityForumSystem();
  });

  describe('Forum Categories', () => {
    it('should load forum categories', async () => {
      const categories = await forumSystem.getCategories();
      
      expect(categories).toBeDefined();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty('id');
      expect(categories[0]).toHaveProperty('name');
      expect(categories[0]).toHaveProperty('description');
    });

    it('should have predefined categories', async () => {
      const categories = await forumSystem.getCategories();
      const categoryNames = categories.map(c => c.name);
      
      expect(categoryNames).toContain('General Discussion');
      expect(categoryNames).toContain('Artisan Stories');
      expect(categoryNames).toContain('Craft Techniques');
      expect(categoryNames).toContain('Q&A');
    });
  });

  describe('Topic Creation', () => {
    it('should create a new topic', async () => {
      const topic = await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'Test Topic',
        content: 'This is a test topic content',
        tags: ['test', 'discussion'],
      });

      expect(topic).toBeDefined();
      expect(topic.title).toBe('Test Topic');
      expect(topic.content).toBe('This is a test topic content');
      expect(topic.tags).toEqual(['test', 'discussion']);
      expect(topic.status).toBe('published');
    });

    it('should throw error for invalid category', async () => {
      await expect(
        forumSystem.createTopic({
          categoryId: 'invalid-category',
          author: {
            id: 'user-1',
            name: 'Test User',
            role: 'user',
            reputation: 0,
          },
          title: 'Test Topic',
          content: 'Content',
          tags: [],
        })
      ).rejects.toThrow('Category not found');
    });
  });

  describe('Reply Functionality', () => {
    it('should create a reply to a topic', async () => {
      // First create a topic
      const topic = await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'Test Topic',
        content: 'Content',
        tags: [],
      });

      // Then create a reply
      const post = await forumSystem.createPost({
        topicId: topic.id,
        author: {
          id: 'user-2',
          name: 'Another User',
          role: 'artisan',
          reputation: 10,
        },
        content: 'This is a reply',
      });

      expect(post).toBeDefined();
      expect(post.content).toBe('This is a reply');
      expect(post.topicId).toBe(topic.id);
      expect(post.status).toBe('published');
    });

    it('should increment topic reply count', async () => {
      const topic = await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'Test Topic',
        content: 'Content',
        tags: [],
      });

      expect(topic.replies).toBe(0);

      await forumSystem.createPost({
        topicId: topic.id,
        author: {
          id: 'user-2',
          name: 'Another User',
          role: 'user',
          reputation: 0,
        },
        content: 'Reply 1',
      });

      const topics = await forumSystem.getTopicsByCategory('cat-general');
      const updatedTopic = topics.find(t => t.id === topic.id);
      
      expect(updatedTopic?.replies).toBe(1);
    });
  });

  describe('Upvoting', () => {
    it('should upvote a topic', async () => {
      const topic = await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'Test Topic',
        content: 'Content',
        tags: [],
      });

      expect(topic.upvotes).toBe(0);

      await forumSystem.upvote({
        type: 'topic',
        id: topic.id,
        userId: 'user-2',
      });

      const topics = await forumSystem.getTopicsByCategory('cat-general');
      const updatedTopic = topics.find(t => t.id === topic.id);
      
      expect(updatedTopic?.upvotes).toBe(1);
    });

    it('should upvote a post', async () => {
      const topic = await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'Test Topic',
        content: 'Content',
        tags: [],
      });

      const post = await forumSystem.createPost({
        topicId: topic.id,
        author: {
          id: 'user-2',
          name: 'Another User',
          role: 'user',
          reputation: 0,
        },
        content: 'Reply',
      });

      expect(post.upvotes).toBe(0);

      await forumSystem.upvote({
        type: 'post',
        id: post.id,
        userId: 'user-3',
      });

      const posts = await forumSystem.getPostsByTopic(topic.id);
      const updatedPost = posts.find(p => p.id === post.id);
      
      expect(updatedPost?.upvotes).toBe(1);
    });
  });

  describe('Search Functionality', () => {
    it('should search topics by query', async () => {
      await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'Pottery Techniques',
        content: 'Discussion about pottery',
        tags: ['pottery'],
      });

      const results = await forumSystem.search('pottery');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].type).toBe('topic');
      expect(results[0].title).toContain('Pottery');
    });

    it('should filter search by category', async () => {
      await forumSystem.createTopic({
        categoryId: 'cat-techniques',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'artisan',
          reputation: 0,
        },
        title: 'Advanced Weaving',
        content: 'Weaving techniques',
        tags: ['weaving'],
      });

      const results = await forumSystem.search('weaving', {
        categoryId: 'cat-techniques',
      });
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].categoryId).toBe('cat-techniques');
    });
  });

  describe('User Profiles and Reputation', () => {
    it('should display user role in forum posts', async () => {
      const topic = await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'artisan-1',
          name: 'Master Artisan',
          role: 'artisan',
          reputation: 100,
        },
        title: 'Artisan Topic',
        content: 'Content from artisan',
        tags: [],
      });

      expect(topic.author.role).toBe('artisan');
      expect(topic.author.reputation).toBe(100);
    });

    it('should award reputation points for upvotes', async () => {
      const topic = await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'Test Topic',
        content: 'Content',
        tags: [],
      });

      await forumSystem.upvote({
        type: 'topic',
        id: topic.id,
        userId: 'user-2',
      });

      const reputation = await forumSystem.getUserReputation('user-1');
      
      expect(reputation).toBeDefined();
      expect(reputation!.points).toBeGreaterThan(0);
    });
  });

  describe('Moderation Tools', () => {
    it('should support topic locking', async () => {
      const topic = await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'Test Topic',
        content: 'Content',
        tags: [],
      });

      // Manually lock the topic (in production this would be done by admin)
      topic.status = 'locked';

      // Attempt to create a post should fail
      await expect(
        forumSystem.createPost({
          topicId: topic.id,
          author: {
            id: 'user-2',
            name: 'Another User',
            role: 'user',
            reputation: 0,
          },
          content: 'Reply',
        })
      ).rejects.toThrow('Topic is locked');
    });

    it('should track report count for moderation', async () => {
      const topic = await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'Test Topic',
        content: 'Content',
        tags: [],
      });

      expect(topic.reportCount).toBe(0);
    });
  });

  describe('Topic Listing', () => {
    it('should list topics by category', async () => {
      await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'Topic 1',
        content: 'Content 1',
        tags: [],
      });

      const topics = await forumSystem.getTopicsByCategory('cat-general');
      
      expect(topics.length).toBeGreaterThan(0);
      expect(topics[0].categoryId).toBe('cat-general');
    });

    it('should sort topics by recent activity', async () => {
      const topic1 = await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'Old Topic',
        content: 'Content',
        tags: [],
      });

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 10));

      const topic2 = await forumSystem.createTopic({
        categoryId: 'cat-general',
        author: {
          id: 'user-1',
          name: 'Test User',
          role: 'user',
          reputation: 0,
        },
        title: 'New Topic',
        content: 'Content',
        tags: [],
      });

      const topics = await forumSystem.getTopicsByCategory('cat-general', {
        sortBy: 'recent',
      });

      expect(topics[0].id).toBe(topic2.id);
      expect(topics[1].id).toBe(topic1.id);
    });
  });
});
