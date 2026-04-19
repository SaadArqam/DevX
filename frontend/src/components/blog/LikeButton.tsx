'use client';

import { useLikeBlog } from '@/hooks/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';
import { springConfig } from '@/lib/animations';

interface LikeButtonProps {
  blogId: number;
  initialLiked?: boolean;
  initialCount?: number;
}

export const LikeButton = ({ blogId, initialLiked = false, initialCount = 0 }: LikeButtonProps) => {
  const { mutate, isPending } = useLikeBlog();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast('Please login to like posts', 'error');
      return;
    }
    
    if (isPending) return;

    if (!initialLiked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }

    mutate({ id: blogId, isLiked: !!initialLiked });
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center space-x-2 transition-colors relative group hover:bg-neutral-100 p-1 -m-1 sharp-corners"
      disabled={isPending}
    >
      <div className="relative">
        <motion.div
          animate={isAnimating ? { scale: [1, 1.3, 0.9, 1] } : { scale: 1 }}
          transition={springConfig.mechanical}
        >
          <Heart 
            size={16} 
            strokeWidth={1.5} 
            fill={initialLiked ? '#CC0000' : 'none'} 
            className={initialLiked ? 'text-editorial' : 'text-ink group-hover:-translate-y-1 transition-transform'} 
          />
        </motion.div>
      </div>

      <div className="h-5 overflow-hidden flex items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={initialCount}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={springConfig.fast}
            className="text-xs font-mono font-bold mt-0.5"
          >
            {initialCount}
          </motion.span>
        </AnimatePresence>
      </div>
    </button>
  );
};
