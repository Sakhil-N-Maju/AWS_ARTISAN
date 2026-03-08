/**
 * AR/VR Product Visualization System
 *
 * Enables immersive product experiences:
 * - AR try-on and placement
 * - 3D product models
 * - Virtual showrooms
 * - 360° product views
 * - Size and scale visualization
 * - Material and texture preview
 */

export interface Product3DModel {
  productId: string;

  // Model Files
  models: {
    glb?: string; // Standard 3D format
    usdz?: string; // Apple AR format
    fbx?: string; // High-quality format
    obj?: string; // Legacy format
  };

  // Textures
  textures: {
    diffuse?: string;
    normal?: string;
    roughness?: string;
    metallic?: string;
    ambient?: string;
  };

  // Metadata
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'inch' | 'meter';
  };

  // Settings
  settings: {
    scale: number;
    rotation: { x: number; y: number; z: number };
    lightingPreset: 'studio' | 'outdoor' | 'indoor' | 'custom';
    backgroundColor: string;
    enableShadows: boolean;
    enableReflections: boolean;
  };

  // Quality levels
  qualityLevels: {
    low: string; // Mobile
    medium: string; // Desktop
    high: string; // VR
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface ARExperience {
  id: string;
  productId: string;
  userId: string;

  // Type
  type: 'placement' | 'try-on' | 'visualization';

  // Environment
  environment: {
    surfaceDetection: boolean;
    lightEstimation: boolean;
    planeTracking: boolean;
  };

  // Interaction
  interactions: {
    canRotate: boolean;
    canScale: boolean;
    canMove: boolean;
    canSnapshot: boolean;
  };

  // Session data
  session: {
    duration: number; // seconds
    snapshots: {
      imageUrl: string;
      timestamp: Date;
    }[];
    placementAttempts: number;
  };

  // Analytics
  deviceType: 'mobile' | 'tablet' | 'ar_headset';
  platform: 'iOS' | 'Android' | 'WebAR';

  createdAt: Date;
}

export interface VirtualShowroom {
  id: string;
  name: string;
  description: string;

  // Theme
  theme: {
    environment: 'gallery' | 'workshop' | 'store' | 'museum' | 'home';
    ambiance: 'bright' | 'warm' | 'cool' | 'dramatic';
    floorMaterial: string;
    wallMaterial: string;
  };

  // Layout
  layout: {
    type: 'grid' | 'pathway' | 'circular' | 'custom';
    capacity: number; // Max products
  };

  // Products
  products: {
    productId: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: number;
    displayType: 'pedestal' | 'wall' | 'floating' | 'table';
  }[];

  // Interactive Elements
  interactiveElements: {
    type: 'info_panel' | 'video_screen' | 'audio_guide' | 'teleport_point';
    position: { x: number; y: number; z: number };
    content: string;
  }[];

  // Navigation
  navigation: {
    enableTeleport: boolean;
    enableWalking: boolean;
    enableFlying: boolean;
    waypoints: {
      name: string;
      position: { x: number; y: number; z: number };
    }[];
  };

  // Stats
  stats: {
    totalVisits: number;
    averageDuration: number;
    uniqueVisitors: number;
    productInteractions: number;
  };

  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VRSession {
  id: string;
  userId: string;
  showroomId: string;

  // Device
  device: {
    type: 'vr_headset' | 'desktop_vr' | 'mobile_vr';
    model: string;
  };

  // Session data
  session: {
    startTime: Date;
    endTime?: Date;
    duration: number;
  };

  // Interactions
  interactions: {
    productsViewed: string[];
    productsInteracted: string[];
    waypointsVisited: string[];
    snapshotsTaken: number;
  };

  // Analytics
  analytics: {
    averageGazeTime: number; // seconds per product
    mostViewedProduct?: string;
    pathTaken: { x: number; y: number; z: number; timestamp: Date }[];
  };
}

export interface Product360View {
  productId: string;

  // Images
  frames: {
    angle: number;
    imageUrl: string;
    thumbnail: string;
  }[];

  // Configuration
  config: {
    totalFrames: number;
    startAngle: number;
    rotationDirection: 'clockwise' | 'counterclockwise';
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableZoom: boolean;
    maxZoom: number;
  };

  // Hotspots (interactive points)
  hotspots: {
    angle: number;
    position: { x: number; y: number };
    type: 'info' | 'detail' | 'feature';
    title: string;
    description: string;
    imageUrl?: string;
  }[];
}

export class ARVRVisualizationSystem {
  private models: Map<string, Product3DModel>;
  private arExperiences: Map<string, ARExperience>;
  private virtualShowrooms: Map<string, VirtualShowroom>;
  private vrSessions: Map<string, VRSession>;
  private view360s: Map<string, Product360View>;

  constructor() {
    this.models = new Map();
    this.arExperiences = new Map();
    this.virtualShowrooms = new Map();
    this.vrSessions = new Map();
    this.view360s = new Map();
  }

  /**
   * Create 3D model for product
   */
  async create3DModel(params: {
    productId: string;
    models: Product3DModel['models'];
    textures?: Product3DModel['textures'];
    dimensions: Product3DModel['dimensions'];
    settings?: Partial<Product3DModel['settings']>;
  }): Promise<Product3DModel> {
    const model: Product3DModel = {
      productId: params.productId,
      models: params.models,
      textures: params.textures || {},
      dimensions: params.dimensions,
      settings: {
        scale: 1,
        rotation: { x: 0, y: 0, z: 0 },
        lightingPreset: 'studio',
        backgroundColor: '#f5f5f5',
        enableShadows: true,
        enableReflections: true,
        ...params.settings,
      },
      qualityLevels: {
        low: params.models.glb || '',
        medium: params.models.glb || '',
        high: params.models.glb || '',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.models.set(params.productId, model);
    return model;
  }

  /**
   * Get 3D model
   */
  async get3DModel(
    productId: string,
    quality: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<Product3DModel | null> {
    return this.models.get(productId) || null;
  }

  /**
   * Start AR experience
   */
  async startARExperience(params: {
    productId: string;
    userId: string;
    type: ARExperience['type'];
    deviceType: ARExperience['deviceType'];
    platform: ARExperience['platform'];
  }): Promise<ARExperience> {
    const model = await this.get3DModel(params.productId);
    if (!model) {
      throw new Error('3D model not found for product');
    }

    const experience: ARExperience = {
      id: `ar-${Date.now()}`,
      productId: params.productId,
      userId: params.userId,
      type: params.type,
      environment: {
        surfaceDetection: true,
        lightEstimation: true,
        planeTracking: true,
      },
      interactions: {
        canRotate: true,
        canScale: true,
        canMove: true,
        canSnapshot: true,
      },
      session: {
        duration: 0,
        snapshots: [],
        placementAttempts: 0,
      },
      deviceType: params.deviceType,
      platform: params.platform,
      createdAt: new Date(),
    };

    this.arExperiences.set(experience.id, experience);
    return experience;
  }

  /**
   * Take AR snapshot
   */
  async takeARSnapshot(experienceId: string, imageUrl: string): Promise<void> {
    const experience = this.arExperiences.get(experienceId);
    if (!experience) return;

    experience.session.snapshots.push({
      imageUrl,
      timestamp: new Date(),
    });
  }

  /**
   * End AR experience
   */
  async endARExperience(experienceId: string): Promise<void> {
    const experience = this.arExperiences.get(experienceId);
    if (!experience) return;

    const duration = (Date.now() - experience.createdAt.getTime()) / 1000;
    experience.session.duration = duration;
  }

  /**
   * Create virtual showroom
   */
  async createVirtualShowroom(params: {
    name: string;
    description: string;
    theme: VirtualShowroom['theme'];
    layout: VirtualShowroom['layout'];
    products: VirtualShowroom['products'];
  }): Promise<VirtualShowroom> {
    const showroom: VirtualShowroom = {
      id: `showroom-${Date.now()}`,
      name: params.name,
      description: params.description,
      theme: params.theme,
      layout: params.layout,
      products: params.products,
      interactiveElements: [],
      navigation: {
        enableTeleport: true,
        enableWalking: true,
        enableFlying: false,
        waypoints: [],
      },
      stats: {
        totalVisits: 0,
        averageDuration: 0,
        uniqueVisitors: 0,
        productInteractions: 0,
      },
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.virtualShowrooms.set(showroom.id, showroom);
    return showroom;
  }

  /**
   * Add interactive element to showroom
   */
  async addInteractiveElement(
    showroomId: string,
    element: VirtualShowroom['interactiveElements'][0]
  ): Promise<void> {
    const showroom = this.virtualShowrooms.get(showroomId);
    if (!showroom) return;

    showroom.interactiveElements.push(element);
    showroom.updatedAt = new Date();
  }

  /**
   * Start VR session
   */
  async startVRSession(params: {
    userId: string;
    showroomId: string;
    device: VRSession['device'];
  }): Promise<VRSession> {
    const showroom = this.virtualShowrooms.get(params.showroomId);
    if (!showroom) {
      throw new Error('Showroom not found');
    }

    const session: VRSession = {
      id: `vr-${Date.now()}`,
      userId: params.userId,
      showroomId: params.showroomId,
      device: params.device,
      session: {
        startTime: new Date(),
        duration: 0,
      },
      interactions: {
        productsViewed: [],
        productsInteracted: [],
        waypointsVisited: [],
        snapshotsTaken: 0,
      },
      analytics: {
        averageGazeTime: 0,
        pathTaken: [],
      },
    };

    this.vrSessions.set(session.id, session);

    // Update showroom stats
    showroom.stats.totalVisits++;
    showroom.stats.uniqueVisitors++;

    return session;
  }

  /**
   * Track product interaction in VR
   */
  async trackVRInteraction(
    sessionId: string,
    productId: string,
    interactionType: 'view' | 'interact'
  ): Promise<void> {
    const session = this.vrSessions.get(sessionId);
    if (!session) return;

    if (interactionType === 'view' && !session.interactions.productsViewed.includes(productId)) {
      session.interactions.productsViewed.push(productId);
    } else if (
      interactionType === 'interact' &&
      !session.interactions.productsInteracted.includes(productId)
    ) {
      session.interactions.productsInteracted.push(productId);

      // Update showroom stats
      const showroom = this.virtualShowrooms.get(session.showroomId);
      if (showroom) {
        showroom.stats.productInteractions++;
      }
    }
  }

  /**
   * End VR session
   */
  async endVRSession(sessionId: string): Promise<void> {
    const session = this.vrSessions.get(sessionId);
    if (!session) return;

    session.session.endTime = new Date();
    session.session.duration =
      (session.session.endTime.getTime() - session.session.startTime.getTime()) / 1000;

    // Update showroom stats
    const showroom = this.virtualShowrooms.get(session.showroomId);
    if (showroom) {
      const totalDuration =
        showroom.stats.averageDuration * (showroom.stats.totalVisits - 1) +
        session.session.duration;
      showroom.stats.averageDuration = totalDuration / showroom.stats.totalVisits;
    }
  }

  /**
   * Create 360° view
   */
  async create360View(params: {
    productId: string;
    frames: Product360View['frames'];
    config?: Partial<Product360View['config']>;
    hotspots?: Product360View['hotspots'];
  }): Promise<Product360View> {
    const view360: Product360View = {
      productId: params.productId,
      frames: params.frames,
      config: {
        totalFrames: params.frames.length,
        startAngle: 0,
        rotationDirection: 'clockwise',
        autoRotate: false,
        autoRotateSpeed: 2,
        enableZoom: true,
        maxZoom: 3,
        ...params.config,
      },
      hotspots: params.hotspots || [],
    };

    this.view360s.set(params.productId, view360);
    return view360;
  }

  /**
   * Get 360° view
   */
  async get360View(productId: string): Promise<Product360View | null> {
    return this.view360s.get(productId) || null;
  }

  /**
   * Get AR/VR statistics
   */
  async getARVRStats() {
    const models = Array.from(this.models.values());
    const arExperiences = Array.from(this.arExperiences.values());
    const showrooms = Array.from(this.virtualShowrooms.values());
    const vrSessions = Array.from(this.vrSessions.values());
    const view360s = Array.from(this.view360s.values());

    const total3DModels = models.length;
    const totalARExperiences = arExperiences.length;
    const totalShowrooms = showrooms.length;
    const publishedShowrooms = showrooms.filter((s) => s.isPublished).length;
    const totalVRSessions = vrSessions.length;
    const total360Views = view360s.length;

    const averageARDuration =
      arExperiences.length > 0
        ? arExperiences.reduce((sum, exp) => sum + exp.session.duration, 0) / arExperiences.length
        : 0;

    const totalARSnapshots = arExperiences.reduce(
      (sum, exp) => sum + exp.session.snapshots.length,
      0
    );

    const averageVRDuration =
      vrSessions.length > 0
        ? vrSessions.reduce((sum, session) => sum + session.session.duration, 0) / vrSessions.length
        : 0;

    const totalShowroomVisits = showrooms.reduce(
      (sum, showroom) => sum + showroom.stats.totalVisits,
      0
    );

    return {
      total3DModels,
      totalARExperiences,
      averageARDuration: Number(averageARDuration.toFixed(1)),
      totalARSnapshots,
      totalShowrooms,
      publishedShowrooms,
      totalVRSessions,
      averageVRDuration: Number(averageVRDuration.toFixed(1)),
      totalShowroomVisits,
      total360Views,
    };
  }

  /**
   * Get popular products in AR/VR
   */
  async getPopularProducts(limit: number = 10): Promise<
    {
      productId: string;
      arViews: number;
      vrInteractions: number;
      snapshots: number;
    }[]
  > {
    const productStats = new Map<string, any>();

    // Count AR experiences
    this.arExperiences.forEach((exp) => {
      if (!productStats.has(exp.productId)) {
        productStats.set(exp.productId, {
          productId: exp.productId,
          arViews: 0,
          vrInteractions: 0,
          snapshots: 0,
        });
      }
      const stats = productStats.get(exp.productId);
      stats.arViews++;
      stats.snapshots += exp.session.snapshots.length;
    });

    // Count VR interactions
    this.vrSessions.forEach((session) => {
      session.interactions.productsInteracted.forEach((productId) => {
        if (!productStats.has(productId)) {
          productStats.set(productId, {
            productId,
            arViews: 0,
            vrInteractions: 0,
            snapshots: 0,
          });
        }
        const stats = productStats.get(productId);
        stats.vrInteractions++;
      });
    });

    return Array.from(productStats.values())
      .sort((a, b) => b.arViews + b.vrInteractions - (a.arViews + a.vrInteractions))
      .slice(0, limit);
  }
}

// Export singleton instance
export const arvrVisualizationSystem = new ARVRVisualizationSystem();
