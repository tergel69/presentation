'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  sectionNumber: number;
}

const sectionColors = [
  'bg-blue-500',   // Section 1
  'bg-green-500',  // Section 2
  'bg-purple-500', // Section 3
  'bg-orange-500', // Section 4
  'bg-pink-500',   // Section 5
  'bg-red-500',    // Section 6
  'bg-teal-500',   // Section 7
];

export function ProgressBar({ progress, sectionNumber }: ProgressBarProps) {
  const colorClass = sectionColors[sectionNumber - 1] || sectionColors[0];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="h-1.5 bg-gray-200">
        <motion.div
          className={`h-full ${colorClass} transition-colors duration-300`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
