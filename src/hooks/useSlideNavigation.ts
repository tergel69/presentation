'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'presentation_last_slide';
const TOTAL_SLIDES = 40;

// Helper function to get initial slide from localStorage
function getInitialSlide(): number {
  if (typeof window === 'undefined') return 1;
  const savedSlide = localStorage.getItem(STORAGE_KEY);
  if (savedSlide) {
    const slideNumber = parseInt(savedSlide, 10);
    if (slideNumber >= 1 && slideNumber <= TOTAL_SLIDES) {
      return slideNumber;
    }
  }
  return 1;
}

export function useSlideNavigation() {
  const [currentSlide, setCurrentSlide] = useState(getInitialSlide);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Save current slide to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentSlide.toString());
  }, [currentSlide]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Navigation functions - defined before use in useEffect
  const goToSlide = useCallback((slideNumber: number) => {
    if (slideNumber >= 1 && slideNumber <= TOTAL_SLIDES && slideNumber !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(slideNumber);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [currentSlide]);

  const goNext = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, goToSlide]);

  const goPrevious = useCallback(() => {
    if (currentSlide > 1) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          goPrevious();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(1);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(TOTAL_SLIDES);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide, isFullscreen, goNext, goPrevious, goToSlide, toggleFullscreen]);

  const progress = (currentSlide / TOTAL_SLIDES) * 100;

  return {
    currentSlide,
    totalSlides: TOTAL_SLIDES,
    progress,
    isAnimating,
    isFullscreen,
    goNext,
    goPrevious,
    goToSlide,
    toggleFullscreen,
    hasNext: currentSlide < TOTAL_SLIDES,
    hasPrevious: currentSlide > 1,
  };
}
