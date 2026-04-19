'use client';

import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

export const PostCardSkeleton = () => {
  return (
    <motion.div
      variants={fadeIn}
      className="bg-newsprint border-b border-r border-[#111111] flex flex-col p-6 sharp-corners"
    >
      <div className="w-full h-52 border border-[#111111] sharp-corners mb-6 shimmer-bg" />
      <div className="flex-1 flex flex-col">
        <div className="h-3 w-24 mb-4 shimmer-bg" />
        <div className="h-8 w-full mb-2 shimmer-bg" />
        <div className="h-8 w-4/5 mb-4 shimmer-bg" />
        
        <div className="space-y-2 mb-6">
          <div className="h-3 w-full shimmer-bg" />
          <div className="h-3 w-full shimmer-bg" />
          <div className="h-3 w-2/3 shimmer-bg" />
        </div>
        
        <div className="border-t-2 border-divider pt-4 mt-auto space-y-2">
          <div className="h-3 w-32 shimmer-bg" />
          <div className="h-2 w-20 shimmer-bg" />
        </div>
      </div>
      
      <div className="border-t border-[#111111] -mx-6 px-6 pt-4 mt-4 flex items-center justify-between">
         <div className="flex space-x-6">
            <div className="h-4 w-10 shimmer-bg" />
            <div className="h-4 w-10 shimmer-bg" />
         </div>
         <div className="h-4 w-4 shimmer-bg" />
      </div>
    </motion.div>
  );
};
