'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Mic,
  Package,
  Search,
  TrendingUp,
  Database,
  ShoppingCart,
  Warehouse,
  RotateCcw,
  Users,
  BarChart3,
  DollarSign,
  Target,
  Mail,
  Activity,
  Smartphone,
  Camera,
  Zap,
  MessageSquare,
  Shield,
  Lock,
  FileText,
  Server,
  Globe,
  Radio,
  Settings,
  Download,
  CheckCircle2,
} from 'lucide-react';

interface Feature {
  phase: string;
  icon: any;
  title: string;
  description: string;
  capabilities: string[];
  status: 'active' | 'beta' | 'coming-soon';
}

const features: Feature[] = [
  // Phase 5: Advanced Experience & Discovery
  {
    phase: 'Experience',
    icon: Sparkles,
    title: 'AR/VR Product Visualization',
    description: 'Immersive 3D product viewing with augmented and virtual reality support',
    capabilities: [
      '3D Model Viewing',
      'AR Try-On',
      'Virtual Showrooms',
      '360° Views',
      'Interactive Hotspots',
    ],
    status: 'active',
  },
  {
    phase: 'Experience',
    icon: Mic,
    title: 'Voice Commerce',
    description: 'Shop using voice commands with AI-powered natural language processing',
    capabilities: [
      'Voice Search',
      'Voice Ordering',
      'Voice Payments',
      'Multi-language Support',
      'Intent Recognition',
    ],
    status: 'active',
  },
  {
    phase: 'Experience',
    icon: Package,
    title: 'Subscription Services',
    description: 'Flexible subscription plans with automatic renewals and customization',
    capabilities: [
      'Monthly/Quarterly/Annual Plans',
      'Auto-renewal',
      'Pause/Resume',
      'Preference Management',
      'Tiered Membership',
    ],
    status: 'active',
  },
  {
    phase: 'Experience',
    icon: Search,
    title: 'Advanced Search',
    description: 'Multi-criteria search with AI-powered visual search and faceted filtering',
    capabilities: [
      'Visual Search',
      'Faceted Filters',
      'Auto-complete',
      'Search Analytics',
      'Zero-result Tracking',
    ],
    status: 'active',
  },
  {
    phase: 'Experience',
    icon: TrendingUp,
    title: 'Smart Recommendations',
    description: 'Personalized product recommendations using machine learning',
    capabilities: [
      'Collaborative Filtering',
      'Similar Products',
      'Cart Recommendations',
      'Trending Items',
      'User Profiling',
    ],
    status: 'active',
  },

  // Phase 6: Operations & Logistics
  {
    phase: 'Operations',
    icon: Database,
    title: 'Inventory Management',
    description: 'Real-time inventory tracking across multiple locations',
    capabilities: [
      'Multi-location Tracking',
      'Stock Alerts',
      'Demand Forecasting',
      'Stock Transfers',
      'Valuation Methods',
    ],
    status: 'active',
  },
  {
    phase: 'Operations',
    icon: ShoppingCart,
    title: 'Order Fulfillment',
    description: 'End-to-end order processing from picking to delivery',
    capabilities: [
      'Picking Tasks',
      'Packing',
      'Shipping Labels',
      'Route Optimization',
      'Status Tracking',
    ],
    status: 'active',
  },
  {
    phase: 'Operations',
    icon: Warehouse,
    title: 'Warehouse Management',
    description: 'Complete warehouse operations management system',
    capabilities: [
      'Zone Management',
      'Bin Locations',
      'Stock Movements',
      'Cycle Counting',
      'Space Optimization',
    ],
    status: 'active',
  },
  {
    phase: 'Operations',
    icon: RotateCcw,
    title: 'Returns & Refunds',
    description: 'Streamlined returns processing with automated refunds',
    capabilities: [
      'Return Requests',
      'Quality Inspection',
      'Refund Processing',
      'Exchange Management',
      'Analytics',
    ],
    status: 'active',
  },
  {
    phase: 'Operations',
    icon: Users,
    title: 'Supplier Management',
    description: 'Comprehensive supplier relationship and performance tracking',
    capabilities: [
      'Supplier Onboarding',
      'Purchase Orders',
      'Performance Ratings',
      'Contract Management',
      'Payment Tracking',
    ],
    status: 'active',
  },

  // Phase 7: Analytics & Business Intelligence
  {
    phase: 'Analytics',
    icon: BarChart3,
    title: 'Business Intelligence',
    description: 'Real-time dashboards and comprehensive business metrics',
    capabilities: [
      'Custom Dashboards',
      'KPI Tracking',
      'Drill-down Analysis',
      'Report Scheduling',
      'Data Export',
    ],
    status: 'active',
  },
  {
    phase: 'Analytics',
    icon: DollarSign,
    title: 'Sales & Revenue Analytics',
    description: 'Detailed sales performance and revenue tracking',
    capabilities: [
      'Revenue Trends',
      'Product Performance',
      'Sales Funnel',
      'Commission Tracking',
      'Cohort Analysis',
    ],
    status: 'active',
  },
  {
    phase: 'Analytics',
    icon: Target,
    title: 'Customer Analytics',
    description: 'Customer segmentation and lifetime value analysis',
    capabilities: [
      'RFM Segmentation',
      'CLV Calculation',
      'Churn Prediction',
      'Behavior Analysis',
      'Personalization',
    ],
    status: 'active',
  },
  {
    phase: 'Analytics',
    icon: Mail,
    title: 'Marketing Analytics',
    description: 'Campaign performance and marketing attribution',
    capabilities: [
      'Campaign Tracking',
      'Attribution Models',
      'ROI Analysis',
      'A/B Testing',
      'Channel Performance',
    ],
    status: 'active',
  },
  {
    phase: 'Analytics',
    icon: Activity,
    title: 'Predictive Analytics',
    description: 'AI-powered forecasting and predictive modeling',
    capabilities: [
      'Demand Forecasting',
      'Trend Analysis',
      'Risk Assessment',
      'Anomaly Detection',
      'Scenario Planning',
    ],
    status: 'active',
  },

  // Phase 8: Mobile App Development
  {
    phase: 'Mobile',
    icon: Smartphone,
    title: 'Mobile App Platform',
    description: 'Native mobile app with offline support and push notifications',
    capabilities: [
      'Device Registration',
      'Push Notifications',
      'Offline Sync',
      'Deep Linking',
      'App Updates',
    ],
    status: 'active',
  },
  {
    phase: 'Mobile',
    icon: Camera,
    title: 'Native Features',
    description: 'Access to device hardware and native capabilities',
    capabilities: [
      'Biometric Auth',
      'Camera/Gallery',
      'GPS Location',
      'Geofencing',
      'NFC/QR Scanning',
    ],
    status: 'active',
  },
  {
    phase: 'Mobile',
    icon: Zap,
    title: 'Performance Monitoring',
    description: 'Real-time app performance and crash tracking',
    capabilities: [
      'Crash Reporting',
      'Performance Metrics',
      'Network Monitoring',
      'Battery Tracking',
      'Health Scores',
    ],
    status: 'active',
  },
  {
    phase: 'Mobile',
    icon: ShoppingCart,
    title: 'Mobile Commerce',
    description: 'Optimized mobile shopping experience',
    capabilities: [
      'One-tap Purchase',
      'Mobile Wallets',
      'Quick Reorder',
      'Saved Carts',
      'Mobile Promotions',
    ],
    status: 'active',
  },
  {
    phase: 'Mobile',
    icon: MessageSquare,
    title: 'Mobile Engagement',
    description: 'User engagement and loyalty programs',
    capabilities: [
      'In-app Messaging',
      'App Ratings',
      'Referral Program',
      'Loyalty Points',
      'Achievements',
    ],
    status: 'active',
  },

  // Phase 9: Admin Dashboard & Tools
  {
    phase: 'Admin',
    icon: Users,
    title: 'User Management',
    description: 'Complete user account and permission management',
    capabilities: [
      'Role-based Access',
      'KYC Verification',
      'Account Suspension',
      'Activity Tracking',
      'Admin Users',
    ],
    status: 'active',
  },
  {
    phase: 'Admin',
    icon: Shield,
    title: 'Content Moderation',
    description: 'Automated content moderation and review system',
    capabilities: [
      'Content Reporting',
      'Moderation Rules',
      'Auto-flagging',
      'User Warnings',
      'Dispute Resolution',
    ],
    status: 'active',
  },
  {
    phase: 'Admin',
    icon: ShoppingCart,
    title: 'Order Management',
    description: 'Administrative order processing and dispute handling',
    capabilities: [
      'Order Search',
      'Status Updates',
      'Dispute Resolution',
      'Bulk Operations',
      'Order Notes',
    ],
    status: 'active',
  },
  {
    phase: 'Admin',
    icon: Package,
    title: 'Product Management',
    description: 'Product approval and catalog management',
    capabilities: [
      'Product Approval',
      'Bulk Editing',
      'Quality Checks',
      'Category Management',
      'Analytics',
    ],
    status: 'active',
  },
  {
    phase: 'Admin',
    icon: Activity,
    title: 'System Monitoring',
    description: 'Real-time system health and performance monitoring',
    capabilities: [
      'Performance Metrics',
      'Error Tracking',
      'Resource Usage',
      'Alert System',
      'Health Checks',
    ],
    status: 'active',
  },

  // Phase 10: Advanced Security & Compliance
  {
    phase: 'Security',
    icon: Shield,
    title: 'Threat Detection',
    description: 'Real-time security threat detection and prevention',
    capabilities: [
      'Brute Force Detection',
      'SQL Injection Prevention',
      'XSS Protection',
      'DDoS Mitigation',
      'IP Blocking',
    ],
    status: 'active',
  },
  {
    phase: 'Security',
    icon: Lock,
    title: 'Access Control',
    description: 'Role-based access control and permission management',
    capabilities: [
      'RBAC',
      'Permission Management',
      'Access Logs',
      'Policy Enforcement',
      'Session Management',
    ],
    status: 'active',
  },
  {
    phase: 'Security',
    icon: FileText,
    title: 'Compliance Management',
    description: 'GDPR/DPDPA compliance and data governance',
    capabilities: [
      'Consent Management',
      'Data Retention',
      'Data Requests',
      'Privacy Controls',
      'Audit Trails',
    ],
    status: 'active',
  },
  {
    phase: 'Security',
    icon: Lock,
    title: 'Encryption Service',
    description: 'End-to-end encryption for sensitive data',
    capabilities: [
      'AES-256 Encryption',
      'RSA Keys',
      'Key Rotation',
      'Encrypted Storage',
      'Secure Transmission',
    ],
    status: 'active',
  },
  {
    phase: 'Security',
    icon: Shield,
    title: 'Security Auditing',
    description: 'Comprehensive security audit and compliance tracking',
    capabilities: [
      'Audit Logging',
      'Vulnerability Scans',
      'Compliance Checks',
      'Risk Assessment',
      'Security Reports',
    ],
    status: 'active',
  },

  // Phase 11: Performance Optimization & Scaling
  {
    phase: 'Performance',
    icon: Zap,
    title: 'Caching System',
    description: 'Multi-layer caching for optimal performance',
    capabilities: [
      'Memory Cache',
      'Redis Cache',
      'CDN Cache',
      'Cache Invalidation',
      'Hit/Miss Analytics',
    ],
    status: 'active',
  },
  {
    phase: 'Performance',
    icon: Server,
    title: 'Load Balancing',
    description: 'Intelligent traffic distribution across servers',
    capabilities: [
      'Round Robin',
      'Least Connections',
      'Weighted Distribution',
      'Health Checks',
      'Failover Support',
    ],
    status: 'active',
  },
  {
    phase: 'Performance',
    icon: Database,
    title: 'Database Optimization',
    description: 'Query optimization and performance tuning',
    capabilities: [
      'Query Analysis',
      'Slow Query Detection',
      'Index Recommendations',
      'Connection Pooling',
      'Performance Stats',
    ],
    status: 'active',
  },
  {
    phase: 'Performance',
    icon: Globe,
    title: 'CDN Management',
    description: 'Global content delivery network management',
    capabilities: [
      'Multi-region CDN',
      'Asset Caching',
      'Cache Purging',
      'Bandwidth Tracking',
      'Cache Hit Rates',
    ],
    status: 'active',
  },
  {
    phase: 'Performance',
    icon: Activity,
    title: 'Auto Scaling',
    description: 'Automatic resource scaling based on demand',
    capabilities: [
      'CPU-based Scaling',
      'Memory Monitoring',
      'Request-based Scaling',
      'Cooldown Periods',
      'Scaling Policies',
    ],
    status: 'active',
  },

  // Phase 12: Third-party Integrations & APIs
  {
    phase: 'Integrations',
    icon: Globe,
    title: 'API Gateway',
    description: 'Central API gateway with rate limiting and authentication',
    capabilities: [
      'API Versioning',
      'API Keys',
      'Rate Limiting',
      'Request Logging',
      'Usage Analytics',
    ],
    status: 'active',
  },
  {
    phase: 'Integrations',
    icon: Radio,
    title: 'Webhook Management',
    description: 'Event-driven webhooks with retry policies',
    capabilities: [
      'Event Triggers',
      'Retry Policies',
      'Delivery Tracking',
      'Signature Verification',
      'Webhook Logs',
    ],
    status: 'active',
  },
  {
    phase: 'Integrations',
    icon: MessageSquare,
    title: 'Social Media Integration',
    description: 'Connect and publish to social media platforms',
    capabilities: [
      'Multi-platform Support',
      'Post Scheduling',
      'Engagement Tracking',
      'OAuth Integration',
      'Analytics',
    ],
    status: 'active',
  },
  {
    phase: 'Integrations',
    icon: Settings,
    title: 'Third-Party Services',
    description: 'Integration with external services and APIs',
    capabilities: [
      'AWS/Google Cloud',
      'Payment Gateways',
      'SMS/Email Services',
      'Connection Testing',
      'Service Analytics',
    ],
    status: 'active',
  },
  {
    phase: 'Integrations',
    icon: Download,
    title: 'Export/Import',
    description: 'Data export and import in multiple formats',
    capabilities: [
      'CSV/JSON/XML/Excel',
      'Bulk Operations',
      'Progress Tracking',
      'Validation',
      'Error Handling',
    ],
    status: 'active',
  },
];

export default function FeaturesPage() {
  const [scrolled] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  const phases = [
    'all',
    'Experience',
    'Operations',
    'Analytics',
    'Mobile',
    'Admin',
    'Security',
    'Performance',
    'Integrations',
  ];

  const filteredFeatures =
    selectedPhase === 'all' ? features : features.filter((f) => f.phase === selectedPhase);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation scrolled={scrolled} />

      <div className="mx-auto max-w-7xl px-4 py-12 pt-32 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4 text-sm">40 Enterprise Systems</Badge>
          <h1 className="mb-4 text-5xl font-bold text-slate-900">Platform Features</h1>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            Comprehensive suite of enterprise-level features powering the Indian Artisans
            Marketplace
          </p>
        </div>

        {/* Stats Banner */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-blue-600">40</div>
              <div className="mt-2 text-sm text-slate-600">Total Systems</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-green-600">8</div>
              <div className="mt-2 text-sm text-slate-600">Phases</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-purple-600">100%</div>
              <div className="mt-2 text-sm text-slate-600">Active</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-amber-600">24/7</div>
              <div className="mt-2 text-sm text-slate-600">Availability</div>
            </CardContent>
          </Card>
        </div>

        {/* Phase Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {phases.map((phase) => (
            <Button
              key={phase}
              variant={selectedPhase === phase ? 'default' : 'outline'}
              onClick={() => setSelectedPhase(phase)}
              className="capitalize"
            >
              {phase}
            </Button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-2 transition-all duration-300 hover:border-blue-500 hover:shadow-xl"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="rounded-lg bg-blue-100 p-3">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                      {feature.status}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="mb-2 w-fit">
                    {feature.phase}
                  </Badge>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="mb-2 text-sm font-semibold text-slate-700">Key Capabilities:</p>
                    {feature.capabilities.map((capability, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span className="text-sm text-slate-600">{capability}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader className="text-center">
            <CardTitle className="mb-2 text-3xl">Ready to Experience All Features?</CardTitle>
            <CardDescription className="text-lg text-blue-100">
              Access the admin dashboard to see all 40 systems in action
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <a href="/admin">View Admin Dashboard</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-white/10 text-white hover:bg-white/20"
              asChild
            >
              <a href="/api/systems">API Documentation</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}
