'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, springConfig } from '@/lib/animations';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { Loader2, ArrowRight } from 'lucide-react';

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [isPending, setIsPending] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = tagsInput
      .split(" ")
      .map(tag => tag.replace("#", "").trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      status,
      tags: tagsArray,
      ...(coverImage.trim() && { coverImage: coverImage.trim() })
    };

    if (!payload.title || !payload.content) {
      toast("Title and content are required", "error");
      return;
    }
    
    setIsPending(true);
    try {
      const res = await api.post('/blogs', payload, {
        withCredentials: true
      });
      
      toast('Transmission published to registry!', 'success');
      
      setTitle("");
      setContent("");
      setTagsInput("");
      setCoverImage("");
      setStatus("published");
      
      router.push(`/blog/${res.data.data.id}`);
    } catch (err: any) {
      toast(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to publish transmission', 'error');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="max-w-4xl mx-auto py-12 px-8 bg-white border border-ink m-6 sharp-corners shadow-[8px_8px_0_0_#111111]"
    >
      <motion.div variants={fadeUp} className="border-b-4 border-ink pb-6 mb-10 text-center relative">
         <span className="font-mono text-xs uppercase tracking-widest text-editorial font-bold absolute top-0 left-0">CONTRIBUTE</span>
         <h1 className="text-5xl font-serif font-black italic text-ink mt-6">Compose Transmission</h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <motion.div variants={fadeUp} className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Headline Title..."
            className="w-full bg-transparent text-4xl font-serif font-bold italic text-ink placeholder-neutral-300 focus:outline-none border-b-2 border-ink pb-4 sharp-corners"
            disabled={isPending}
            required
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="font-sans font-bold uppercase tracking-widest text-xs text-ink mb-2 block">Categories</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. #react #node"
            disabled={isPending}
            className="w-full bg-transparent border border-ink py-3 px-4 font-mono text-ink placeholder-neutral-400 focus:outline-none focus:border-editorial transition-colors sharp-corners"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
           <label className="font-sans font-bold uppercase tracking-widest text-xs text-ink mb-2 block">Cover Photography</label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
            disabled={isPending}
            className="w-full bg-transparent border-b-2 border-ink py-2 font-mono text-ink placeholder-neutral-400 focus:outline-none focus:border-editorial transition-colors sharp-corners text-sm"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
           <label className="font-sans font-bold uppercase tracking-widest text-xs text-ink mb-2 flex justify-between">
              <span>Main Body</span>
              <span className="font-mono text-[10px] text-neutral-400">MARKDOWN</span>
           </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Deliver the facts..."
            className="w-full bg-transparent text-lg font-body text-ink placeholder-neutral-300 focus:outline-none min-h-[400px] resize-y border border-ink p-6 sharp-corners"
            disabled={isPending}
            required
          />
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-center py-6 border-t-4 border-ink gap-6">
          <div className="flex w-full md:w-auto border border-ink sharp-corners">
            <button
               type="button"
               disabled={isPending}
               onClick={() => setStatus('draft')}
               className={`flex-1 md:flex-none px-6 py-2 font-sans font-bold uppercase tracking-widest text-xs transition-colors border-r border-ink sharp-corners ${status === 'draft' ? 'bg-ink text-white' : 'bg-transparent text-ink hover:bg-neutral-100'}`}
            >
               Draft
            </button>
            <button
               type="button"
               disabled={isPending}
               onClick={() => setStatus('published')}
               className={`flex-1 md:flex-none px-6 py-2 font-sans font-bold uppercase tracking-widest text-xs transition-colors sharp-corners ${status === 'published' ? 'bg-ink text-white' : 'bg-transparent text-ink hover:bg-neutral-100'}`}
            >
               Publish
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto bg-ink text-white px-10 py-4 font-sans font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all sharp-corners border-2 border-ink hover:bg-white hover:text-ink disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>{status === 'published' ? 'Transmit to Registry' : 'Save to Archives'}</span>
            {isPending ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} strokeWidth={2.5} />}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};
