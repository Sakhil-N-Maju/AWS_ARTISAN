/**
 * Content Management System
 *
 * Comprehensive CMS for managing all platform content:
 * - Page management (static pages, landing pages)
 * - Blog/article management
 * - Media library management
 * - Menu and navigation management
 * - Banner and promotional content
 * - SEO metadata management
 * - Content versioning and workflow
 * - Multi-language content support
 */

export interface ContentPage {
  id: string;
  title: string;
  slug: string;
  type: 'static' | 'landing' | 'category' | 'custom';

  // Content
  content: {
    blocks: ContentBlock[];
    rawHtml?: string;
    metadata?: Record<string, any>;
  };

  // Layout
  layout: {
    template: string;
    sidebar?: 'left' | 'right' | 'both' | 'none';
    width: 'full' | 'wide' | 'narrow';
    customCss?: string;
    customJs?: string;
  };

  // SEO
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
    noindex: boolean;
    nofollow: boolean;
  };

  // Publishing
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: Date;
  scheduledFor?: Date;
  expiresAt?: Date;

  // Access control
  visibility: 'public' | 'private' | 'password_protected' | 'members_only';
  password?: string;
  allowedRoles?: string[];

  // Localization
  language: string;
  translations?: {
    language: string;
    pageId: string;
  }[];

  // Versioning
  version: number;
  previousVersions?: string[];

  // Author
  author: {
    id: string;
    name: string;
  };

  // Metadata
  featured: boolean;
  featuredImage?: string;
  tags: string[];
  categories: string[];

  // Analytics
  viewCount: number;
  lastViewedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
  publishedBy?: string;
}

export interface ContentBlock {
  id: string;
  type:
    | 'heading'
    | 'paragraph'
    | 'image'
    | 'gallery'
    | 'video'
    | 'quote'
    | 'list'
    | 'code'
    | 'embed'
    | 'button'
    | 'divider'
    | 'spacer'
    | 'columns'
    | 'accordion'
    | 'tabs'
    | 'card'
    | 'testimonial'
    | 'cta'
    | 'form'
    | 'products'
    | 'custom';

  // Content
  content?: any;

  // Configuration
  config?: {
    alignment?: 'left' | 'center' | 'right' | 'justify';
    size?: 'small' | 'medium' | 'large';
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    customClass?: string;
  };

  // Order
  order: number;
  parentId?: string; // for nested blocks
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;

  // Content
  excerpt: string;
  content: {
    blocks: ContentBlock[];
    rawHtml?: string;
    readingTime: number; // minutes
  };

  // Media
  featuredImage?: string;
  gallery?: string[];

  // SEO
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
  };

  // Publishing
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: Date;
  scheduledFor?: Date;

  // Categorization
  categories: string[];
  tags: string[];

  // Author
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };

  // Engagement
  featured: boolean;
  allowComments: boolean;
  commentCount: number;
  likeCount: number;
  shareCount: number;
  viewCount: number;

  // Related
  relatedPosts?: string[];

  // Localization
  language: string;
  translations?: {
    language: string;
    postId: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  originalFileName: string;

  // File details
  fileType: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
  mimeType: string;
  fileSize: number; // bytes

  // URLs
  url: string;
  thumbnailUrl?: string;

  // Dimensions (for images/videos)
  dimensions?: {
    width: number;
    height: number;
  };

  // Video specific
  duration?: number; // seconds

  // Metadata
  title?: string;
  description?: string;
  altText?: string;
  caption?: string;

  // Organization
  folder?: string;
  tags: string[];

  // Usage
  usageCount: number;
  usedIn?: {
    type: 'page' | 'post' | 'product' | 'banner';
    id: string;
    title: string;
  }[];

  // SEO
  seo: {
    title?: string;
    description?: string;
  };

  // Upload info
  uploadedBy: {
    id: string;
    name: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface NavigationMenu {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'sidebar' | 'mobile' | 'custom';

  // Menu items
  items: NavigationMenuItem[];

  // Configuration
  config: {
    maxDepth: number;
    showIcons: boolean;
    openInNewTab: boolean;
    mobileCollapsible: boolean;
  };

  // Status
  status: 'active' | 'inactive';

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface NavigationMenuItem {
  id: string;
  label: string;

  // Link
  linkType: 'page' | 'post' | 'category' | 'product' | 'external' | 'custom';
  linkTarget?: string;
  url?: string;

  // Display
  icon?: string;
  badge?: {
    text: string;
    color: string;
  };

  // Behavior
  openInNewTab: boolean;

  // Access control
  visibility: 'all' | 'authenticated' | 'guest' | 'role_based';
  allowedRoles?: string[];

  // Children
  children?: NavigationMenuItem[];

  // Order
  order: number;
  parentId?: string;
}

export interface Banner {
  id: string;
  name: string;

  // Content
  title: string;
  subtitle?: string;
  description?: string;

  // Media
  image?: string;
  mobileImage?: string;
  video?: string;

  // CTA
  cta?: {
    text: string;
    url: string;
    openInNewTab: boolean;
    style: 'primary' | 'secondary' | 'outline' | 'text';
  };

  // Placement
  location:
    | 'homepage_hero'
    | 'homepage_middle'
    | 'homepage_bottom'
    | 'category_top'
    | 'product_sidebar'
    | 'checkout'
    | 'custom';
  position?: string;

  // Display
  displayType: 'slider' | 'static' | 'popup' | 'sticky';

  // Styling
  style: {
    textColor?: string;
    backgroundColor?: string;
    overlayColor?: string;
    overlayOpacity?: number;
    alignment?: 'left' | 'center' | 'right';
    height?: string;
    customCss?: string;
  };

  // Scheduling
  status: 'active' | 'inactive' | 'scheduled';
  startDate?: Date;
  endDate?: Date;

  // Targeting
  targeting?: {
    devices?: ('desktop' | 'tablet' | 'mobile')[];
    userTypes?: ('all' | 'guest' | 'authenticated' | 'vip')[];
    countries?: string[];
    customRules?: {
      field: string;
      operator: string;
      value: any;
    }[];
  };

  // Analytics
  impressions: number;
  clicks: number;
  ctr: number;

  // Order
  order: number;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;

  // Type
  type: 'blog' | 'product' | 'page' | 'custom';

  // Hierarchy
  parentId?: string;
  children?: string[];

  // Display
  icon?: string;
  color?: string;
  image?: string;

  // SEO
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };

  // Status
  status: 'active' | 'inactive';

  // Counts
  itemCount: number;

  // Order
  order: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  contentType: 'page' | 'post' | 'banner' | 'menu';

  // Version info
  version: number;

  // Content snapshot
  content: any;

  // Changes
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];

  // Metadata
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: Date;

  // Restoration
  restoredAt?: Date;
  restoredBy?: string;
}

export interface ContentWorkflow {
  id: string;
  contentId: string;
  contentType: 'page' | 'post';

  // Workflow
  currentStep: number;
  steps: {
    step: number;
    name: string;
    status: 'pending' | 'approved' | 'rejected' | 'skipped';
    assignedTo?: string;
    assignedToRole?: string;
    reviewedBy?: string;
    reviewedAt?: Date;
    comments?: string;
  }[];

  // Status
  overallStatus: 'in_review' | 'approved' | 'rejected' | 'completed';

  // Metadata
  createdAt: Date;
  completedAt?: Date;
}

export interface SEOTemplate {
  id: string;
  name: string;
  description: string;

  // Template
  contentType: 'product' | 'category' | 'blog' | 'page' | 'artisan';

  // Templates
  titleTemplate: string; // e.g., "{product_name} - Buy Online | {site_name}"
  descriptionTemplate: string;
  keywordsTemplate?: string;
  ogTitleTemplate?: string;
  ogDescriptionTemplate?: string;

  // Variables available
  availableVariables: {
    name: string;
    description: string;
    example: string;
  }[];

  // Priority
  priority: number;

  // Status
  isDefault: boolean;
  status: 'active' | 'inactive';

  createdAt: Date;
  updatedAt: Date;
}

export interface ContentAnalytics {
  contentId: string;
  contentType: 'page' | 'post' | 'banner';
  period: {
    start: Date;
    end: Date;
  };

  // Traffic
  traffic: {
    pageViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: number; // seconds
    bounceRate: number;
    exitRate: number;
  };

  // Engagement
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    downloads?: number;
  };

  // Sources
  sources: {
    source: string;
    sessions: number;
    percentage: number;
  }[];

  // Devices
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };

  // Geography
  topCountries: {
    country: string;
    sessions: number;
  }[];

  // SEO
  seo: {
    organicSearches: number;
    keywords: {
      keyword: string;
      impressions: number;
      clicks: number;
      position: number;
    }[];
  };
}

export class ContentManagementSystem {
  private pages: Map<string, ContentPage>;
  private posts: Map<string, BlogPost>;
  private media: Map<string, MediaAsset>;
  private menus: Map<string, NavigationMenu>;
  private banners: Map<string, Banner>;
  private categories: Map<string, ContentCategory>;
  private versions: Map<string, ContentVersion[]>;
  private workflows: Map<string, ContentWorkflow>;
  private seoTemplates: Map<string, SEOTemplate>;

  constructor() {
    this.pages = new Map();
    this.posts = new Map();
    this.media = new Map();
    this.menus = new Map();
    this.banners = new Map();
    this.categories = new Map();
    this.versions = new Map();
    this.workflows = new Map();
    this.seoTemplates = new Map();

    // Initialize default data
    this.initializeDefaults();
  }

  /**
   * Initialize default content
   */
  private initializeDefaults(): void {
    // Default SEO templates
    const defaultSEOTemplates: Omit<SEOTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Product SEO Template',
        description: 'Default SEO template for product pages',
        contentType: 'product',
        titleTemplate: '{product_name} - Handcrafted by {artisan_name} | {site_name}',
        descriptionTemplate:
          'Buy authentic {product_name} handcrafted by {artisan_name}. {product_description}. Free shipping on orders over ₹999.',
        keywordsTemplate: '{product_name}, handcrafted, artisan, {category}, {materials}',
        ogTitleTemplate: '{product_name} - Authentic Handcrafted Art',
        ogDescriptionTemplate:
          'Discover {product_name} by {artisan_name}. Each piece tells a unique story.',
        availableVariables: [
          { name: '{product_name}', description: 'Product name', example: 'Handwoven Silk Saree' },
          { name: '{artisan_name}', description: 'Artisan name', example: 'Priya Sharma' },
          { name: '{category}', description: 'Product category', example: 'Textiles' },
          { name: '{price}', description: 'Product price', example: '₹5,999' },
          { name: '{materials}', description: 'Materials used', example: 'Pure Silk' },
          { name: '{site_name}', description: 'Site name', example: 'Artisan Marketplace' },
        ],
        priority: 1,
        isDefault: true,
        status: 'active',
      },
      {
        name: 'Blog Post SEO Template',
        description: 'Default SEO template for blog posts',
        contentType: 'blog',
        titleTemplate: '{post_title} | {site_name} Blog',
        descriptionTemplate: '{post_excerpt}',
        ogTitleTemplate: '{post_title}',
        ogDescriptionTemplate: '{post_excerpt}',
        availableVariables: [
          {
            name: '{post_title}',
            description: 'Post title',
            example: 'The Art of Handloom Weaving',
          },
          {
            name: '{post_excerpt}',
            description: 'Post excerpt',
            example: 'Discover the centuries-old tradition...',
          },
          { name: '{author_name}', description: 'Author name', example: 'Editorial Team' },
          { name: '{category}', description: 'Post category', example: 'Crafts & Techniques' },
          { name: '{site_name}', description: 'Site name', example: 'Artisan Marketplace' },
        ],
        priority: 2,
        isDefault: true,
        status: 'active',
      },
      {
        name: 'Category SEO Template',
        description: 'Default SEO template for category pages',
        contentType: 'category',
        titleTemplate: '{category_name} - Handcrafted Products | {site_name}',
        descriptionTemplate:
          'Explore our collection of handcrafted {category_name}. Authentic artisan products made with traditional techniques. Shop now!',
        availableVariables: [
          { name: '{category_name}', description: 'Category name', example: 'Pottery' },
          { name: '{product_count}', description: 'Number of products', example: '245' },
          { name: '{site_name}', description: 'Site name', example: 'Artisan Marketplace' },
        ],
        priority: 3,
        isDefault: true,
        status: 'active',
      },
    ];

    defaultSEOTemplates.forEach((template, index) => {
      const id = `seo-${Date.now()}-${index}`;
      this.seoTemplates.set(id, {
        ...template,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Default content categories
    const defaultCategories: Omit<ContentCategory, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Artisan Stories',
        slug: 'artisan-stories',
        description: 'Stories about our talented artisans and their craft',
        type: 'blog',
        status: 'active',
        itemCount: 24,
        order: 1,
      },
      {
        name: 'Craft Techniques',
        slug: 'craft-techniques',
        description: 'Learn about traditional craft techniques',
        type: 'blog',
        status: 'active',
        itemCount: 18,
        order: 2,
      },
      {
        name: 'Product Guides',
        slug: 'product-guides',
        description: 'Buying guides and product care tips',
        type: 'blog',
        status: 'active',
        itemCount: 15,
        order: 3,
      },
      {
        name: 'Cultural Heritage',
        slug: 'cultural-heritage',
        description: "Exploring India's rich cultural heritage",
        type: 'blog',
        status: 'active',
        itemCount: 32,
        order: 4,
      },
    ];

    defaultCategories.forEach((category, index) => {
      const id = `cat-${Date.now()}-${index}`;
      this.categories.set(id, {
        ...category,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Default navigation menu
    const defaultMenu: Omit<NavigationMenu, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Main Navigation',
        location: 'header',
        items: [
          {
            id: 'nav-1',
            label: 'Shop',
            linkType: 'custom',
            url: '/shop',
            openInNewTab: false,
            visibility: 'all',
            order: 1,
            children: [
              {
                id: 'nav-1-1',
                label: 'All Products',
                linkType: 'category',
                url: '/shop/all',
                openInNewTab: false,
                visibility: 'all',
                order: 1,
              },
              {
                id: 'nav-1-2',
                label: 'Textiles',
                linkType: 'category',
                url: '/shop/textiles',
                openInNewTab: false,
                visibility: 'all',
                order: 2,
              },
              {
                id: 'nav-1-3',
                label: 'Pottery',
                linkType: 'category',
                url: '/shop/pottery',
                openInNewTab: false,
                visibility: 'all',
                order: 3,
              },
              {
                id: 'nav-1-4',
                label: 'Jewelry',
                linkType: 'category',
                url: '/shop/jewelry',
                openInNewTab: false,
                visibility: 'all',
                order: 4,
              },
            ],
          },
          {
            id: 'nav-2',
            label: 'Artisans',
            linkType: 'page',
            url: '/artisans',
            openInNewTab: false,
            visibility: 'all',
            order: 2,
          },
          {
            id: 'nav-3',
            label: 'Stories',
            linkType: 'page',
            url: '/stories',
            openInNewTab: false,
            visibility: 'all',
            order: 3,
          },
          {
            id: 'nav-4',
            label: 'Workshops',
            linkType: 'page',
            url: '/workshops',
            openInNewTab: false,
            visibility: 'all',
            order: 4,
          },
          {
            id: 'nav-5',
            label: 'About',
            linkType: 'page',
            url: '/about',
            openInNewTab: false,
            visibility: 'all',
            order: 5,
          },
        ],
        config: {
          maxDepth: 2,
          showIcons: false,
          openInNewTab: false,
          mobileCollapsible: true,
        },
        status: 'active',
        createdBy: 'system',
      },
    ];

    defaultMenu.forEach((menu, index) => {
      const id = `menu-${Date.now()}-${index}`;
      this.menus.set(id, {
        ...menu,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  /**
   * Create a new page
   */
  async createPage(params: {
    title: string;
    slug: string;
    type: ContentPage['type'];
    content: ContentPage['content'];
    layout?: ContentPage['layout'];
    seo?: ContentPage['seo'];
    authorId: string;
    authorName: string;
    status?: ContentPage['status'];
  }): Promise<ContentPage> {
    const page: ContentPage = {
      id: `page-${Date.now()}`,
      title: params.title,
      slug: params.slug,
      type: params.type,
      content: params.content,
      layout: params.layout || {
        template: 'default',
        sidebar: 'none',
        width: 'wide',
      },
      seo: params.seo || {
        noindex: false,
        nofollow: false,
      },
      status: params.status || 'draft',
      visibility: 'public',
      language: 'en',
      version: 1,
      author: {
        id: params.authorId,
        name: params.authorName,
      },
      featured: false,
      tags: [],
      categories: [],
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.pages.set(page.id, page);

    // Create initial version
    await this.createVersion({
      contentId: page.id,
      contentType: 'page',
      content: page,
      createdBy: { id: params.authorId, name: params.authorName },
    });

    return page;
  }

  /**
   * Update page
   */
  async updatePage(params: {
    pageId: string;
    updates: Partial<ContentPage>;
    modifiedBy: { id: string; name: string };
  }): Promise<ContentPage> {
    const page = this.pages.get(params.pageId);
    if (!page) throw new Error('Page not found');

    // Create version before updating
    await this.createVersion({
      contentId: params.pageId,
      contentType: 'page',
      content: { ...page },
      createdBy: params.modifiedBy,
    });

    // Update page
    Object.assign(page, params.updates, {
      version: page.version + 1,
      updatedAt: new Date(),
    });

    return page;
  }

  /**
   * Publish page
   */
  async publishPage(params: {
    pageId: string;
    publishedBy: string;
    scheduledFor?: Date;
  }): Promise<void> {
    const page = this.pages.get(params.pageId);
    if (!page) return;

    if (params.scheduledFor && params.scheduledFor > new Date()) {
      page.status = 'scheduled';
      page.scheduledFor = params.scheduledFor;
    } else {
      page.status = 'published';
      page.publishedAt = new Date();
      page.publishedBy = params.publishedBy;
    }

    page.updatedAt = new Date();
  }

  /**
   * Create blog post
   */
  async createPost(params: {
    title: string;
    slug: string;
    excerpt: string;
    content: BlogPost['content'];
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    categories?: string[];
    tags?: string[];
    featuredImage?: string;
  }): Promise<BlogPost> {
    const post: BlogPost = {
      id: `post-${Date.now()}`,
      title: params.title,
      slug: params.slug,
      excerpt: params.excerpt,
      content: params.content,
      featuredImage: params.featuredImage,
      seo: {},
      status: 'draft',
      categories: params.categories || [],
      tags: params.tags || [],
      author: {
        id: params.authorId,
        name: params.authorName,
        avatar: params.authorAvatar,
      },
      featured: false,
      allowComments: true,
      commentCount: 0,
      likeCount: 0,
      shareCount: 0,
      viewCount: 0,
      language: 'en',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.posts.set(post.id, post);
    return post;
  }

  /**
   * Publish blog post
   */
  async publishPost(params: { postId: string; scheduledFor?: Date }): Promise<void> {
    const post = this.posts.get(params.postId);
    if (!post) return;

    if (params.scheduledFor && params.scheduledFor > new Date()) {
      post.status = 'scheduled';
      post.scheduledFor = params.scheduledFor;
    } else {
      post.status = 'published';
      post.publishedAt = new Date();
    }

    post.updatedAt = new Date();
  }

  /**
   * Upload media asset
   */
  async uploadMedia(params: {
    fileName: string;
    fileType: MediaAsset['fileType'];
    mimeType: string;
    fileSize: number;
    url: string;
    thumbnailUrl?: string;
    dimensions?: MediaAsset['dimensions'];
    uploadedBy: { id: string; name: string };
    title?: string;
    altText?: string;
  }): Promise<MediaAsset> {
    const asset: MediaAsset = {
      id: `media-${Date.now()}`,
      fileName: params.fileName,
      originalFileName: params.fileName,
      fileType: params.fileType,
      mimeType: params.mimeType,
      fileSize: params.fileSize,
      url: params.url,
      thumbnailUrl: params.thumbnailUrl,
      dimensions: params.dimensions,
      title: params.title,
      altText: params.altText,
      tags: [],
      usageCount: 0,
      seo: {},
      uploadedBy: params.uploadedBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.media.set(asset.id, asset);
    return asset;
  }

  /**
   * Create banner
   */
  async createBanner(params: {
    name: string;
    title: string;
    subtitle?: string;
    image?: string;
    location: Banner['location'];
    cta?: Banner['cta'];
    createdBy: string;
  }): Promise<Banner> {
    const banner: Banner = {
      id: `banner-${Date.now()}`,
      name: params.name,
      title: params.title,
      subtitle: params.subtitle,
      image: params.image,
      location: params.location,
      cta: params.cta,
      displayType: 'static',
      style: {
        alignment: 'center',
      },
      status: 'inactive',
      impressions: 0,
      clicks: 0,
      ctr: 0,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: params.createdBy,
    };

    this.banners.set(banner.id, banner);
    return banner;
  }

  /**
   * Activate banner
   */
  async activateBanner(params: {
    bannerId: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<void> {
    const banner = this.banners.get(params.bannerId);
    if (!banner) return;

    banner.status = 'active';
    banner.startDate = params.startDate;
    banner.endDate = params.endDate;
    banner.updatedAt = new Date();
  }

  /**
   * Create navigation menu
   */
  async createMenu(params: {
    name: string;
    location: NavigationMenu['location'];
    items: NavigationMenuItem[];
    createdBy: string;
  }): Promise<NavigationMenu> {
    const menu: NavigationMenu = {
      id: `menu-${Date.now()}`,
      name: params.name,
      location: params.location,
      items: params.items,
      config: {
        maxDepth: 3,
        showIcons: false,
        openInNewTab: false,
        mobileCollapsible: true,
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: params.createdBy,
    };

    this.menus.set(menu.id, menu);
    return menu;
  }

  /**
   * Create content version
   */
  private async createVersion(params: {
    contentId: string;
    contentType: ContentVersion['contentType'];
    content: any;
    createdBy: { id: string; name: string };
  }): Promise<ContentVersion> {
    const versions = this.versions.get(params.contentId) || [];

    const version: ContentVersion = {
      id: `version-${Date.now()}`,
      contentId: params.contentId,
      contentType: params.contentType,
      version: versions.length + 1,
      content: JSON.parse(JSON.stringify(params.content)), // Deep clone
      createdBy: params.createdBy,
      createdAt: new Date(),
    };

    versions.push(version);
    this.versions.set(params.contentId, versions);

    return version;
  }

  /**
   * Restore version
   */
  async restoreVersion(params: { versionId: string; restoredBy: string }): Promise<void> {
    // Find version
    let targetVersion: ContentVersion | undefined;
    for (const versions of this.versions.values()) {
      targetVersion = versions.find((v) => v.id === params.versionId);
      if (targetVersion) break;
    }

    if (!targetVersion) return;

    // Restore content based on type
    switch (targetVersion.contentType) {
      case 'page':
        const page = this.pages.get(targetVersion.contentId);
        if (page) {
          Object.assign(page, targetVersion.content, {
            version: page.version + 1,
            updatedAt: new Date(),
          });
        }
        break;
      case 'post':
        const post = this.posts.get(targetVersion.contentId);
        if (post) {
          Object.assign(post, targetVersion.content, {
            updatedAt: new Date(),
          });
        }
        break;
    }

    targetVersion.restoredAt = new Date();
    targetVersion.restoredBy = params.restoredBy;
  }

  /**
   * Get all pages
   */
  async getPages(filters?: {
    status?: ContentPage['status'];
    type?: ContentPage['type'];
    language?: string;
    limit?: number;
  }): Promise<ContentPage[]> {
    let pages = Array.from(this.pages.values());

    if (filters?.status) {
      pages = pages.filter((p) => p.status === filters.status);
    }

    if (filters?.type) {
      pages = pages.filter((p) => p.type === filters.type);
    }

    if (filters?.language) {
      pages = pages.filter((p) => p.language === filters.language);
    }

    // Sort by updated date
    pages.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    if (filters?.limit) {
      pages = pages.slice(0, filters.limit);
    }

    return pages;
  }

  /**
   * Get all blog posts
   */
  async getPosts(filters?: {
    status?: BlogPost['status'];
    category?: string;
    tag?: string;
    author?: string;
    limit?: number;
  }): Promise<BlogPost[]> {
    let posts = Array.from(this.posts.values());

    if (filters?.status) {
      posts = posts.filter((p) => p.status === filters.status);
    }

    if (filters?.category) {
      posts = posts.filter((p) => p.categories.includes(filters.category!));
    }

    if (filters?.tag) {
      posts = posts.filter((p) => p.tags.includes(filters.tag!));
    }

    if (filters?.author) {
      posts = posts.filter((p) => p.author.id === filters.author);
    }

    // Sort by published date
    posts.sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));

    if (filters?.limit) {
      posts = posts.slice(0, filters.limit);
    }

    return posts;
  }

  /**
   * Get media library
   */
  async getMediaLibrary(filters?: {
    fileType?: MediaAsset['fileType'];
    folder?: string;
    tag?: string;
    limit?: number;
  }): Promise<MediaAsset[]> {
    let assets = Array.from(this.media.values());

    if (filters?.fileType) {
      assets = assets.filter((a) => a.fileType === filters.fileType);
    }

    if (filters?.folder) {
      assets = assets.filter((a) => a.folder === filters.folder);
    }

    if (filters?.tag) {
      assets = assets.filter((a) => a.tags.includes(filters.tag!));
    }

    // Sort by created date
    assets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (filters?.limit) {
      assets = assets.slice(0, filters.limit);
    }

    return assets;
  }

  /**
   * Get active banners
   */
  async getActiveBanners(location?: Banner['location']): Promise<Banner[]> {
    let banners = Array.from(this.banners.values()).filter((b) => {
      if (b.status !== 'active') return false;

      const now = new Date();
      if (b.startDate && b.startDate > now) return false;
      if (b.endDate && b.endDate < now) return false;

      return true;
    });

    if (location) {
      banners = banners.filter((b) => b.location === location);
    }

    // Sort by order
    banners.sort((a, b) => a.order - b.order);

    return banners;
  }

  /**
   * Get navigation menu
   */
  async getMenu(location: NavigationMenu['location']): Promise<NavigationMenu | null> {
    const menus = Array.from(this.menus.values());
    return menus.find((m) => m.location === location && m.status === 'active') || null;
  }

  /**
   * Get content categories
   */
  async getCategories(type?: ContentCategory['type']): Promise<ContentCategory[]> {
    let categories = Array.from(this.categories.values());

    if (type) {
      categories = categories.filter((c) => c.type === type);
    }

    // Sort by order
    categories.sort((a, b) => a.order - b.order);

    return categories;
  }

  /**
   * Get content analytics
   */
  async getContentAnalytics(params: {
    contentId: string;
    contentType: 'page' | 'post' | 'banner';
    period: { start: Date; end: Date };
  }): Promise<ContentAnalytics> {
    return {
      contentId: params.contentId,
      contentType: params.contentType,
      period: params.period,
      traffic: {
        pageViews: 15234,
        uniqueVisitors: 8945,
        avgTimeOnPage: 185,
        bounceRate: 42.5,
        exitRate: 38.2,
      },
      engagement: {
        likes: 324,
        shares: 156,
        comments: 89,
      },
      sources: [
        { source: 'Organic Search', sessions: 6234, percentage: 40.9 },
        { source: 'Direct', sessions: 4512, percentage: 29.6 },
        { source: 'Social Media', sessions: 2845, percentage: 18.7 },
        { source: 'Referral', sessions: 1643, percentage: 10.8 },
      ],
      devices: {
        desktop: 8456,
        mobile: 5234,
        tablet: 1544,
      },
      topCountries: [
        { country: 'India', sessions: 12456 },
        { country: 'United States', sessions: 1234 },
        { country: 'United Kingdom', sessions: 856 },
      ],
      seo: {
        organicSearches: 6234,
        keywords: [
          { keyword: 'handcrafted pottery', impressions: 12500, clicks: 485, position: 3.2 },
          { keyword: 'artisan textiles', impressions: 8900, clicks: 325, position: 5.1 },
          { keyword: 'handmade jewelry', impressions: 6750, clicks: 245, position: 7.3 },
        ],
      },
    };
  }

  /**
   * Get SEO templates
   */
  async getSEOTemplates(contentType?: SEOTemplate['contentType']): Promise<SEOTemplate[]> {
    let templates = Array.from(this.seoTemplates.values());

    if (contentType) {
      templates = templates.filter((t) => t.contentType === contentType);
    }

    // Sort by priority
    templates.sort((a, b) => a.priority - b.priority);

    return templates;
  }

  /**
   * Get content versions
   */
  async getVersions(contentId: string): Promise<ContentVersion[]> {
    return this.versions.get(contentId) || [];
  }
}

// Export singleton instance
export const contentManagementSystem = new ContentManagementSystem();
