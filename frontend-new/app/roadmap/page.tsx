'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Rocket,
  Globe,
  Shield,
  Sparkles,
  Users,
  DollarSign,
  Mic,
  Camera,
  BookOpen,
  Calendar,
  TrendingUp,
  Lock,
  Award,
  BarChart3,
  Zap,
  CheckCircle2,
  Building2,
  MapPin,
  Crown,
  Brain,
  Package,
  Search,
  MessageSquare,
  ShieldCheck,
  Workflow,
  FileCheck,
  Landmark,
  ChevronRight,
} from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: any;
  status?: 'planned' | 'in-progress' | 'completed';
}

interface Phase {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  goals: {
    artisans?: string;
    gmv?: string;
    other: string[];
  };
  features: {
    category: string;
    items: Feature[];
  }[];
  outcomes: string[];
}

export default function Roadmap() {
  const [scrolled] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState('phase1');

  const phases: Phase[] = [
    {
      id: 'phase1',
      name: 'Phase 1: Trustworthy MVP',
      tagline: 'Build the Foundation',
      duration: '0-6 Months',
      goals: {
        artisans: '1,000 Artisans',
        gmv: '₹50-100 Cr GMV',
        other: ['Rock-solid Infrastructure', 'DPDP-Ready Compliance'],
      },
      features: [
        {
          category: 'Voice-First AI Interface',
          items: [
            {
              title: 'WhatsApp-Based Multi-Language Support',
              description:
                'Support for 12+ Indian languages with auto-triage for registration, listings, orders, and support',
              icon: MessageSquare,
              status: 'planned',
            },
            {
              title: 'Vernacular Speech-to-Text',
              description:
                'Context-aware translation (EN ↔ local language) with original text preserved in UI',
              icon: Mic,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Product Listing via Voice + Image',
          items: [
            {
              title: 'AI-Powered Product Creation',
              description:
                'Image + voice → complete product listing with category, variants, and inventory pre-filled',
              icon: Camera,
              status: 'planned',
            },
            {
              title: 'Multi-Model Pipeline',
              description: 'Gemini multimodal primary, OpenAI fallback with full instrumentation',
              icon: Workflow,
              status: 'planned',
            },
          ],
        },
        {
          category: 'AI Cultural Storytelling',
          items: [
            {
              title: 'Automated Storyteller v2',
              description:
                'Generate SEO title, description, craft story, artisan profile, and social captions in 2-3 languages',
              icon: BookOpen,
              status: 'planned',
            },
            {
              title: 'Cultural Heritage Database',
              description: 'Auto-detect GI/UNESCO crafts and integrate cultural context',
              icon: Landmark,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Consumer Storefront & Discovery',
          items: [
            {
              title: 'No-Login Checkout',
              description: 'Seamless checkout with filters by craft type, region, and price',
              icon: Package,
              status: 'planned',
            },
            {
              title: 'SEO Optimization',
              description:
                'Structured data (Schema.org JSON-LD), OG/Twitter tags for rich snippets',
              icon: Search,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Payments, Orders & Logistics',
          items: [
            {
              title: 'Razorpay Integration',
              description: 'UPI, cards, netbanking with webhooks and 97%+ success target',
              icon: DollarSign,
              status: 'planned',
            },
            {
              title: 'Logistics Integration',
              description: 'India Post/Shiprocket for labels and tracking',
              icon: Package,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Enterprise Instrumentation v1',
          items: [
            {
              title: 'Request Tracing',
              description:
                'Request IDs propagated across services with structured logs and latency metrics',
              icon: BarChart3,
              status: 'planned',
            },
            {
              title: 'Monitoring Dashboard',
              description:
                'Prometheus export, health endpoints, API latency and LLM usage tracking',
              icon: TrendingUp,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Compliance & Security Foundation',
          items: [
            {
              title: 'DPDP Compliance',
              description:
                'Cookie consent, privacy policy, consent logging, and easy data withdrawal',
              icon: Shield,
              status: 'planned',
            },
            {
              title: 'Secure Authentication',
              description: 'Role-based auth, secure sessions, CSRF protection',
              icon: Lock,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Analytics Dashboard',
          items: [
            {
              title: 'Artisan & Admin Analytics',
              description:
                'Daily/weekly sales, top products, ratings, cancellations with cluster/region filters',
              icon: BarChart3,
              status: 'planned',
            },
          ],
        },
      ],
      outcomes: [
        '1,000+ artisans onboarded',
        '500K products listed',
        '85%+ onboarding completion rate',
        '₹50-100 Cr GMV achieved',
        'DPDP baseline compliance in place',
        'Solid infrastructure foundation',
      ],
    },
    {
      id: 'phase2a',
      name: 'Phase 2A: Experience + Trust + Heritage',
      tagline: 'Build Trust & Enable Tourism',
      duration: '7-9 Months',
      goals: {
        other: [
          'Experience Economy Revenue',
          'Deep Trust Infrastructure',
          'Government/MSME Alignment',
        ],
      },
      features: [
        {
          category: 'Workshop Tourism & Studio Visits',
          items: [
            {
              title: 'Workshop Listings',
              description:
                'Schedule, capacity, price, skill level, materials included with calendar booking',
              icon: Calendar,
              status: 'planned',
            },
            {
              title: 'Booking & Payments',
              description:
                'Online payment, geo-location directions, WhatsApp reminders, post-visit reviews',
              icon: MapPin,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Workshop Marketplace UX',
          items: [
            {
              title: 'Experience Discovery',
              description:
                '"Experiences near you" with search by craft, city, price, duration, endangered craft risk',
              icon: Search,
              status: 'planned',
            },
            {
              title: 'Tourism Integration',
              description: 'Connect platform to craft tourism and local economic development',
              icon: Globe,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Advanced Authenticity Certificate System',
          items: [
            {
              title: 'Blockchain Provenance',
              description:
                'SHA-256 hash stored on Polygon L2 with public verification and integrity status',
              icon: ShieldCheck,
              status: 'planned',
            },
            {
              title: 'QR Code Verification',
              description:
                'Real SVG QR codes with public verification page and "verified" badge in search',
              icon: Award,
              status: 'planned',
            },
            {
              title: 'Revocation System',
              description: 'Audit trail for counterfeits, disputes with immutable logging',
              icon: FileCheck,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Cultural Heritage Database',
          items: [
            {
              title: 'Craft Registry',
              description:
                'UNESCO/GI status, risk levels, regions, practitioner count, revival initiatives',
              icon: Landmark,
              status: 'planned',
            },
            {
              title: 'Search Integration',
              description:
                'Powers storytelling, "support endangered crafts" filters, and impact reporting',
              icon: Search,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Security & Compliance Hub',
          items: [
            {
              title: 'DPDP Dashboard',
              description: 'Consents, DSARs, breach log, retention views for admins',
              icon: Shield,
              status: 'planned',
            },
            {
              title: 'Audit Logging',
              description: 'Immutable append-only audit log for payments, payouts, certificates',
              icon: FileCheck,
              status: 'planned',
            },
            {
              title: 'Fraud Alerts',
              description: 'Risk scores, status tracking, automated actions',
              icon: ShieldCheck,
              status: 'planned',
            },
          ],
        },
      ],
      outcomes: [
        '500+ workshops listed',
        '₹2-3 Cr monthly workshop GMV',
        '100% transaction auditability',
        'Provenance system live',
        'DPDP and GST audit compliance',
        'Cultural heritage database operational',
      ],
    },
    {
      id: 'phase2b',
      name: 'Phase 2B: Intelligence & Automation',
      tagline: 'Platform Runs Itself',
      duration: '10-12 Months',
      goals: {
        other: ['AI Agent Orchestration', 'Automated Support', 'Smart Marketing', 'Reduced Costs'],
      },
      features: [
        {
          category: 'Multi-Agent AI System',
          items: [
            {
              title: 'Specialized AI Agents',
              description:
                'Triage, customer support, artisan support, fraud/compliance, insights, government integration',
              icon: Brain,
              status: 'planned',
            },
            {
              title: 'Orchestrator Pattern',
              description: 'Supervisor-worker pattern with clear handoffs and shared state',
              icon: Workflow,
              status: 'planned',
            },
            {
              title: 'Agent Config UI',
              description:
                'Per-agent temperature, tokens, retries, custom prompts, and metrics dashboard',
              icon: BarChart3,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Advanced AI Triage',
          items: [
            {
              title: 'Complexity Classifier',
              description:
                'Real-time classification (simple/moderate/complex) for all conversations',
              icon: Zap,
              status: 'planned',
            },
            {
              title: 'Multi-LLM Orchestration',
              description: 'Smart routing between "cheap/fast" vs "heavy/slow" models',
              icon: Workflow,
              status: 'planned',
            },
            {
              title: 'Progress Tracking',
              description: 'ETAs for complex flows like loan facilitation and disputes',
              icon: TrendingUp,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Customer Segmentation Engine',
          items: [
            {
              title: 'Behavior-Based Personas',
              description:
                'Heritage collectors, conscious consumers, gift buyers, students, bulk buyers',
              icon: Users,
              status: 'planned',
            },
            {
              title: 'Segment Scores',
              description: 'Per-user scores for recommendations, alerts, and campaigns',
              icon: Target,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Social Campaign Strategist',
          items: [
            {
              title: 'Multi-Platform Campaigns',
              description: 'IG/FB/YouTube/WhatsApp with segment-aware messaging',
              icon: Sparkles,
              status: 'planned',
            },
            {
              title: 'Content Calendar',
              description: 'Best times and festival-driven launch windows',
              icon: Calendar,
              status: 'planned',
            },
            {
              title: 'A/B Testing Framework',
              description: 'Test titles, hero images, CTAs with privacy-compliant analytics',
              icon: BarChart3,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Market Intelligence Engine v2',
          items: [
            {
              title: 'Trend Analysis',
              description:
                'Platform + external trends for concrete artisan guidance on stock and pricing',
              icon: TrendingUp,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Advanced Search & Discovery',
          items: [
            {
              title: 'Semantic Search',
              description:
                'Vector search over products, stories, and workshops with cursor pagination',
              icon: Search,
              status: 'planned',
            },
            {
              title: 'Multi-Filter System',
              description: 'Craft type, price, region, certificate status, heritage risk level',
              icon: Award,
              status: 'planned',
            },
            {
              title: 'Values-Driven Filters',
              description: '"Support endangered crafts" and "certified authentic only" toggles',
              icon: Award,
              status: 'planned',
            },
          ],
        },
      ],
      outcomes: [
        '50,000 artisans on platform',
        '₹150-200 Cr GMV achieved',
        '85%+ automated support resolution',
        '40-60% lift in marketing ROI',
        'Clear tourism + craft synergy evidence',
        'Significantly reduced support costs',
      ],
    },
    {
      id: 'phase3',
      name: 'Phase 3: Global, B2B & MSME Scale',
      tagline: 'Scale to ₹1,000+ Cr',
      duration: '12+ Months',
      goals: {
        artisans: '100,000 Artisans',
        gmv: '₹1,000+ Cr GMV',
        other: ['International Presence', 'Strong Kerala/MSME Positioning'],
      },
      features: [
        {
          category: 'Global Expansion Suite',
          items: [
            {
              title: 'Multi-Currency Payments',
              description: 'USD/EUR payments with FX-aware pricing',
              icon: DollarSign,
              status: 'planned',
            },
            {
              title: 'International Logistics',
              description: 'DHL/FedEx integration with aggregators',
              icon: Globe,
              status: 'planned',
            },
          ],
        },
        {
          category: 'B2B Wholesale Channel',
          items: [
            {
              title: 'Bulk Catalogs',
              description: 'MOQ logic, quote requests, dedicated account managers',
              icon: Building2,
              status: 'planned',
            },
          ],
        },
        {
          category: 'MSME & State Integrations',
          items: [
            {
              title: 'Local E-Commerce Portal',
              description:
                'Solve Kerala MSME visibility gap with local storefronts and digital toolkit',
              icon: MapPin,
              status: 'planned',
            },
            {
              title: 'Government Program Integration',
              description:
                'PM Vishwakarma, ODOP, TRIFED flows for credit, certification, and promotion',
              icon: Landmark,
              status: 'planned',
            },
            {
              title: 'Free Digital Tools',
              description:
                'Free billing, digital marketing toolkit, artisan/MSME discovery for districts',
              icon: Sparkles,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Enterprise Instrumentation v2',
          items: [
            {
              title: 'Full Traceability',
              description: 'Per-agent, per-model, per-workflow metrics and cost tracking',
              icon: BarChart3,
              status: 'planned',
            },
            {
              title: 'SLOs & Error Budgets',
              description: '99.5% uptime, p95 < 200ms with on-call alerts',
              icon: Target,
              status: 'planned',
            },
          ],
        },
        {
          category: 'Ephemeral/Degraded Mode',
          items: [
            {
              title: 'No-DB Fallback',
              description: 'In-memory bookings and certificates with sample data for field demos',
              icon: Zap,
              status: 'planned',
            },
            {
              title: 'Low-Infra Regions',
              description: 'Ensure demos work in areas with unstable infrastructure',
              icon: MapPin,
              status: 'planned',
            },
          ],
        },
      ],
      outcomes: [
        '100,000+ artisans across India',
        'Strong presence in Kerala and other states',
        '₹1,000+ Cr GMV achieved',
        '45-50% contribution margin',
        'Full DPDP compliance',
        'Tourism + crafts recognized as regional development driver',
        'International market presence established',
      ],
    },
  ];

  const currentPhase = phases.find((p) => p.id === selectedPhase) || phases[0];

  return (
    <div className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      {/* Header */}
      <div className="from-warm-terracotta to-warm-rust bg-gradient-to-r py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <Rocket className="h-10 w-10 text-black" />
            <h1 className="font-serif text-4xl font-bold text-black sm:text-5xl">
              Product Roadmap
            </h1>
          </div>
          <p className="max-w-3xl text-lg text-white/90">
            Our comprehensive plan to revolutionize the Indian handicrafts ecosystem with AI, trust,
            and experience-driven commerce
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Overview Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
          {phases.map((phase, index) => (
            <Card
              key={phase.id}
              className={`cursor-pointer transition-all ${
                selectedPhase === phase.id ? 'border-primary border-2 shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPhase(phase.id)}
            >
              <CardHeader className="pb-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full font-bold">
                    {index + 1}
                  </div>
                  <Badge variant={selectedPhase === phase.id ? 'default' : 'secondary'}>
                    {phase.duration}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{phase.name.split(':')[0]}</CardTitle>
                <CardDescription className="text-sm">{phase.tagline}</CardDescription>
              </CardHeader>
              <CardContent>
                {phase.goals.gmv && (
                  <p className="text-primary mb-1 text-sm font-semibold">{phase.goals.gmv}</p>
                )}
                {phase.goals.artisans && (
                  <p className="text-muted-foreground text-xs">{phase.goals.artisans}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Phase Details */}
        <div className="space-y-8">
          {/* Goals Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="text-primary h-6 w-6" />
                <CardTitle>Phase Goals</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentPhase.goals.artisans && (
                  <div className="bg-warm-sand flex items-center gap-3 rounded-lg p-4">
                    <Users className="text-primary h-8 w-8" />
                    <div>
                      <p className="text-muted-foreground text-sm">Artisans</p>
                      <p className="text-lg font-bold">{currentPhase.goals.artisans}</p>
                    </div>
                  </div>
                )}
                {currentPhase.goals.gmv && (
                  <div className="bg-warm-sand flex items-center gap-3 rounded-lg p-4">
                    <DollarSign className="text-primary h-8 w-8" />
                    <div>
                      <p className="text-muted-foreground text-sm">GMV Target</p>
                      <p className="text-lg font-bold">{currentPhase.goals.gmv}</p>
                    </div>
                  </div>
                )}
                {currentPhase.goals.other.map((goal, index) => (
                  <div key={index} className="bg-warm-sand flex items-center gap-3 rounded-lg p-4">
                    <CheckCircle2 className="text-primary h-8 w-8" />
                    <p className="font-semibold">{goal}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features Breakdown */}
          {currentPhase.features.map((category, catIndex) => (
            <Card key={catIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-primary h-5 w-5" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.items.map((feature, featIndex) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={featIndex}
                        className="bg-warm-sand flex items-start gap-4 rounded-lg p-4 transition hover:shadow-md"
                      >
                        <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                          <Icon className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h4 className="text-warm-charcoal font-semibold">{feature.title}</h4>
                            {feature.status && (
                              <Badge
                                variant={
                                  feature.status === 'completed'
                                    ? 'default'
                                    : feature.status === 'in-progress'
                                      ? 'secondary'
                                      : 'outline'
                                }
                                className="text-xs"
                              >
                                {feature.status === 'completed'
                                  ? 'Done'
                                  : feature.status === 'in-progress'
                                    ? 'In Progress'
                                    : 'Planned'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Expected Outcomes */}
          <Card className="border-primary/20 border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown className="text-primary h-6 w-6" />
                <CardTitle>Expected Outcomes</CardTitle>
              </div>
              <CardDescription>What we'll achieve by the end of this phase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {currentPhase.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <p className="text-sm font-medium">{outcome}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between border-t pt-8">
          <Button
            variant="outline"
            disabled={selectedPhase === 'phase1'}
            onClick={() => {
              const currentIndex = phases.findIndex((p) => p.id === selectedPhase);
              if (currentIndex > 0) setSelectedPhase(phases[currentIndex - 1].id);
            }}
          >
            Previous Phase
          </Button>
          <Button
            disabled={selectedPhase === 'phase3'}
            onClick={() => {
              const currentIndex = phases.findIndex((p) => p.id === selectedPhase);
              if (currentIndex < phases.length - 1) setSelectedPhase(phases[currentIndex + 1].id);
            }}
            className="gap-2"
          >
            Next Phase
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
