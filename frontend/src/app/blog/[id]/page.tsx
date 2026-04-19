'use client';

import { useBlog } from '@/hooks/api';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { LikeButton } from '@/components/blog/LikeButton';
import { BookmarkButton } from '@/components/blog/BookmarkButton';
import { CommentThread } from '@/components/blog/CommentThread';
import { scaleIn, fadeUp } from '@/lib/animations';
import { Loader2, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  if (params.id === 'create') redirect('/create');
  const { data: blog, isLoading, isError } = useBlog(Number(params.id));
  const [relativeTime, setRelativeTime] = useState<string>('');

  useEffect(() => {
    if (blog?.createdAt) {
      setRelativeTime(formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true }));
    }
  }, [blog?.createdAt]);

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-newsprint"><Loader2 className="animate-spin text-ink" size={32} /></div>;
  if (isError || !blog) return <div className="p-20 text-center font-mono font-bold text-editorial uppercase border-2 border-editorial bg-red-50 m-6 sharp-corners">Transmission Not Found.</div>;

  const readingTime = Math.ceil(blog.content.length / 1000) || 1;
  const primaryTag = blog.tags.length > 0 ? blog.tags[0] : 'EDITORIAL';

  return (
    <div className="bg-newsprint min-h-screen">
      <Link href="/" className="fixed top-20 left-6 z-40 bg-white border-2 border-ink text-ink hover:bg-neutral-100 p-2 sharp-corners shadow-[4px_4px_0_0_#111111] transition-transform hover:-translate-y-1 hidden md:block">
        <ArrowLeft size={20} strokeWidth={1.5} />
      </Link>

      <div className="w-full border-b-4 border-ink relative bg-white">
        {blog.coverImage && (
          <motion.img
            layoutId={`post-image-${blog.id}`}
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-[400px] md:h-[500px] object-cover grayscale"
          />
        )}
      </div>

      <article className="max-w-4xl mx-auto px-6 lg:px-8 mt-12 pb-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8 md:border-r border-ink md:pr-12">
          <motion.div variants={fadeUp} initial="initial" animate="animate">
            <span className="font-mono text-sm uppercase tracking-widest text-editorial font-bold mb-4 block block">● {primaryTag}</span>
            <motion.h1 layoutId={`post-title-${blog.id}`} className="text-5xl lg:text-7xl font-serif font-black italic text-ink mb-6 leading-[0.95] tracking-tight">
              {blog.title}
            </motion.h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center py-4 border-t-2 border-b-2 border-ink mb-12 gap-4 sm:gap-0 font-mono text-xs uppercase text-ink font-bold">
              <div className="flex-1">
                 BY <span className="underline decoration-2 underline-offset-4">{blog.author.name}</span>
              </div>
              <div className="flex items-center space-x-6 shrink-0">
                 <span>{relativeTime}</span>
                 <span className="flex items-center"><Clock size={12} className="mr-1" strokeWidth={2}/> {readingTime} MIN READ</span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg max-w-none prose-p:font-body prose-p:text-justify prose-p:leading-relaxed prose-p:text-[18px] prose-a:text-editorial hover:prose-a:underline prose-headings:font-serif prose-headings:italic prose-h2:text-3xl prose-img:sharp-corners prose-img:border prose-img:border-ink prose-img:grayscale
                first-letter:text-7xl first-letter:font-serif first-letter:font-black first-letter:float-left first-letter:leading-none first-letter:mr-3 first-letter:mt-1
              "
            >
              <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} />
            </motion.div>
          </motion.div>
          
          <div id="comments">
            <CommentThread blogId={blog.id} />
          </div>
        </div>

        <aside className="md:col-span-4 hidden md:block">
           <div className="sticky top-[100px] space-y-8">
              <div className="border border-ink sharp-corners bg-white p-6 shadow-[4px_4px_0_0_#111111]">
                 <p className="font-sans font-bold uppercase tracking-widest text-xs border-b-2 border-ink pb-2 mb-4">The Author</p>
                 <div className="w-full aspect-square border border-ink bg-divider mb-4 overflow-hidden">
                    {blog.author.avatar ? <img src={blog.author.avatar} className="w-full h-full object-cover grayscale" /> : <div className="w-full h-full flex items-center justify-center font-serif text-5xl">G</div>}
                 </div>
                 <h3 className="font-serif font-bold text-2xl italic mb-1"><Link href={`/profile/${blog.author.id}`} className="hover:text-editorial">{blog.author.name}</Link></h3>
                 <p className="font-mono text-xs uppercase text-neutral-500 mb-4">@{blog.author.username}</p>
                 <Link href={`/profile/${blog.author.id}`} className="block w-full text-center border-2 border-ink py-2 font-sans font-bold uppercase tracking-widest text-xs hover:bg-ink hover:text-white transition-colors">View Portfolio</Link>
              </div>

              <div className="border border-ink sharp-corners bg-white p-6">
                 <p className="font-sans font-bold uppercase tracking-widest text-xs border-b-2 border-ink pb-2 mb-4">Engagement</p>
                 <div className="flex justify-between items-center py-2">
                    <LikeButton blogId={blog.id} initialLiked={blog.isLiked} initialCount={blog.likesCount} />
                    <BookmarkButton blogId={blog.id} initialBookmarked={blog.isBookmarked} />
                 </div>
              </div>

              <div className="border-t-4 border-ink pt-6">
                 <p className="font-sans font-bold uppercase tracking-widest text-xs mb-4">Filed Under</p>
                 <div className="flex flex-wrap gap-2">
                   {blog.tags.map(tag => (
                     <span key={tag} className="border border-ink px-2 py-1 font-mono text-[10px] uppercase font-bold bg-white sharp-corners hover:bg-neutral-100 cursor-pointer">#{tag}</span>
                   ))}
                 </div>
              </div>
           </div>
        </aside>
      </article>
    </div>
  );
}
