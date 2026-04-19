'use client';

import { useComments, useCreateComment, useDeleteComment } from '@/hooks/api';
import { Comment } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/lib/auth';
import { ChevronDown, MessageSquare, Trash2, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { slideInLeft, springConfig } from '@/lib/animations';

const CommentItem = ({ comment, blogId }: { comment: Comment; blogId: number }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [relativeTime, setRelativeTime] = useState('');
  const { user } = useAuthStore();
  const { mutate: createComment, isPending: isCreating } = useCreateComment();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  const { toast } = useToast();

  const isAuthor = user?.id === comment.author.id;
  const isDeleted = !!comment.deletedAt;

  useEffect(() => {
    if (comment.createdAt) {
      setRelativeTime(formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }));
    }
  }, [comment.createdAt]);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    createComment(
      { blogId, content: replyContent, parentId: comment.id },
      {
        onSuccess: () => {
          setReplyContent('');
          setIsReplying(false);
          setIsExpanded(true);
        },
        onError: (err: any) => {
          toast(err.response?.data?.message || 'Failed to post reply', 'error');
        }
      }
    );
  };

  const handleDelete = () => {
    if (confirm('Delete this comment?')) {
      deleteComment({ id: comment.id, blogId });
    }
  };

  return (
    <motion.div variants={slideInLeft} layout className="flex flex-col mb-6">
      <div className="flex space-x-4">
        <div className="w-8 h-8 flex-shrink-0 border border-[#111111] sharp-corners bg-white flex items-center justify-center overflow-hidden">
          {isDeleted ? (
            <div className="w-full h-full bg-divider line-through" />
          ) : comment.author.avatar ? (
            <img src={comment.author.avatar} alt="Avatar" className="w-full h-full object-cover grayscale" />
          ) : (
            <span className="text-ink font-serif font-bold text-sm">{comment.author.name.charAt(0)}</span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="border border-[#111111] sharp-corners p-4 bg-white shadow-[2px_2px_0_0_#111111]">
            <div className="flex justify-between items-start mb-2 border-b border-dashed border-divider pb-2">
              <div className="flex items-center space-x-2">
                <span className="font-sans font-bold uppercase tracking-widest text-xs text-ink">
                  {isDeleted ? 'REDACTED' : comment.author.name}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">
                  {relativeTime}
                </span>
              </div>
              {isAuthor && !isDeleted && (
                <button disabled={isDeleting} onClick={handleDelete} className="text-neutral-400 hover:text-editorial transition-colors">
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              )}
            </div>
            <p className={`font-body text-sm leading-relaxed ${isDeleted ? 'text-neutral-400 italic' : 'text-ink'}`}>
              {isDeleted ? 'This transmission has been redacted.' : comment.content}
            </p>
          </div>

          {!isDeleted && (
            <div className="flex items-center space-x-4 mt-3 ml-1">
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs font-sans uppercase tracking-widest font-bold text-neutral-500 hover:text-ink flex items-center space-x-1 transition-colors"
              >
                <MessageSquare size={12} strokeWidth={1.5} />
                <span>Reply</span>
              </button>
              {comment.replies && comment.replies.length > 0 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs font-sans uppercase tracking-widest font-bold text-neutral-500 hover:text-ink flex items-center space-x-1 transition-colors"
                >
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={springConfig.fast}>
                    <ChevronDown size={14} strokeWidth={1.5} />
                  </motion.div>
                  <span>{comment.replies.length} Replies</span>
                </button>
              )}
            </div>
          )}

          <AnimatePresence>
            {isReplying && (
              <motion.form
                initial={{ opacity: 0, height: 0, scale: 0.98 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.98 }}
                transition={springConfig.fast}
                className="mt-4 relative"
                onSubmit={handleReply}
              >
                <input
                  autoFocus
                  type="text"
                  placeholder="Draft your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-ink py-2 px-1 text-sm font-body focus:outline-none focus:border-editorial transition-colors placeholder:text-neutral-400 placeholder:font-mono pr-10"
                  disabled={isCreating}
                />
                <button
                  type="submit"
                  disabled={isCreating || !replyContent.trim()}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-ink disabled:text-neutral-400 hover:text-editorial transition-colors p-1"
                >
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} strokeWidth={1.5} />}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && comment.replies && comment.replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={springConfig.fast}
            className="ml-4 mt-6 border-l-4 border-divider pl-4 space-y-6"
          >
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} blogId={blogId} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const CommentThread = ({ blogId }: { blogId: number }) => {
  const { data: comments, isLoading } = useComments(blogId);
  const { mutate: createComment, isPending } = useCreateComment();
  const { isAuthenticated } = useAuthStore();
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment(
      { blogId, content },
      { 
        onSuccess: () => setContent(''),
        onError: (err: any) => toast(err.response?.data?.message || 'Failed to post comment', 'error')
      }
    );
  };

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-ink" /></div>;
  }

  return (
    <div className="mt-16 border-t-4 border-ink pt-8 pb-32">
      <h3 className="text-2xl font-serif font-bold italic text-ink mb-8 flex items-center space-x-3">
        <span>Letters to the Editor</span>
        <span className="font-mono text-sm border border-ink px-2 py-0.5 bg-white text-ink not-italic">{comments?.length || 0}</span>
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-12 border border-ink bg-white sharp-corners flex flex-col hover:shadow-[4px_4px_0_0_#111111] transition-shadow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contribute to the discourse..."
            className="w-full bg-transparent p-4 font-body text-ink focus:outline-none resize-y min-h-[120px] placeholder:text-neutral-400 placeholder:font-mono"
            disabled={isPending}
          />
          <div className="border-t border-ink bg-newsprint px-4 py-3 flex justify-between items-center">
             <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">MARKDOWN SUPPORTED</span>
             <button
                type="submit"
                disabled={isPending || !content.trim()}
                className="bg-ink hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-sans font-bold uppercase tracking-widest text-xs px-6 py-2 transition-colors sharp-corners flex items-center space-x-2"
              >
                <span>Submit</span>
                {isPending && <Loader2 size={14} className="animate-spin" />}
              </button>
          </div>
        </form>
      ) : (
        <div className="border-2 border-dashed border-divider p-8 text-center mb-12">
          <p className="font-serif italic text-lg mb-4">You must be recognized by the registry to contribute.</p>
          <a href="/auth/login" className="inline-block bg-ink text-white font-sans font-bold uppercase tracking-widest text-xs px-6 py-3 sharp-corners hover:bg-neutral-800 transition-colors">Sign In</a>
        </div>
      )}

      <div className="space-y-2">
        {comments?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} blogId={blogId} />
        ))}
        {comments?.length === 0 && (
          <p className="text-neutral-500 font-mono text-center py-12 uppercase text-sm">NO CORRESPONDENCE FOUND.</p>
        )}
      </div>
    </div>
  );
};
