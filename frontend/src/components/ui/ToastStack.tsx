'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore, Toast } from '@/hooks/useToast';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const ToastItem = ({ toast, index, total }: { toast: Toast; index: number; total: number }) => {
  const { removeToast } = useToastStore();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [isHovered, removeToast, toast.id]);

  const offset = total - 1 - index;
  const scale = 1 - offset * 0.05;
  const yOffset = offset * -10;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: yOffset, scale }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={twMerge(
        clsx(
          'absolute bottom-0 right-0 w-80 p-4 rounded-lg shadow-lg border-l-4 bg-gray-900 border-gray-700 text-white flex items-start justify-between z-50 origin-bottom',
          {
            'border-l-green-500': toast.type === 'success',
            'border-l-red-500': toast.type === 'error',
            'border-l-blue-500': toast.type === 'info',
          }
        )
      )}
      style={{
        zIndex: 50 - offset,
      }}
    >
      <p className="text-sm">{toast.message}</p>
      <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-white">
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const ToastStack = () => {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse items-end space-y-reverse space-y-2 pointer-events-none">
      <div className="relative w-80 h-full pointer-events-auto">
        <AnimatePresence>
          {toasts.map((toast, index) => (
            <ToastItem key={toast.id} toast={toast} index={index} total={toasts.length} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
