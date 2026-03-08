'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SalesData {
  name: string;
  revenue: number;
  orders: number;
}

interface SalesChartProps {
  data?: SalesData[];
  title?: string;
  description?: string;
}

export function SalesChart({ data, title, description }: SalesChartProps) {
  const defaultData: SalesData[] = [
    { name: 'Jan', revenue: 4000, orders: 24 },
    { name: 'Feb', revenue: 3000, orders: 18 },
    { name: 'Mar', revenue: 5000, orders: 30 },
    { name: 'Apr', revenue: 4500, orders: 27 },
    { name: 'May', revenue: 6000, orders: 36 },
    { name: 'Jun', revenue: 5500, orders: 33 },
    { name: 'Jul', revenue: 7000, orders: 42 },
    { name: 'Aug', revenue: 6500, orders: 39 },
    { name: 'Sep', revenue: 8000, orders: 48 },
    { name: 'Oct', revenue: 7500, orders: 45 },
    { name: 'Nov', revenue: 9000, orders: 54 },
    { name: 'Dec', revenue: 10000, orders: 60 },
  ];

  const chartData = data || defaultData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Sales Overview'}</CardTitle>
        <CardDescription>{description || 'Monthly revenue and order statistics'}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
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
            <Bar dataKey="revenue" fill="#ea580c" radius={[8, 8, 0, 0]} />
            <Bar dataKey="orders" fill="#fb923c" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
