'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md w-full"
      >
        <div className="w-20 h-20 bg-red-900/20 border border-red-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-red-400" size={36} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-400 mb-8">
          An unexpected error occurred. Please try again or contact support if
          the problem persists.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="text-left text-xs text-red-400 bg-red-900/10 border border-red-900/20 rounded-xl p-4 mb-6 overflow-auto max-h-40">
            {error.message}
          </pre>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <RefreshCcw size={18} />
          <span>Try again</span>
        </button>
      </motion.div>
    </div>
  );
}
