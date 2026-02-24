'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideContainerProps {
  children: ReactNode;
  isAnimating: boolean;
}

export function SlideContainer({ children, isAnimating }: SlideContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isAnimating ? 'animating' : 'static'}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full h-full flex items-center justify-center p-4 md:p-8"
      >
        <div className="w-full max-w-6xl mx-auto">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
