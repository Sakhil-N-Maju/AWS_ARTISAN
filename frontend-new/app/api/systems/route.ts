import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/api-middleware';
import { apiClient } from '@/lib/api-client';

async function handleGET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const system = searchParams.get('system');

  // Forward request to backend API
  const endpoint = system ? `/api/systems/${system}` : '/api/systems';
  
  try {
    const data = await apiClient.request({
      method: 'GET',
      url: endpoint,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    // If backend is not available, return mock data for development
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404) {
      console.warn('Backend not available, returning mock data');
      return getMockSystemStats(system);
    }
    throw error;
  }
}

// Mock data fallback for development
function getMockSystemStats(system: string | null) {
  const mockStats = {
    totalSystems: 40,
    totalRequests: 15234,
    averageResponseTime: 142,
    uptime: 99.8,
  };

  const allStats = {
    // Phase 5: Advanced Experience & Discovery
    arvrSystem: { total3DModels: 150, totalARSessions: 2341, totalVRSessions: 890 },
    voiceCommerce: { totalSessions: 1245, totalCommands: 4567, averageAccuracy: 94.5 },
    subscriptions: { totalSubscriptions: 567, active: 489, revenue: 45000 },
    advancedSearch: { totalSearches: 8934, avgResponseTime: 120, zeroResults: 45 },
    recommendations: { totalRecommendations: 12000, clickRate: 23.4, conversionRate: 12.1 },

    // Phase 6: Operations & Logistics
    inventory: { totalItems: 3421, lowStock: 23, outOfStock: 5, totalValue: 456789 },
    orderFulfillment: { totalOrders: 2345, pending: 45, processing: 123, completed: 2177 },
    warehouse: { totalWarehouses: 5, totalZones: 25, totalBins: 450, utilizationRate: 78 },
    returnsRefunds: { totalReturns: 123, pending: 12, approved: 98, rejected: 13 },
    suppliers: { totalSuppliers: 45, active: 42, avgRating: 4.5, totalPOs: 890 },

    // Phase 7: Analytics & Business Intelligence
    businessIntelligence: { totalDashboards: 15, totalReports: 45, activeUsers: 23 },
    salesAnalytics: { totalRevenue: 567890, avgOrderValue: 234, conversionRate: 3.4 },
    customerAnalytics: { totalCustomers: 12345, activeCustomers: 8234, avgCLV: 450 },
    marketingAnalytics: { totalCampaigns: 34, activeUsers: 12000, roi: 3.4 },
    predictiveAnalytics: { totalForecasts: 45, accuracy: 89.5, trends: 23 },

    // Phase 8: Mobile App Development
    mobileApp: { totalDevices: 5432, activeUsers: 3456, pushNotifications: 12345 },
    nativeFeatures: { biometricAuth: 2341, qrScans: 1234, nfcReads: 567 },
    appPerformance: { crashes: 12, avgFPS: 58, avgMemory: 145, healthScore: 94 },
    mobileCommerce: { mobileOrders: 1234, oneTapPurchases: 567, walletTransactions: 890 },
    mobileEngagement: { inAppMessages: 456, ratings: 234, loyaltyPoints: 234567 },

    // Phase 9: Admin Dashboard & Tools
    userManagement: { totalUsers: 12456, admins: 12, suspended: 23, kycPending: 45 },
    contentModeration: { totalReports: 234, pending: 45, approved: 167, rejected: 22 },
    orderManagement: { ordersManaged: 2345, disputes: 23, resolved: 2300 },
    productManagement: { totalProducts: 3421, pending: 45, approved: 3301, rejected: 75 },
    systemMonitor: { cpuUsage: 45, memoryUsage: 67, activeConnections: 234, alerts: 5 },

    // Phase 10: Advanced Security & Compliance
    threatDetection: { threats: 123, blocked: 120, ipsBanned: 45, active: 3 },
    accessControl: { totalRoles: 15, totalPermissions: 89, accessLogs: 45678 },
    compliance: { consentRecords: 12345, dataRequests: 45, retentionPolicies: 12 },
    encryption: { totalKeys: 34, rotatedKeys: 12, encryptedRecords: 234567 },
    securityAudit: { totalAudits: 45, vulnerabilities: 12, resolved: 10, pending: 2 },

    // Phase 11: Performance Optimization & Scaling
    caching: { hitRate: 89.5, missRate: 10.5, totalCached: 234567, size: 4567 },
    loadBalancer: { totalServers: 12, activeServers: 11, requestsBalanced: 456789 },
    databaseOptimization: { slowQueries: 23, optimized: 456, avgQueryTime: 45 },
    cdn: { totalEndpoints: 8, bandwidth: 567890, cacheHitRate: 94.5 },
    autoScaling: { scalingEvents: 45, scaleUps: 23, scaleDowns: 22 },

    // Phase 12: Third-party Integrations & APIs
    apiGateway: { totalEndpoints: 45, totalAPIKeys: 123, totalRequests: 456789 },
    webhooks: { totalWebhooks: 34, totalDeliveries: 12345, successRate: 98.5 },
    socialMedia: { totalAccounts: 23, totalPosts: 456, totalEngagement: 12345 },
    thirdPartyServices: { totalIntegrations: 15, totalCalls: 45678, successRate: 99.2 },
    exportImport: { totalExports: 123, totalImports: 89, recordsProcessed: 234567 },
  };

  if (!system) {
    return NextResponse.json({
      success: true,
      totalSystems: 40,
      stats: mockStats,
      data: allStats,
      _mock: true,
    });
  }

  // Return specific system stats
  const systemData = (allStats as any)[system];
  if (systemData) {
    return NextResponse.json({ success: true, system, data: systemData, _mock: true });
  }

  return NextResponse.json({ success: false, error: 'System not found' }, { status: 404 });
}

export const GET = withErrorHandling(handleGET);
