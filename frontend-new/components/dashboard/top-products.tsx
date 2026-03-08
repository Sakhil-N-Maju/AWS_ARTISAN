'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface ProductPerformance {
  name: string;
  sales: number;
  revenue: string;
  rating: number;
  reviews: number;
  trend: 'up' | 'down';
  trendValue: number;
}

interface TopProductsProps {
  products?: ProductPerformance[];
  title?: string;
  description?: string;
}

export function TopProducts({ products, title, description }: TopProductsProps) {
  const defaultProducts: ProductPerformance[] = [
    {
      name: 'Banarasi Silk Saree',
      sales: 45,
      revenue: '₹38,250',
      rating: 4.9,
      reviews: 38,
      trend: 'up',
      trendValue: 12,
    },
    {
      name: 'Kashmiri Carpet',
      sales: 12,
      revenue: '₹54,000',
      rating: 4.8,
      reviews: 10,
      trend: 'up',
      trendValue: 8,
    },
    {
      name: 'Blue Pottery Vase',
      sales: 32,
      revenue: '₹7,360',
      rating: 4.7,
      reviews: 28,
      trend: 'up',
      trendValue: 15,
    },
    {
      name: 'Madhubani Painting',
      sales: 28,
      revenue: '₹11,760',
      rating: 4.9,
      reviews: 25,
      trend: 'up',
      trendValue: 10,
    },
    {
      name: 'Bidriware Box',
      sales: 18,
      revenue: '₹5,400',
      rating: 4.6,
      reviews: 15,
      trend: 'down',
      trendValue: -5,
    },
  ];

  const displayProducts = products || defaultProducts;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Top Performing Products'}</CardTitle>
        <CardDescription>{description || 'Your best-selling products this month'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayProducts.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex flex-1 items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                      <span className="text-muted-foreground text-xs">({product.reviews})</span>
                    </div>
                    <span className="text-muted-foreground text-xs">•</span>
                    <span className="text-muted-foreground text-xs">{product.sales} sales</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{product.revenue}</p>
                <p
                  className={`text-xs ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {product.trend === 'up' ? '↑' : '↓'} {Math.abs(product.trendValue)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
