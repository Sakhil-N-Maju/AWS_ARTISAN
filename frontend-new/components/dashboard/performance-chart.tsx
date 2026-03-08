'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface PerformanceData {
  month: string;
  sales: number;
  views: number;
  conversions: number;
}

interface PerformanceChartProps {
  data?: PerformanceData[];
  title?: string;
  description?: string;
}

export function PerformanceChart({ data, title, description }: PerformanceChartProps) {
  const defaultData: PerformanceData[] = [
    { month: 'Jan', sales: 65, views: 400, conversions: 12 },
    { month: 'Feb', sales: 59, views: 380, conversions: 11 },
    { month: 'Mar', sales: 80, views: 520, conversions: 15 },
    { month: 'Apr', sales: 81, views: 550, conversions: 16 },
    { month: 'May', sales: 95, views: 680, conversions: 19 },
    { month: 'Jun', sales: 88, views: 620, conversions: 17 },
    { month: 'Jul', sales: 105, views: 780, conversions: 22 },
    { month: 'Aug', sales: 98, views: 720, conversions: 20 },
    { month: 'Sep', sales: 115, views: 850, conversions: 24 },
    { month: 'Oct', sales: 122, views: 920, conversions: 26 },
    { month: 'Nov', sales: 138, views: 1050, conversions: 29 },
    { month: 'Dec', sales: 145, views: 1150, conversions: 32 },
  ];

  const chartData = data || defaultData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Performance Trends'}</CardTitle>
        <CardDescription>
          {description || 'Track your sales, views, and conversions over time'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fdba74" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fdba74" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#ea580c"
              fillOpacity={1}
              fill="url(#colorSales)"
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#fb923c"
              fillOpacity={1}
              fill="url(#colorViews)"
            />
            <Area
              type="monotone"
              dataKey="conversions"
              stroke="#fdba74"
              fillOpacity={1}
              fill="url(#colorConversions)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
