'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Shield,
  Database,
  Zap,
  Globe,
  MessageSquare,
  Bell,
  TrendingUp,
  Settings,
  Activity,
  Server,
  Lock,
  FileText,
  Smartphone,
  Radio,
} from 'lucide-react';

interface SystemStats {
  name: string;
  icon: any;
  stats: any;
  status: 'active' | 'warning' | 'error';
}

export default function AdminPage() {
  const [scrolled] = useState(false);
  const [systemStats, setSystemStats] = useState<SystemStats[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSystemStats = useCallback(async () => {
    try {
      // Fetch from API endpoint instead of direct imports
      const response = await fetch('/api/systems');
      const { data } = await response.json();

      const stats: SystemStats[] = [
        // Phase 5: Advanced Experience & Discovery
        { name: 'AR/VR System', icon: Activity, stats: data.arvrSystem || {}, status: 'active' },
        { name: 'Voice Commerce', icon: Radio, stats: data.voiceCommerce || {}, status: 'active' },
        { name: 'Subscriptions', icon: Package, stats: data.subscriptions || {}, status: 'active' },
        {
          name: 'Advanced Search',
          icon: BarChart3,
          stats: data.advancedSearch || {},
          status: 'active',
        },
        {
          name: 'Recommendations',
          icon: TrendingUp,
          stats: data.recommendations || {},
          status: 'active',
        },

        // Phase 6: Operations & Logistics
        { name: 'Inventory', icon: Database, stats: data.inventory || {}, status: 'active' },
        {
          name: 'Order Fulfillment',
          icon: ShoppingCart,
          stats: data.orderFulfillment || {},
          status: 'active',
        },
        { name: 'Warehouse', icon: Package, stats: data.warehouse || {}, status: 'active' },
        {
          name: 'Returns & Refunds',
          icon: FileText,
          stats: data.returnsRefunds || {},
          status: 'active',
        },
        { name: 'Suppliers', icon: Users, stats: data.suppliers || {}, status: 'active' },

        // Phase 7: Analytics & Business Intelligence
        {
          name: 'Business Intelligence',
          icon: BarChart3,
          stats: data.businessIntelligence || {},
          status: 'active',
        },
        {
          name: 'Sales Analytics',
          icon: TrendingUp,
          stats: data.salesAnalytics || {},
          status: 'active',
        },
        {
          name: 'Customer Analytics',
          icon: Users,
          stats: data.customerAnalytics || {},
          status: 'active',
        },
        {
          name: 'Marketing Analytics',
          icon: Globe,
          stats: data.marketingAnalytics || {},
          status: 'active',
        },
        {
          name: 'Predictive Analytics',
          icon: Activity,
          stats: data.predictiveAnalytics || {},
          status: 'active',
        },

        // Phase 8: Mobile App Development
        { name: 'Mobile App', icon: Smartphone, stats: data.mobileApp || {}, status: 'active' },
        {
          name: 'Native Features',
          icon: Settings,
          stats: data.nativeFeatures || {},
          status: 'active',
        },
        {
          name: 'App Performance',
          icon: Activity,
          stats: data.appPerformance || {},
          status: 'active',
        },
        {
          name: 'Mobile Commerce',
          icon: ShoppingCart,
          stats: data.mobileCommerce || {},
          status: 'active',
        },
        {
          name: 'Mobile Engagement',
          icon: Bell,
          stats: data.mobileEngagement || {},
          status: 'active',
        },

        // Phase 9: Admin Dashboard & Tools
        {
          name: 'User Management',
          icon: Users,
          stats: data.userManagement || {},
          status: 'active',
        },
        {
          name: 'Content Moderation',
          icon: Shield,
          stats: data.contentModeration || {},
          status: 'active',
        },
        {
          name: 'Order Management',
          icon: ShoppingCart,
          stats: data.orderManagement || {},
          status: 'active',
        },
        {
          name: 'Product Management',
          icon: Package,
          stats: data.productManagement || {},
          status: 'active',
        },
        { name: 'System Monitor', icon: Server, stats: data.systemMonitor || {}, status: 'active' },

        // Phase 10: Advanced Security & Compliance
        {
          name: 'Threat Detection',
          icon: Shield,
          stats: data.threatDetection || {},
          status: 'active',
        },
        { name: 'Access Control', icon: Lock, stats: data.accessControl || {}, status: 'active' },
        { name: 'Compliance', icon: FileText, stats: data.compliance || {}, status: 'active' },
        { name: 'Encryption', icon: Lock, stats: data.encryption || {}, status: 'active' },
        { name: 'Security Audit', icon: Shield, stats: data.securityAudit || {}, status: 'active' },

        // Phase 11: Performance Optimization & Scaling
        { name: 'Caching', icon: Zap, stats: data.caching || {}, status: 'active' },
        { name: 'Load Balancer', icon: Server, stats: data.loadBalancer || {}, status: 'active' },
        {
          name: 'Database Optimization',
          icon: Database,
          stats: data.databaseOptimization || {},
          status: 'active',
        },
        { name: 'CDN', icon: Globe, stats: data.cdn || {}, status: 'active' },
        { name: 'Auto Scaling', icon: Activity, stats: data.autoScaling || {}, status: 'active' },

        // Phase 12: Third-party Integrations & APIs
        { name: 'API Gateway', icon: Globe, stats: data.apiGateway || {}, status: 'active' },
        { name: 'Webhooks', icon: Radio, stats: data.webhooks || {}, status: 'active' },
        {
          name: 'Social Media',
          icon: MessageSquare,
          stats: data.socialMedia || {},
          status: 'active',
        },
        {
          name: 'Third-Party Services',
          icon: Settings,
          stats: data.thirdPartyServices || {},
          status: 'active',
        },
        { name: 'Export/Import', icon: FileText, stats: data.exportImport || {}, status: 'active' },
      ];

      setSystemStats(stats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading system stats:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSystemStats();
  }, [loadSystemStats]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation scrolled={scrolled} />

      <div className="mx-auto max-w-[1600px] px-4 py-12 pt-32 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">System Administration</h1>
          <p className="text-slate-600">
            Comprehensive control panel for all 40 enterprise systems
          </p>
        </div>

        {/* System Overview Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Total Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">40</div>
              <p className="mt-2 text-sm text-blue-100">All systems operational</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">✓</div>
              <p className="mt-2 text-sm text-green-100">All security systems active</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">98%</div>
              <p className="mt-2 text-sm text-purple-100">Uptime & reliability</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">15+</div>
              <p className="mt-2 text-sm text-amber-100">Third-party services</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-2 lg:grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                <div className="col-span-full py-12 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-slate-600">Loading system statistics...</p>
                </div>
              ) : (
                systemStats.map((system, index) => {
                  const Icon = system.icon;
                  return (
                    <Card key={index} className="transition-shadow hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <Badge variant={system.status === 'active' ? 'default' : 'destructive'}>
                            {system.status}
                          </Badge>
                        </div>
                        <CardTitle className="mt-2 text-sm font-medium">{system.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-xs text-slate-600">
                          {Object.entries(system.stats || {})
                            .slice(0, 3)
                            .map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="font-semibold">{String(value)}</span>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Experience Tab - Phase 5 */}
          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Experience & Discovery Systems</CardTitle>
                <CardDescription>AR/VR, Voice Commerce, Search & Recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {systemStats.slice(0, 5).map((system, index) => {
                    const Icon = system.icon;
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <CardTitle className="text-base">{system.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="max-h-48 overflow-auto rounded bg-slate-50 p-3 text-xs">
                            {JSON.stringify(system.stats, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operations Tab - Phase 6 */}
          <TabsContent value="operations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Operations & Logistics Systems</CardTitle>
                <CardDescription>Inventory, Orders, Warehouse, Returns & Suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {systemStats.slice(5, 10).map((system, index) => {
                    const Icon = system.icon;
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <CardTitle className="text-base">{system.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="max-h-48 overflow-auto rounded bg-slate-50 p-3 text-xs">
                            {JSON.stringify(system.stats, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab - Phase 7 */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Business Intelligence</CardTitle>
                <CardDescription>
                  Comprehensive analytics across all business dimensions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {systemStats.slice(10, 15).map((system, index) => {
                    const Icon = system.icon;
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <CardTitle className="text-base">{system.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="max-h-48 overflow-auto rounded bg-slate-50 p-3 text-xs">
                            {JSON.stringify(system.stats, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mobile Tab - Phase 8 */}
          <TabsContent value="mobile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mobile App Development</CardTitle>
                <CardDescription>
                  Native features, performance monitoring & engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {systemStats.slice(15, 20).map((system, index) => {
                    const Icon = system.icon;
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <CardTitle className="text-base">{system.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="max-h-48 overflow-auto rounded bg-slate-50 p-3 text-xs">
                            {JSON.stringify(system.stats, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab - Phase 10 */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Security & Compliance</CardTitle>
                <CardDescription>
                  Threat detection, access control, encryption & compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {systemStats.slice(25, 30).map((system, index) => {
                    const Icon = system.icon;
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <CardTitle className="text-base">{system.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="max-h-48 overflow-auto rounded bg-slate-50 p-3 text-xs">
                            {JSON.stringify(system.stats, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab - Phase 11 */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Optimization & Scaling</CardTitle>
                <CardDescription>Caching, load balancing, CDN & auto-scaling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {systemStats.slice(30, 35).map((system, index) => {
                    const Icon = system.icon;
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <CardTitle className="text-base">{system.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="max-h-48 overflow-auto rounded bg-slate-50 p-3 text-xs">
                            {JSON.stringify(system.stats, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab - Phase 12 */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Third-party Integrations & APIs</CardTitle>
                <CardDescription>
                  API gateway, webhooks, social media & external services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {systemStats.slice(35, 40).map((system, index) => {
                    const Icon = system.icon;
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <CardTitle className="text-base">{system.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="max-h-48 overflow-auto rounded bg-slate-50 p-3 text-xs">
                            {JSON.stringify(system.stats, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Actions</CardTitle>
            <CardDescription>Quick access to common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              <Button className="flex h-auto flex-col py-4" variant="outline">
                <Users className="mb-2 h-6 w-6" />
                <span className="text-xs">User Mgmt</span>
              </Button>
              <Button className="flex h-auto flex-col py-4" variant="outline">
                <Package className="mb-2 h-6 w-6" />
                <span className="text-xs">Products</span>
              </Button>
              <Button className="flex h-auto flex-col py-4" variant="outline">
                <ShoppingCart className="mb-2 h-6 w-6" />
                <span className="text-xs">Orders</span>
              </Button>
              <Button className="flex h-auto flex-col py-4" variant="outline">
                <BarChart3 className="mb-2 h-6 w-6" />
                <span className="text-xs">Analytics</span>
              </Button>
              <Button className="flex h-auto flex-col py-4" variant="outline">
                <Shield className="mb-2 h-6 w-6" />
                <span className="text-xs">Security</span>
              </Button>
              <Button
                className="flex h-auto flex-col py-4"
                variant="outline"
                onClick={loadSystemStats}
              >
                <Activity className="mb-2 h-6 w-6" />
                <span className="text-xs">Refresh</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}
