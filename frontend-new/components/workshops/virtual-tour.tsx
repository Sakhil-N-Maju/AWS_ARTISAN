'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Volume2,
  VolumeX,
  Info,
  MapPin,
  Camera,
} from 'lucide-react';

interface VirtualTourStop {
  id: string;
  title: string;
  description: string;
  image: string;
  hotspots?: {
    x: number; // percentage
    y: number; // percentage
    label: string;
    info: string;
  }[];
}

interface VirtualTourProps {
  title: string;
  location: string;
  stops: VirtualTourStop[];
  autoPlay?: boolean;
}

export function VirtualTour({ title, location, stops, autoPlay = false }: VirtualTourProps) {
  const [currentStop, setCurrentStop] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentStop((prev) => (prev + 1) % stops.length);
      }, 5000); // Change stop every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isPlaying, stops.length]);

  const handlePrevious = () => {
    setCurrentStop((prev) => (prev - 1 + stops.length) % stops.length);
  };

  const handleNext = () => {
    setCurrentStop((prev) => (prev + 1) % stops.length);
  };

  const handleReset = () => {
    setCurrentStop(0);
    setIsPlaying(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentStopData = stops[currentStop];

  return (
    <Card className="overflow-hidden">
      <div ref={containerRef} className="relative bg-black">
        {/* Main Tour Image */}
        <div className="relative aspect-video bg-gray-900">
          <img
            src={currentStopData.image}
            alt={currentStopData.title}
            className="h-full w-full object-cover transition-opacity duration-500"
          />

          {/* Hotspots */}
          {currentStopData.hotspots?.map((hotspot, index) => (
            <button
              key={index}
              onClick={() => setSelectedHotspot(selectedHotspot === index ? null : index)}
              className="absolute h-8 w-8 animate-pulse cursor-pointer rounded-full border-4 border-white bg-amber-600 shadow-lg transition-transform hover:scale-110"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Info className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white" />
            </button>
          ))}

          {/* Hotspot Info Panel */}
          {selectedHotspot !== null && currentStopData.hotspots && (
            <div className="animate-in slide-in-from-bottom-4 absolute bottom-20 left-1/2 w-11/12 max-w-md -translate-x-1/2 rounded-lg bg-white p-4 shadow-2xl">
              <h4 className="mb-2 text-lg font-semibold">
                {currentStopData.hotspots[selectedHotspot].label}
              </h4>
              <p className="text-sm text-gray-600">
                {currentStopData.hotspots[selectedHotspot].info}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setSelectedHotspot(null)}
              >
                Close
              </Button>
            </div>
          )}

          {/* Tour Info Overlay */}
          <div className="absolute top-4 right-4 left-4 flex items-start justify-between">
            <div className="rounded-lg bg-black/70 px-4 py-2 text-white backdrop-blur-sm">
              <h3 className="text-lg font-semibold">{title}</h3>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="border-white/20 bg-black/70 text-white backdrop-blur-sm"
            >
              <Camera className="mr-1 h-3 w-3" />
              360° View
            </Badge>
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {stops.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStop(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStop ? 'w-8 bg-amber-600' : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 p-4 text-white">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="text-white hover:bg-white/10"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  className="text-white hover:bg-white/10"
                >
                  ←
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  className="text-white hover:bg-white/10"
                >
                  →
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/10"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/10"
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stop Information */}
          <div>
            <h4 className="mb-1 font-semibold">
              {currentStop + 1}. {currentStopData.title}
            </h4>
            <p className="text-sm text-gray-300">{currentStopData.description}</p>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="bg-gray-800 p-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {stops.map((stop, index) => (
              <button
                key={stop.id}
                onClick={() => setCurrentStop(index)}
                className={`relative flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                  index === currentStop ? 'ring-2 ring-orange-500' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={stop.image} alt={stop.title} className="h-16 w-24 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-1 left-1 text-xs font-medium text-white">
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
