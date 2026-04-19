'use client';

import { useProfile, useUserBlogs, useUserBookmarks } from '@/hooks/api';
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence, Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { scaleIn, springConfig } from '@/lib/animations';
import { Loader2 } from 'lucide-react';
import { PostCard } from '@/components/blog/PostCard';
import { Blog } from '@/types';

const CountUp = ({ value = 0 }: { value?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: 1.5, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, value, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<'posts' | 'bookmarks'>('posts');
  const { data: profileData, isLoading: isLoadingProfile, isError: profileError } = useProfile();
  const { data: blogs, isLoading: isLoadingBlogs, isError: blogsError } = useUserBlogs(params.id);
  const { data: bookmarkedBlogs, isLoading: isLoadingBookmarks, isError: bookmarksError } = useUserBookmarks(params.id);

  if (isLoadingProfile || isLoadingBlogs || isLoadingBookmarks) {
    return <div className="flex justify-center p-20 bg-newsprint min-h-screen"><Loader2 className="animate-spin text-ink" size={32} /></div>;
  }

  if (profileError || blogsError || bookmarksError || !profileData) {
    return <div className="p-20 text-center font-mono font-bold text-editorial uppercase border-2 border-editorial bg-red-50 m-6 sharp-corners">Failed to locate profile records.</div>;
  }

  const user = profileData?.data || profileData;

  const blogsData = blogs ?? [];
  const bookmarkedData = bookmarkedBlogs?.map((b: any) => b.blog || b) ?? [];

  const currentBlogs = tab === 'posts' ? blogsData : bookmarkedData;

  const slideVariants: Variants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: springConfig.fast
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -30 : 30,
      opacity: 0,
    })
  };

  const direction = tab === 'posts' ? -1 : 1;

  return (
    <div className="bg-newsprint min-h-screen pb-20">
      <div className="bg-white border-b-4 border-ink p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center md:items-start space-y-4"
        >
          <div className="w-24 h-24 border-2 border-ink sharp-corners flex items-center justify-center text-ink font-serif font-black text-4xl bg-divider overflow-hidden">
            {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover grayscale" /> : user.name.charAt(0)}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-serif font-black italic text-ink tracking-tight mb-1">{user.name}</h1>
            <p className="font-mono text-sm uppercase text-neutral-500">@{user.username}</p>
            {user.bio && <p className="font-body text-ink mt-4 text-sm max-w-lg leading-relaxed">{user.bio}</p>}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 border-b-2 border-ink bg-white">
        {[
          { label: 'Published Dispatches', value: user.postsCount },
          { label: 'Endorsements', value: user.likesCount },
          { label: 'Subscribers', value: user.followersCount }
        ].map(stat => (
          <div key={stat.label} className="p-6 text-center border-r border-[#111111] last:border-r-0 flex flex-col justify-center">
             <p className="text-4xl lg:text-5xl font-mono font-bold text-ink mb-2">
              <CountUp value={stat.value} />
            </p>
            <p className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="p-6 mt-8">
         <div className="flex space-x-4 mb-8">
            <button 
               onClick={() => setTab('posts')}
               className={`px-6 py-2 font-sans font-bold uppercase tracking-widest text-xs border border-ink sharp-corners transition-all ${tab === 'posts' ? 'bg-ink text-white shadow-[2px_2px_0_0_#CC0000]' : 'bg-transparent text-ink hover:bg-neutral-100 hover:shadow-[2px_2px_0_0_#111111]'}`}
            >
               Publications
            </button>
            <button 
               onClick={() => setTab('bookmarks')}
               className={`px-6 py-2 font-sans font-bold uppercase tracking-widest text-xs border border-ink sharp-corners transition-all ${tab === 'bookmarks' ? 'bg-ink text-white shadow-[2px_2px_0_0_#CC0000]' : 'bg-transparent text-ink hover:bg-neutral-100 hover:shadow-[2px_2px_0_0_#111111]'}`}
            >
               Archived Marks
            </button>
         </div>

         <div className="relative min-h-[400px]">
            <AnimatePresence custom={direction} mode="wait">
               <motion.div
               key={tab}
               custom={direction}
               variants={slideVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
               className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-[#111111]"
               >
               {currentBlogs.length > 0 ? currentBlogs.map((blog: Blog, i: number) => (
                  <PostCard key={blog.id} blog={blog} />
               )) : (
                  <div className="col-span-full border-b border-r border-ink bg-white p-20 text-center flex flex-col items-center justify-center">
                     <div className="font-serif italic text-2xl text-ink font-bold mb-2">No records found</div>
                     <p className="font-mono text-xs uppercase text-neutral-400">Database query returned empty for '{tab}'</p>
                  </div>
               )}
               </motion.div>
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
