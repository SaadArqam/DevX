'use client';

import { useEffect, useRef, useState } from 'react';
import { useBlogs } from '@/hooks/api';
import { PostCard } from '@/components/blog/PostCard';
import { PostCardSkeleton } from '@/components/blog/PostCardSkeleton';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Search, Hash, ArrowUp } from 'lucide-react';

export default function FeedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  
  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch
  } = useBlogs(debouncedSearch, tagFilter);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadMoreInView = useInView(loadMoreRef, { amount: 0.5 });

  useEffect(() => {
    if (isLoadMoreInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isLoadMoreInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // "New Posts" polling simulation (checking every 60s)
  const [hasNewPosts, setHasNewPosts] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app we'd ping a lightweight `/blogs/check-new` endpoint here.
      // For demonstration, we'll just lightly refetch in background if scrolled down slightly.
      if (window.scrollY > 200) {
        // Pseudo check (Normally check if latest ID changed)
        // setHasNewPosts(true); 
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refetch();
    setHasNewPosts(false);
  };

  const blogs = data?.pages.flatMap(page => page.data) || [];

  return (
    <div className="py-8 px-4 sm:px-6 relative min-h-screen">
      <AnimatePresence>
        {hasNewPosts && (
          <motion.div
            initial={{ y: -100, opacity: 0, x: '-50%' }}
            animate={{ y: 20, opacity: 1, x: '-50%' }}
            exit={{ y: -100, opacity: 0, x: '-50%' }}
            className="fixed top-0 left-1/2 z-50"
          >
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg shadow-blue-900/20 flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95"
            >
              <ArrowUp size={16} />
              <span>New Posts Available</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 space-y-4 sticky top-0 bg-[#0a0f1c]/90 backdrop-blur z-30 pt-4 pb-4 border-b border-gray-800/0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {['react', 'javascript', 'nextjs', 'css', 'framer-motion', 'backend'].map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
              className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
                tagFilter === tag 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'
              }`}
            >
              <Hash size={14} />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {isError && (
        <div className="text-center text-red-500 py-10 bg-red-900/10 rounded-xl border border-red-900/20">
          <p>Failed to load feed. Please try again later.</p>
          <button onClick={() => refetch()} className="mt-4 text-blue-500 hover:underline">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <PostCardSkeleton key={i} />)
          ) : blogs.length > 0 ? (
            blogs.map((blog) => <PostCard key={blog.id} blog={blog} />)
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center">
              <div className="bg-gray-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                <Search size={32} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div ref={loadMoreRef} className="py-8 flex justify-center">
        {isFetchingNextPage && (
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
