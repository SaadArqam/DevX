'use client';

import { useEffect, useRef, useState } from 'react';
import { useBlogs } from '@/hooks/api';
import { PostCard } from '@/components/blog/PostCard';
import { PostCardSkeleton } from '@/components/blog/PostCardSkeleton';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Search, Hash } from 'lucide-react';
import { Blog } from '@/types';

export default function FeedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useBlogs(debouncedSearch, tagFilter);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadMoreInView = useInView(loadMoreRef, { amount: 0.5 });

  useEffect(() => {
    if (isLoadMoreInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isLoadMoreInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const blogs: Blog[] = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  return (
    <div className="relative min-h-screen pb-20">
      <div className="sticky top-[60px] bg-newsprint z-30 border-b-2 border-[#111111] p-6 shadow-[0_4px_0_0_#111111]">
        <div className="relative mb-6">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-ink" size={24} strokeWidth={3} />
          <input
            type="text"
            placeholder="SEARCH ENTIRE REGISTRY..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-b-[3px] border-[#111111] py-4 pl-10 pr-4 text-ink font-mono font-bold text-lg focus:outline-none focus:border-editorial transition-colors placeholder:text-neutral-400 sharp-corners"
          />
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {['react', 'javascript', 'nextjs', 'css', 'framer-motion', 'backend'].map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
              className={`flex items-center space-x-1 px-4 py-2 border border-[#111111] font-mono text-xs uppercase font-bold transition-colors sharp-corners shrink-0 ${
                tagFilter === tag ? 'bg-ink text-white shadow-[2px_2px_0_0_#CC0000] translate-x-[-2px] translate-y-[-2px]' : 'bg-transparent text-ink hover:bg-neutral-100 hover:shadow-[2px_2px_0_0_#111111] hover:-translate-y-[2px] hover:-translate-x-[2px]'
              }`}
            >
              <Hash size={14} />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-8 border-b-4 border-ink pb-2">
          <h2 className="text-4xl font-serif italic font-bold">Latest Dispatches</h2>
          <span className="bg-editorial text-white px-3 py-1 font-mono uppercase text-xs font-bold sharp-corners">New Posts</span>
        </div>

        {isError && (
          <div className="text-center py-10 border-2 border-editorial bg-red-50 mb-8 sharp-corners">
            <p className="font-mono text-editorial font-bold">Error loading transmission.</p>
            <button onClick={() => refetch()} className="mt-4 border-b border-editorial text-editorial uppercase tracking-widest text-xs hover:border-transparent">Retry</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-[#111111]">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <PostCardSkeleton key={i} />)
            ) : blogs.length > 0 ? (
              blogs.map((blog) => <PostCard key={blog.id} blog={blog} />)
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-32 text-center border-b border-r border-[#111111] bg-white">
                <Search size={48} className="mx-auto mb-6 text-neutral-300" strokeWidth={1} />
                <h3 className="text-2xl font-serif font-bold italic mb-2">No transmissions found</h3>
                <p className="font-mono text-xs text-neutral-500 uppercase">AWAITING SIGNAL PARAMETERS</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={loadMoreRef} className="py-12 flex justify-center border-t-2 border-[#111111] mt-12">
          {isFetchingNextPage && (
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-ink sharp-corners"
                  animate={{ scale: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}