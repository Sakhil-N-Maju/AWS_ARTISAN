'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface WorkshopSession {
  id: string;
  workshopId: string;
  date: Date;
  startTime: string;
  endTime: string;
  availableSpots: number;
  totalSpots: number;
  price: number;
  status: 'available' | 'limited' | 'full' | 'cancelled';
}

interface WorkshopCalendarProps {
  sessions: WorkshopSession[];
  onBookSession?: (sessionId: string) => void;
  workshopTitle?: string;
}

export function WorkshopCalendar({
  sessions,
  onBookSession,
  workshopTitle,
}: WorkshopCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get calendar grid
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const days = getCalendarDays();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'full':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'limited':
        return 'Limited Seats';
      case 'full':
        return 'Fully Booked';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const selectedDateSessions = selectedDate ? getSessionsForDate(selectedDate) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{workshopTitle || 'Workshop Schedule'}</CardTitle>
              <CardDescription>Select a date to view available sessions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[120px] text-center text-sm font-medium">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day Headers */}
          <div className="mb-2 grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-muted-foreground py-2 text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              const daySessions = getSessionsForDate(date);
              const hasAvailableSessions = daySessions.some(
                (s) => s.status === 'available' || s.status === 'limited'
              );
              const isSelected = selectedDate?.toDateString() === date.toDateString();

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  disabled={!isCurrentMonth(date) || daySessions.length === 0}
                  className={`relative aspect-square rounded-lg border-2 p-2 text-sm transition-all ${isSelected ? 'border-amber-600 bg-amber-50' : 'border-transparent'} ${!isCurrentMonth(date) ? 'text-muted-foreground/40' : ''} ${isToday(date) ? 'border-blue-300 bg-blue-50' : ''} ${hasAvailableSessions && isCurrentMonth(date) ? 'cursor-pointer hover:border-amber-400 hover:bg-amber-50/50' : ''} ${!hasAvailableSessions || !isCurrentMonth(date) ? 'cursor-not-allowed opacity-50' : ''} `}
                >
                  <span className={`font-medium ${isToday(date) ? 'text-blue-600' : ''}`}>
                    {date.getDate()}
                  </span>

                  {daySessions.length > 0 && isCurrentMonth(date) && (
                    <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                      {daySessions.slice(0, 3).map((session, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full ${
                            session.status === 'available'
                              ? 'bg-green-500'
                              : session.status === 'limited'
                                ? 'bg-yellow-500'
                                : session.status === 'full'
                                  ? 'bg-red-500'
                                  : 'bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-muted-foreground">Limited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Full</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Details */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate
              ? selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Select a Date'}
          </CardTitle>
          <CardDescription>
            {selectedDateSessions.length > 0
              ? `${selectedDateSessions.length} session${selectedDateSessions.length > 1 ? 's' : ''} available`
              : 'No sessions on this date'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateSessions.length > 0 ? (
            <div className="space-y-4">
              {selectedDateSessions.map((session) => (
                <div key={session.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="text-muted-foreground h-4 w-4" />
                        {session.startTime} - {session.endTime}
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        {session.availableSpots} / {session.totalSpots} spots available
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(session.status)}>
                      {getStatusLabel(session.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between border-t pt-2">
                    <div className="text-lg font-semibold">₹{session.price.toLocaleString()}</div>
                    <Button
                      onClick={() => onBookSession?.(session.id)}
                      disabled={session.status === 'full' || session.status === 'cancelled'}
                      size="sm"
                    >
                      {session.status === 'full' ? 'Fully Booked' : 'Book Now'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              <CalendarIcon className="mx-auto mb-2 h-12 w-12 opacity-20" />
              <p>Select a date with available sessions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
