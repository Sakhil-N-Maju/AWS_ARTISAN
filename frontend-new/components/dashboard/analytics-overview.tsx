'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Package, Star, XCircle } from 'lucide-react';

interface AnalyticsMetric {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

interface AnalyticsOverviewProps {
  metrics?: AnalyticsMetric[];
}

export function AnalyticsOverview({ metrics }: AnalyticsOverviewProps) {
  const defaultMetrics: AnalyticsMetric[] = [
    {
      title: 'Total Revenue',
      value: '₹45,231',
      change: 20.1,
      changeLabel: 'from last month',
      icon: <DollarSign className="text-muted-foreground h-4 w-4" />,
      trend: 'up',
    },
    {
      title: 'Total Orders',
      value: '145',
      change: 15.3,
      changeLabel: 'from last month',
      icon: <Package className="text-muted-foreground h-4 w-4" />,
      trend: 'up',
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: 5.2,
      changeLabel: 'from last month',
      icon: <Star className="text-muted-foreground h-4 w-4" />,
      trend: 'up',
    },
    {
      title: 'Cancellation Rate',
      value: '2.3%',
      change: -1.2,
      changeLabel: 'from last month',
      icon: <XCircle className="text-muted-foreground h-4 w-4" />,
      trend: 'down',
    },
  ];

  const displayMetrics = metrics || defaultMetrics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {displayMetrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              {metric.change > 0 ? (
                <TrendingUp
                  className={`h-3 w-3 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
                />
              ) : (
                <TrendingDown
                  className={`h-3 w-3 ${metric.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}
                />
              )}
              <span
                className={
                  metric.change > 0
                    ? metric.trend === 'up'
                      ? 'text-green-500'
                      : 'text-red-500'
                    : metric.trend === 'up'
                      ? 'text-red-500'
                      : 'text-green-500'
                }
              >
                {Math.abs(metric.change)}%
              </span>{' '}
              {metric.changeLabel}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
