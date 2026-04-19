'use client';

import { useBookmarkBlog } from '@/hooks/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';
import { springConfig } from '@/lib/animations';

interface BookmarkButtonProps {
  blogId: number;
  initialBookmarked?: boolean;
}

export const BookmarkButton = ({ blogId, initialBookmarked = false }: BookmarkButtonProps) => {
  const { mutate, isPending } = useBookmarkBlog();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  
  const [showTooltip, setShowTooltip] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast('Please login to bookmark posts', 'error');
      return;
    }
    
    if (isPending) return;

    mutate({ id: blogId, isBookmarked: !!initialBookmarked });

    if (!initialBookmarked) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 1500);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleBookmark}
        disabled={isPending}
        className="transition-transform relative overflow-hidden group hover:-translate-y-1 block p-1 -m-1"
      >
        <Bookmark 
          size={16} 
          strokeWidth={1.5}
          className={initialBookmarked ? 'text-ink' : 'text-ink'} 
        />
        
        {/* Animated fill overlay using clip-path */}
        {initialBookmarked && (
          <motion.div
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={springConfig.fast}
            className="absolute inset-0 text-ink m-1"
          >
            <Bookmark size={16} fill="currentColor" strokeWidth={1} />
          </motion.div>
        )}
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: -25 }}
            exit={{ opacity: 0 }}
            transition={springConfig.fast}
            className="absolute -top-1 left-1/2 -translate-x-1/2 bg-ink text-white font-mono text-[10px] font-bold px-2 py-1 sharp-corners shadow-[2px_2px_0_0_#CC0000] pointer-events-none whitespace-nowrap z-50 uppercase tracking-widest"
          >
            SAVED
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
