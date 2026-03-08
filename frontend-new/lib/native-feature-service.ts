/**
 * Native Feature Service
 *
 * Handles native mobile device features:
 * - Biometric authentication (Face ID, Touch ID, fingerprint)
 * - Camera and gallery access
 * - Location services and geofencing
 * - Contacts and calendar integration
 * - Device sensors (accelerometer, gyroscope)
 * - NFC and QR code scanning
 */

export interface BiometricAuth {
  id: string;
  userId: string;
  deviceId: string;
  type: 'face_id' | 'touch_id' | 'fingerprint' | 'iris';
  enrolled: boolean;
  enrolledAt?: Date;
  lastUsed?: Date;
  successfulAttempts: number;
  failedAttempts: number;
}

export interface CameraCapture {
  id: string;
  userId: string;
  deviceId: string;
  type: 'photo' | 'video' | 'qr_code' | 'barcode' | 'document';
  capturedAt: Date;
  fileUrl: string;
  fileSize: number;
  resolution: string;
  metadata?: {
    location?: { lat: number; lng: number };
    orientation?: number;
    flash?: boolean;
  };
}

export interface LocationData {
  id: string;
  userId: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
  source: 'gps' | 'network' | 'manual';
}

export interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  active: boolean;
  createdAt: Date;
  triggers: {
    userId: string;
    event: 'enter' | 'exit';
    timestamp: Date;
  }[];
}

export interface ContactAccess {
  id: string;
  userId: string;
  deviceId: string;
  permissionGranted: boolean;
  grantedAt?: Date;
  contactsShared: number;
  lastSync?: Date;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  deviceId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  reminder?: number; // minutes before
  recurrence?: 'daily' | 'weekly' | 'monthly';
  attendees?: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface SensorData {
  id: string;
  userId: string;
  deviceId: string;
  sensorType: 'accelerometer' | 'gyroscope' | 'magnetometer' | 'proximity' | 'light';
  readings: {
    x?: number;
    y?: number;
    z?: number;
    value?: number;
    timestamp: Date;
  }[];
  recordedAt: Date;
}

export interface NFCScan {
  id: string;
  userId: string;
  deviceId: string;
  tagId: string;
  tagType: 'product' | 'payment' | 'access' | 'loyalty';
  data: Record<string, any>;
  scannedAt: Date;
}

export interface QRCodeScan {
  id: string;
  userId: string;
  deviceId: string;
  content: string;
  type: 'url' | 'product' | 'payment' | 'contact' | 'text';
  scannedAt: Date;
  action?: string;
}

export class NativeFeatureService {
  private biometricAuths: Map<string, BiometricAuth> = new Map();
  private cameraCaptures: Map<string, CameraCapture> = new Map();
  private locationData: Map<string, LocationData> = new Map();
  private geofences: Map<string, Geofence> = new Map();
  private contactAccess: Map<string, ContactAccess> = new Map();
  private calendarEvents: Map<string, CalendarEvent> = new Map();
  private sensorData: Map<string, SensorData> = new Map();
  private nfcScans: Map<string, NFCScan> = new Map();
  private qrCodeScans: Map<string, QRCodeScan> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  /**
   * Enroll biometric authentication
   */
  async enrollBiometric(data: {
    userId: string;
    deviceId: string;
    type: BiometricAuth['type'];
  }): Promise<BiometricAuth> {
    const auth: BiometricAuth = {
      id: `bio-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      type: data.type,
      enrolled: true,
      enrolledAt: new Date(),
      successfulAttempts: 0,
      failedAttempts: 0,
    };

    this.biometricAuths.set(auth.id, auth);
    return auth;
  }

  /**
   * Verify biometric authentication
   */
  async verifyBiometric(
    userId: string,
    deviceId: string,
    success: boolean
  ): Promise<{
    verified: boolean;
    method?: BiometricAuth['type'];
  }> {
    const auth = Array.from(this.biometricAuths.values()).find(
      (a) => a.userId === userId && a.deviceId === deviceId && a.enrolled
    );

    if (!auth) {
      return { verified: false };
    }

    if (success) {
      auth.successfulAttempts++;
      auth.lastUsed = new Date();
      this.biometricAuths.set(auth.id, auth);
      return { verified: true, method: auth.type };
    } else {
      auth.failedAttempts++;
      this.biometricAuths.set(auth.id, auth);
      return { verified: false };
    }
  }

  /**
   * Capture photo/video
   */
  async captureMedia(data: {
    userId: string;
    deviceId: string;
    type: CameraCapture['type'];
    fileUrl: string;
    fileSize: number;
    resolution: string;
    metadata?: CameraCapture['metadata'];
  }): Promise<CameraCapture> {
    const capture: CameraCapture = {
      id: `capture-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      type: data.type,
      capturedAt: new Date(),
      fileUrl: data.fileUrl,
      fileSize: data.fileSize,
      resolution: data.resolution,
      metadata: data.metadata,
    };

    this.cameraCaptures.set(capture.id, capture);
    return capture;
  }

  /**
   * Get user's camera captures
   */
  async getUserCaptures(userId: string, type?: CameraCapture['type']): Promise<CameraCapture[]> {
    return Array.from(this.cameraCaptures.values())
      .filter((c) => c.userId === userId && (!type || c.type === type))
      .sort((a, b) => b.capturedAt.getTime() - a.capturedAt.getTime());
  }

  /**
   * Track location
   */
  async trackLocation(data: {
    userId: string;
    deviceId: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number;
    heading?: number;
    speed?: number;
    source?: LocationData['source'];
  }): Promise<LocationData> {
    const location: LocationData = {
      id: `loc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      altitude: data.altitude,
      heading: data.heading,
      speed: data.speed,
      timestamp: new Date(),
      source: data.source || 'gps',
    };

    this.locationData.set(location.id, location);

    // Check geofences
    await this.checkGeofences(data.userId, data.latitude, data.longitude);

    return location;
  }

  /**
   * Get user's location history
   */
  async getLocationHistory(userId: string, limit: number = 100): Promise<LocationData[]> {
    return Array.from(this.locationData.values())
      .filter((l) => l.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Create geofence
   */
  async createGeofence(data: {
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
  }): Promise<Geofence> {
    const geofence: Geofence = {
      id: `fence-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      radius: data.radius,
      active: true,
      createdAt: new Date(),
      triggers: [],
    };

    this.geofences.set(geofence.id, geofence);
    return geofence;
  }

  /**
   * Check geofences
   */
  private async checkGeofences(userId: string, latitude: number, longitude: number): Promise<void> {
    const activeGeofences = Array.from(this.geofences.values()).filter((g) => g.active);

    for (const geofence of activeGeofences) {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        geofence.latitude,
        geofence.longitude
      );

      const wasInside =
        geofence.triggers.filter((t) => t.userId === userId).slice(-1)[0]?.event === 'enter';

      const isInside = distance <= geofence.radius;

      if (isInside && !wasInside) {
        geofence.triggers.push({
          userId,
          event: 'enter',
          timestamp: new Date(),
        });
        this.geofences.set(geofence.id, geofence);
      } else if (!isInside && wasInside) {
        geofence.triggers.push({
          userId,
          event: 'exit',
          timestamp: new Date(),
        });
        this.geofences.set(geofence.id, geofence);
      }
    }
  }

  /**
   * Request contact access
   */
  async requestContactAccess(userId: string, deviceId: string): Promise<ContactAccess> {
    const existing = Array.from(this.contactAccess.values()).find(
      (c) => c.userId === userId && c.deviceId === deviceId
    );

    if (existing) {
      return existing;
    }

    const access: ContactAccess = {
      id: `contact-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      deviceId,
      permissionGranted: true,
      grantedAt: new Date(),
      contactsShared: 0,
    };

    this.contactAccess.set(access.id, access);
    return access;
  }

  /**
   * Sync contacts
   */
  async syncContacts(userId: string, deviceId: string, contactCount: number): Promise<void> {
    const access = Array.from(this.contactAccess.values()).find(
      (c) => c.userId === userId && c.deviceId === deviceId
    );

    if (access && access.permissionGranted) {
      access.contactsShared = contactCount;
      access.lastSync = new Date();
      this.contactAccess.set(access.id, access);
    }
  }

  /**
   * Create calendar event
   */
  async createCalendarEvent(data: {
    userId: string;
    deviceId: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    reminder?: number;
    recurrence?: CalendarEvent['recurrence'];
    attendees?: string[];
  }): Promise<CalendarEvent> {
    const event: CalendarEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      reminder: data.reminder,
      recurrence: data.recurrence,
      attendees: data.attendees,
      status: 'scheduled',
    };

    this.calendarEvents.set(event.id, event);
    return event;
  }

  /**
   * Get calendar events
   */
  async getCalendarEvents(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<CalendarEvent[]> {
    return Array.from(this.calendarEvents.values())
      .filter((e) => {
        if (e.userId !== userId) return false;
        if (startDate && e.endTime < startDate) return false;
        if (endDate && e.startTime > endDate) return false;
        return true;
      })
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  /**
   * Record sensor data
   */
  async recordSensorData(data: {
    userId: string;
    deviceId: string;
    sensorType: SensorData['sensorType'];
    readings: SensorData['readings'];
  }): Promise<SensorData> {
    const sensorData: SensorData = {
      id: `sensor-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      sensorType: data.sensorType,
      readings: data.readings,
      recordedAt: new Date(),
    };

    this.sensorData.set(sensorData.id, sensorData);
    return sensorData;
  }

  /**
   * Scan NFC tag
   */
  async scanNFC(data: {
    userId: string;
    deviceId: string;
    tagId: string;
    tagType: NFCScan['tagType'];
    data: Record<string, any>;
  }): Promise<NFCScan> {
    const scan: NFCScan = {
      id: `nfc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      tagId: data.tagId,
      tagType: data.tagType,
      data: data.data,
      scannedAt: new Date(),
    };

    this.nfcScans.set(scan.id, scan);
    return scan;
  }

  /**
   * Scan QR code
   */
  async scanQRCode(data: {
    userId: string;
    deviceId: string;
    content: string;
    type: QRCodeScan['type'];
    action?: string;
  }): Promise<QRCodeScan> {
    const scan: QRCodeScan = {
      id: `qr-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      content: data.content,
      type: data.type,
      scannedAt: new Date(),
      action: data.action,
    };

    this.qrCodeScans.set(scan.id, scan);
    return scan;
  }

  /**
   * Get analytics
   */
  async getAnalytics(): Promise<{
    biometricEnrollments: number;
    biometricSuccessRate: number;
    cameraCaptures: number;
    locationTracking: { active: number; total: number };
    activeGeofences: number;
    contactPermissions: number;
    calendarEvents: number;
    nfcScans: number;
    qrCodeScans: number;
  }> {
    const enrolledBiometrics = Array.from(this.biometricAuths.values()).filter((b) => b.enrolled);

    const totalAttempts = enrolledBiometrics.reduce(
      (sum, b) => sum + b.successfulAttempts + b.failedAttempts,
      0
    );
    const successfulAttempts = enrolledBiometrics.reduce((sum, b) => sum + b.successfulAttempts, 0);

    const activeLocations = new Set(
      Array.from(this.locationData.values())
        .filter((l) => l.timestamp > new Date(Date.now() - 3600000))
        .map((l) => l.userId)
    ).size;

    return {
      biometricEnrollments: enrolledBiometrics.length,
      biometricSuccessRate: totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0,
      cameraCaptures: this.cameraCaptures.size,
      locationTracking: {
        active: activeLocations,
        total: this.locationData.size,
      },
      activeGeofences: Array.from(this.geofences.values()).filter((g) => g.active).length,
      contactPermissions: Array.from(this.contactAccess.values()).filter((c) => c.permissionGranted)
        .length,
      calendarEvents: Array.from(this.calendarEvents.values()).filter(
        (e) => e.status === 'scheduled'
      ).length,
      nfcScans: this.nfcScans.size,
      qrCodeScans: this.qrCodeScans.size,
    };
  }

  /**
   * Helper: Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Helper: Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Initialize default data
   */
  private initializeDefaultData(): void {
    // Sample geofences for stores
    this.createGeofence({
      name: 'Mumbai Artisan Store',
      latitude: 19.076,
      longitude: 72.8777,
      radius: 100,
    });

    this.createGeofence({
      name: 'Delhi Craft Center',
      latitude: 28.6139,
      longitude: 77.209,
      radius: 150,
    });
  }
}

// Singleton instance
export const nativeFeatureService = new NativeFeatureService();
