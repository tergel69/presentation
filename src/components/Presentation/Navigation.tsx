'use client';

import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Home,
  Menu
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavigationProps {
  currentSlide: number;
  totalSlides: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFullscreen: boolean;
  goNext: () => void;
  goPrevious: () => void;
  goToSlide: (slide: number) => void;
  toggleFullscreen: () => void;
  onOpenTOC: () => void;
}

export function Navigation({
  currentSlide,
  totalSlides,
  hasNext,
  hasPrevious,
  isFullscreen,
  goNext,
  goPrevious,
  goToSlide,
  toggleFullscreen,
  onOpenTOC
}: NavigationProps) {
  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left navigation */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onOpenTOC}
                  className="h-10 w-10"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Агуулгын жагсаалт</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToSlide(1)}
                  disabled={currentSlide === 1}
                  className="h-10 w-10"
                >
                  <Home className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Эхний хуудас</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goPrevious}
                  disabled={!hasPrevious}
                  className="h-10 w-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Өмнөх хуудас (Зүүн сум)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Page indicator */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              <span className="text-lg font-bold text-blue-600">{currentSlide}</span>
              <span className="mx-1">/</span>
              <span className="text-gray-400">{totalSlides}</span>
            </span>
          </div>

          {/* Right navigation */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goNext}
                  disabled={!hasNext}
                  className="h-10 w-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Дараагийн хуудас (Баруун сум)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="h-10 w-10"
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Дэлгэц дүүргэх (F)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
