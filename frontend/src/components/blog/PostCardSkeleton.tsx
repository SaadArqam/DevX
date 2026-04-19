'use client';

import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

export const PostCardSkeleton = () => {
  return (
    <motion.div
      variants={fadeIn}
      className="bg-[#0a0f1c] border border-gray-800 rounded-2xl overflow-hidden flex flex-col"
    >
      <div className="w-full h-48 bg-gray-800 shimmer-bg" />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-800 shimmer-bg shrink-0" />
          <div className="h-4 bg-gray-800 w-32 rounded shimmer-bg" />
        </div>
        <div className="h-6 bg-gray-800 w-full mb-3 rounded shimmer-bg" />
        <div className="h-6 bg-gray-800 w-2/3 mb-4 rounded shimmer-bg" />
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-800 w-full rounded shimmer-bg" />
          <div className="h-4 bg-gray-800 w-4/5 rounded shimmer-bg" />
        </div>
        <div className="flex space-x-2 mt-auto">
          <div className="h-6 w-16 bg-gray-800 rounded shimmer-bg" />
          <div className="h-6 w-16 bg-gray-800 rounded shimmer-bg" />
        </div>
      </div>
      <div className="px-5 py-4 border-t border-gray-800 flex justify-between">
        <div className="flex space-x-4">
          <div className="h-6 w-12 bg-gray-800 rounded shimmer-bg" />
          <div className="h-6 w-12 bg-gray-800 rounded shimmer-bg" />
        </div>
        <div className="h-6 w-6 bg-gray-800 rounded shimmer-bg" />
      </div>
    </motion.div>
  );
};
