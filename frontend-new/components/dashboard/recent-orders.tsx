'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface RecentOrder {
  id: string;
  product: string;
  customer: string;
  amount: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

interface RecentOrdersProps {
  orders?: RecentOrder[];
  title?: string;
  description?: string;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, variant: 'secondary' as const },
  processing: { label: 'Processing', icon: Package, variant: 'default' as const },
  completed: { label: 'Completed', icon: CheckCircle, variant: 'default' as const },
  cancelled: { label: 'Cancelled', icon: XCircle, variant: 'destructive' as const },
};

export function RecentOrders({ orders, title, description }: RecentOrdersProps) {
  const defaultOrders: RecentOrder[] = [
    {
      id: 'ORD-001',
      product: 'Banarasi Silk Saree',
      customer: 'Priya Sharma',
      amount: '₹8,500',
      status: 'completed',
      date: '2 hours ago',
    },
    {
      id: 'ORD-002',
      product: 'Blue Pottery Vase',
      customer: 'Rahul Verma',
      amount: '₹2,300',
      status: 'processing',
      date: '5 hours ago',
    },
    {
      id: 'ORD-003',
      product: 'Madhubani Painting',
      customer: 'Anjali Patel',
      amount: '₹4,200',
      status: 'pending',
      date: '1 day ago',
    },
    {
      id: 'ORD-004',
      product: 'Dokra Figurine',
      customer: 'Suresh Kumar',
      amount: '₹1,800',
      status: 'completed',
      date: '2 days ago',
    },
    {
      id: 'ORD-005',
      product: 'Kashmiri Carpet',
      customer: 'Meera Singh',
      amount: '₹45,000',
      status: 'cancelled',
      date: '3 days ago',
    },
  ];

  const displayOrders = orders || defaultOrders;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Recent Orders'}</CardTitle>
        <CardDescription>{description || 'Latest orders from your customers'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <div
                key={order.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex flex-1 items-start gap-3">
                  <div className="rounded-lg bg-amber-50 p-2">
                    <Package className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{order.product}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-muted-foreground text-xs">{order.customer}</p>
                      <span className="text-muted-foreground text-xs">•</span>
                      <p className="text-muted-foreground text-xs">{order.id}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{order.amount}</p>
                    <p className="text-muted-foreground text-xs">{order.date}</p>
                  </div>
                  <Badge
                    variant={statusConfig[order.status].variant}
                    className="flex items-center gap-1"
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[order.status].label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
