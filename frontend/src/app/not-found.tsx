'use client';

import { motion } from 'framer-motion';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <div className="w-24 h-24 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="text-gray-500" size={40} />
        </div>

        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-300 mb-3">
          Page not found
        </h2>
        <p className="text-gray-500 mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Home size={18} />
            <span>Go Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
