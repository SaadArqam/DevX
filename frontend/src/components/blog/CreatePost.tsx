'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUp } from '@/lib/animations';
import { useCreateBlog } from '@/hooks/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { Loader2, Plus, X } from 'lucide-react';

const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content is too short'),
  excerpt: z.string().min(10, 'Excerpt required'),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['draft', 'published']),
});

type PostForm = z.infer<typeof postSchema>;

export const CreatePost = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { status: 'published' }
  });
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const { mutate: createBlog, isPending } = useCreateBlog();
  const router = useRouter();
  const { toast } = useToast();

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val) && tags.length < 5) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const removeTag = (t: string) => setTags(tags.filter(tag => tag !== t));

  const onSubmit = (data: PostForm) => {
    if (tags.length === 0) {
      toast('Please add at least one tag', 'error');
      return;
    }
    
    createBlog(
      { ...data, tags },
      {
        onSuccess: (res) => {
          toast('Post created successfully!', 'success');
          router.push(`/blog/${res.id}`);
        },
        onError: () => toast('Failed to create post', 'error'),
      }
    );
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="max-w-3xl mx-auto py-10 px-6"
    >
      <motion.h1 variants={fadeUp} className="text-3xl font-bold text-white mb-8">Write a Post</motion.h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div variants={fadeUp} className="space-y-2">
          <input
            {...register('title')}
            type="text"
            placeholder="Post Title..."
            className="w-full bg-transparent text-4xl font-bold text-white placeholder-gray-600 focus:outline-none"
            disabled={isPending}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </motion.div>

        <motion.div variants={fadeUp}>
          <input
            {...register('coverImage')}
            type="text"
            placeholder="Cover Image URL (optional)"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isPending}
          />
          {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage.message}</p>}
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="flex flex-wrap gap-2 mb-2">
            <AnimatePresence>
              {tags.map(tag => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="px-3 py-1 bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm rounded-full flex items-center space-x-1"
                >
                  <span>#{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400">
                    <X size={14} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={tags.length < 5 ? "Add tags (press Enter)..." : "Maximum 5 tags reached"}
            disabled={tags.length >= 5 || isPending}
            className="w-full bg-transparent border-b border-gray-700 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <textarea
            {...register('excerpt')}
            placeholder="Write a brief excerpt..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none"
            disabled={isPending}
          />
          {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>}
        </motion.div>

        <motion.div variants={fadeUp}>
          <textarea
            {...register('content')}
            placeholder="Write your story here... (Markdown supported)"
            className="w-full bg-transparent text-lg text-gray-200 placeholder-gray-600 focus:outline-none min-h-[400px] resize-y"
            disabled={isPending}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-between items-center py-4 border-t border-gray-800">
          <div className="flex items-center space-x-4">
            <label className="text-gray-400 text-sm">Status:</label>
            <select
              {...register('status')}
              className="bg-gray-900 border border-gray-800 text-white rounded p-2 text-sm focus:outline-none"
            >
              <option value="published">Publish</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            <span>{watch('status') === 'published' ? 'Publish Post' : 'Save Draft'}</span>
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};
