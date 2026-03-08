/**
 * Workshop Booking Service
 *
 * Handles workshop bookings, scheduling, and tourism experiences
 * Enables customers to book hands-on craft workshops with artisans
 */

export interface Workshop {
  id: string;
  title: string;
  description: string;
  craftType: string;
  artisanId: string;
  artisanName: string;

  // Location
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Workshop Details
  duration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maxParticipants: number;
  minParticipants: number;
  language: string[];

  // Pricing
  price: {
    amount: number;
    currency: string;
    includes: string[];
  };

  // Schedule
  schedule: WorkshopSchedule[];

  // Media
  images: string[];
  virtualTourUrl?: string;

  // Learning Outcomes
  learningOutcomes: string[];
  materialsProvided: string[];
  requirements?: string[];

  // Status
  status: 'active' | 'inactive' | 'sold_out';
  rating?: number;
  reviewCount?: number;

  // Features
  features: {
    virtualOption: boolean;
    inPerson: boolean;
    certificateProvided: boolean;
    takeHomeProduct: boolean;
    refreshmentsIncluded: boolean;
    transportationIncluded: boolean;
  };
}

export interface WorkshopSchedule {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  availableSpots: number;
  bookedSpots: number;
  status: 'available' | 'full' | 'cancelled';
}

export interface Booking {
  id: string;
  workshopId: string;
  scheduleId: string;
  userId: string;

  // Participant Details
  participants: {
    name: string;
    email: string;
    phone: string;
    age?: number;
  }[];

  // Booking Details
  bookingDate: Date;
  workshopDate: Date;
  numberOfParticipants: number;
  totalAmount: number;

  // Payment
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'cancelled';
  paymentId?: string;
  paymentMethod?: string;

  // Status
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  confirmationCode: string;

  // Special Requests
  specialRequests?: string;
  dietaryRestrictions?: string[];

  // Communication
  reminderSent: boolean;
  feedbackSubmitted: boolean;
}

export interface BookingRequest {
  workshopId: string;
  scheduleId: string;
  participants: {
    name: string;
    email: string;
    phone: string;
    age?: number;
  }[];
  specialRequests?: string;
  dietaryRestrictions?: string[];
}

export class WorkshopBookingService {
  private workshops: Map<string, Workshop>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.workshops = new Map();
    this.bookings = new Map();
    this.initializeWorkshops();
  }

  /**
   * Initialize sample workshops
   */
  private initializeWorkshops() {
    const sampleWorkshops: Workshop[] = [
      {
        id: 'workshop-001',
        title: 'Traditional Pottery Making Workshop',
        description:
          'Learn the ancient art of pottery making from master artisans. Create your own clay pots using traditional wheel techniques.',
        craftType: 'Pottery',
        artisanId: 'artisan-001',
        artisanName: 'Ramesh Kumar',
        location: {
          address: '123 Potter Street, Khurja',
          city: 'Khurja',
          state: 'Uttar Pradesh',
          country: 'India',
          coordinates: { lat: 28.2, lng: 77.9 },
        },
        duration: 4,
        difficulty: 'beginner',
        maxParticipants: 10,
        minParticipants: 3,
        language: ['English', 'Hindi'],
        price: {
          amount: 2500,
          currency: 'INR',
          includes: ['Clay materials', 'Tools', 'Lunch', 'Take-home pottery', 'Certificate'],
        },
        schedule: [],
        images: ['/images/workshops/pottery-1.jpg', '/images/workshops/pottery-2.jpg'],
        learningOutcomes: [
          'Master basic pottery wheel techniques',
          'Understand clay preparation and types',
          'Create 2-3 pottery items',
          'Learn glazing and firing basics',
        ],
        materialsProvided: ['Clay', 'Pottery wheel', 'Tools', 'Apron', 'Glazes'],
        requirements: ['Comfortable clothing', 'Closed-toe shoes'],
        status: 'active',
        rating: 4.8,
        reviewCount: 45,
        features: {
          virtualOption: false,
          inPerson: true,
          certificateProvided: true,
          takeHomeProduct: true,
          refreshmentsIncluded: true,
          transportationIncluded: false,
        },
      },
      {
        id: 'workshop-002',
        title: 'Madhubani Painting Masterclass',
        description:
          'Immerse yourself in the vibrant world of Madhubani art. Learn traditional patterns, techniques, and create your own masterpiece.',
        craftType: 'Painting',
        artisanId: 'artisan-002',
        artisanName: 'Sunita Devi',
        location: {
          address: '45 Art Village, Madhubani',
          city: 'Madhubani',
          state: 'Bihar',
          country: 'India',
          coordinates: { lat: 26.35, lng: 86.07 },
        },
        duration: 3,
        difficulty: 'beginner',
        maxParticipants: 15,
        minParticipants: 5,
        language: ['English', 'Hindi', 'Maithili'],
        price: {
          amount: 1800,
          currency: 'INR',
          includes: ['Canvas', 'Natural colors', 'Brushes', 'Tea & snacks', 'Your artwork'],
        },
        schedule: [],
        images: ['/images/workshops/madhubani-1.jpg', '/images/workshops/madhubani-2.jpg'],
        virtualTourUrl: '/virtual-tours/madhubani-studio',
        learningOutcomes: [
          'Understand Madhubani art history and symbolism',
          'Master traditional patterns and motifs',
          'Mix natural colors from traditional recipes',
          'Create a complete Madhubani painting',
        ],
        materialsProvided: ['Canvas', 'Natural pigments', 'Bamboo brushes', 'Reference materials'],
        requirements: ['No prior experience needed'],
        status: 'active',
        rating: 4.9,
        reviewCount: 62,
        features: {
          virtualOption: true,
          inPerson: true,
          certificateProvided: true,
          takeHomeProduct: true,
          refreshmentsIncluded: true,
          transportationIncluded: false,
        },
      },
      {
        id: 'workshop-003',
        title: 'Silk Weaving Experience',
        description:
          "Discover the intricate art of Banarasi silk weaving. Work on traditional looms and understand the craft behind India's finest sarees.",
        craftType: 'Weaving',
        artisanId: 'artisan-003',
        artisanName: 'Abdul Rahman',
        location: {
          address: '78 Weaver Colony, Varanasi',
          city: 'Varanasi',
          state: 'Uttar Pradesh',
          country: 'India',
          coordinates: { lat: 25.32, lng: 82.97 },
        },
        duration: 5,
        difficulty: 'intermediate',
        maxParticipants: 8,
        minParticipants: 4,
        language: ['English', 'Hindi', 'Urdu'],
        price: {
          amount: 4500,
          currency: 'INR',
          includes: [
            'Loom access',
            'Silk threads',
            'Lunch',
            'Traditional tea',
            'Woven sample',
            'Certificate',
          ],
        },
        schedule: [],
        images: ['/images/workshops/weaving-1.jpg', '/images/workshops/weaving-2.jpg'],
        virtualTourUrl: '/virtual-tours/weaving-center',
        learningOutcomes: [
          'Understand silk thread preparation',
          'Learn traditional loom operation',
          'Master basic weaving patterns',
          'Appreciate the complexity of Banarasi weaving',
        ],
        materialsProvided: ['Handloom', 'Silk threads', 'Zari', 'Tools', 'Safety equipment'],
        requirements: ['Good manual dexterity', 'Patience', 'Comfortable clothing'],
        status: 'active',
        rating: 4.7,
        reviewCount: 38,
        features: {
          virtualOption: true,
          inPerson: true,
          certificateProvided: true,
          takeHomeProduct: true,
          refreshmentsIncluded: true,
          transportationIncluded: true,
        },
      },
    ];

    sampleWorkshops.forEach((workshop) => {
      this.workshops.set(workshop.id, workshop);
    });
  }

  /**
   * Get all available workshops
   */
  async getWorkshops(filters?: {
    craftType?: string;
    location?: string;
    difficulty?: string;
    priceRange?: { min: number; max: number };
    virtualOption?: boolean;
  }): Promise<Workshop[]> {
    let workshops = Array.from(this.workshops.values());

    if (filters) {
      if (filters.craftType) {
        workshops = workshops.filter(
          (w) => w.craftType.toLowerCase() === filters.craftType!.toLowerCase()
        );
      }

      if (filters.location) {
        workshops = workshops.filter(
          (w) =>
            w.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
            w.location.state.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters.difficulty) {
        workshops = workshops.filter((w) => w.difficulty === filters.difficulty);
      }

      if (filters.priceRange) {
        workshops = workshops.filter(
          (w) =>
            w.price.amount >= filters.priceRange!.min && w.price.amount <= filters.priceRange!.max
        );
      }

      if (filters.virtualOption !== undefined) {
        workshops = workshops.filter((w) => w.features.virtualOption === filters.virtualOption);
      }
    }

    return workshops.filter((w) => w.status === 'active');
  }

  /**
   * Get workshop by ID
   */
  async getWorkshopById(id: string): Promise<Workshop | null> {
    return this.workshops.get(id) || null;
  }

  /**
   * Create a new booking
   */
  async createBooking(request: BookingRequest): Promise<Booking> {
    const workshop = await this.getWorkshopById(request.workshopId);

    if (!workshop) {
      throw new Error('Workshop not found');
    }

    // Find schedule
    const schedule = workshop.schedule.find((s) => s.id === request.scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    // Check availability
    if (schedule.availableSpots < request.participants.length) {
      throw new Error('Not enough spots available');
    }

    // Create booking
    const booking: Booking = {
      id: `booking-${Date.now()}`,
      workshopId: request.workshopId,
      scheduleId: request.scheduleId,
      userId: 'user-temp', // Would come from auth
      participants: request.participants,
      bookingDate: new Date(),
      workshopDate: schedule.date,
      numberOfParticipants: request.participants.length,
      totalAmount: workshop.price.amount * request.participants.length,
      paymentStatus: 'pending',
      status: 'pending',
      confirmationCode: this.generateConfirmationCode(),
      specialRequests: request.specialRequests,
      dietaryRestrictions: request.dietaryRestrictions,
      reminderSent: false,
      feedbackSubmitted: false,
    };

    this.bookings.set(booking.id, booking);

    // Update schedule availability
    schedule.bookedSpots += request.participants.length;
    schedule.availableSpots -= request.participants.length;
    if (schedule.availableSpots === 0) {
      schedule.status = 'full';
    }

    return booking;
  }

  /**
   * Get booking by ID
   */
  async getBooking(bookingId: string): Promise<Booking | null> {
    return this.bookings.get(bookingId) || null;
  }

  /**
   * Get user bookings
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter((b) => b.userId === userId);
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string): Promise<Booking> {
    const booking = await this.getBooking(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking already cancelled');
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';

    // Update schedule availability
    const workshop = await this.getWorkshopById(booking.workshopId);
    if (workshop) {
      const schedule = workshop.schedule.find((s) => s.id === booking.scheduleId);
      if (schedule) {
        schedule.bookedSpots -= booking.numberOfParticipants;
        schedule.availableSpots += booking.numberOfParticipants;
        if (schedule.status === 'full') {
          schedule.status = 'available';
        }
      }
    }

    return booking;
  }

  /**
   * Confirm booking payment
   */
  async confirmPayment(
    bookingId: string,
    paymentId: string,
    paymentMethod: string
  ): Promise<Booking> {
    const booking = await this.getBooking(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.paymentStatus = 'paid';
    booking.paymentId = paymentId;
    booking.paymentMethod = paymentMethod;
    booking.status = 'confirmed';

    // TODO: Send confirmation email

    return booking;
  }

  /**
   * Get available schedules for workshop
   */
  async getAvailableSchedules(
    workshopId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<WorkshopSchedule[]> {
    const workshop = await this.getWorkshopById(workshopId);

    if (!workshop) {
      return [];
    }

    let schedules = workshop.schedule.filter((s) => s.status === 'available');

    if (startDate) {
      schedules = schedules.filter((s) => s.date >= startDate);
    }

    if (endDate) {
      schedules = schedules.filter((s) => s.date <= endDate);
    }

    return schedules.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Generate confirmation code
   */
  private generateConfirmationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Search workshops
   */
  async searchWorkshops(query: string): Promise<Workshop[]> {
    const searchTerm = query.toLowerCase();

    return Array.from(this.workshops.values()).filter(
      (workshop) =>
        workshop.title.toLowerCase().includes(searchTerm) ||
        workshop.description.toLowerCase().includes(searchTerm) ||
        workshop.craftType.toLowerCase().includes(searchTerm) ||
        workshop.artisanName.toLowerCase().includes(searchTerm) ||
        workshop.location.city.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get workshops by artisan
   */
  async getWorkshopsByArtisan(artisanId: string): Promise<Workshop[]> {
    return Array.from(this.workshops.values()).filter((w) => w.artisanId === artisanId);
  }

  /**
   * Get workshop statistics
   */
  async getWorkshopStats(workshopId: string) {
    const workshop = await this.getWorkshopById(workshopId);
    const bookings = Array.from(this.bookings.values()).filter((b) => b.workshopId === workshopId);

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;
    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const totalParticipants = bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.numberOfParticipants, 0);

    return {
      workshop,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
      totalParticipants,
      averageParticipantsPerSession: totalParticipants / Math.max(confirmedBookings, 1),
    };
  }
}

// Export singleton instance
export const workshopBookingService = new WorkshopBookingService();
