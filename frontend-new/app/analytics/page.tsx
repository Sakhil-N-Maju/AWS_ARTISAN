'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { AnalyticsOverview } from '@/components/dashboard/analytics-overview';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { TopProducts } from '@/components/dashboard/top-products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Filter, Calendar, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { addDays, format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

export default function AnalyticsPage() {
  const [scrolled] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    minRevenue: '',
    maxRevenue: '',
  });

  const handleExport = () => {
    // Create CSV data
    const csvData = [
      ['Metric', 'Value', 'Change'],
      ['Total Revenue', '₹45,231', '+20.1%'],
      ['Total Orders', '145', '+15.3%'],
      ['Average Rating', '4.8', '+5.2%'],
      ['Cancellation Rate', '2.3%', '+1.2%'],
    ];

    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const applyFilters = () => {
    // Apply filters logic here
    setShowFilters(false);
    // You can add actual filtering logic here
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      minRevenue: '',
      maxRevenue: '',
    });
  };

  const getDateRangeLabel = () => {
    if (!dateRange?.from) return 'Select date range';
    if (!dateRange.to) return format(dateRange.from, 'MMM dd, yyyy');

    const daysDiff = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 7) return 'Last 7 days';
    if (daysDiff === 30) return 'Last 30 days';
    if (daysDiff === 90) return 'Last 90 days';

    return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd, yyyy')}`;
  };

  return (
    <div className="bg-background min-h-screen">
      <Navigation scrolled={scrolled} />

      <main className="container mx-auto mt-16 px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track your performance, sales, and customer insights
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 md:mt-0">
            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  {getDateRangeLabel()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="border-b p-3">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() =>
                        setDateRange({ from: addDays(new Date(), -7), to: new Date() })
                      }
                    >
                      Last 7 days
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() =>
                        setDateRange({ from: addDays(new Date(), -30), to: new Date() })
                      }
                    >
                      Last 30 days
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() =>
                        setDateRange({ from: addDays(new Date(), -90), to: new Date() })
                      }
                    >
                      Last 90 days
                    </Button>
                  </div>
                </div>
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="rounded-md"
                />
              </PopoverContent>
            </Popover>

            {/* Filters Button */}
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Filters</h4>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      Reset
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {/* Status Filter */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">Order Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full rounded-md border px-3 py-2 text-sm"
                      >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">Category</label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="w-full rounded-md border px-3 py-2 text-sm"
                      >
                        <option value="all">All Categories</option>
                        <option value="textiles">Textiles</option>
                        <option value="pottery">Pottery</option>
                        <option value="jewelry">Jewelry</option>
                        <option value="woodcraft">Woodcraft</option>
                        <option value="metalwork">Metalwork</option>
                        <option value="paintings">Paintings</option>
                      </select>
                    </div>

                    {/* Revenue Range */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">Revenue Range</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minRevenue}
                          onChange={(e) => setFilters({ ...filters, minRevenue: e.target.value })}
                          className="w-full rounded-md border px-3 py-2 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxRevenue}
                          onChange={(e) => setFilters({ ...filters, maxRevenue: e.target.value })}
                          className="w-full rounded-md border px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowFilters(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" className="flex-1" onClick={applyFilters}>
                      <Check className="mr-1 h-4 w-4" />
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Export Button */}
            <Button variant="default" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Overview */}
            <AnalyticsOverview />

            {/* Charts Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <SalesChart />
              <PerformanceChart />
            </div>

            {/* Orders and Products */}
            <div className="grid gap-6 md:grid-cols-2">
              <RecentOrders />
              <TopProducts />
            </div>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <AnalyticsOverview />
            <SalesChart
              title="Detailed Sales Analysis"
              description="Revenue and order trends over time"
            />
            <RecentOrders title="All Orders" description="Complete order history and status" />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <AnalyticsOverview />
            <div className="grid gap-6 md:grid-cols-2">
              <TopProducts />
              <PerformanceChart
                title="Product Performance"
                description="Track product views and conversions"
              />
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <AnalyticsOverview />
            <div className="grid gap-6 md:grid-cols-2">
              <RecentOrders title="Recent Customer Orders" />
              <PerformanceChart
                title="Customer Engagement"
                description="Customer activity and retention metrics"
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
