'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error: authError } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      toast(err.response?.data?.message || 'Login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-newsprint px-6 sm:px-0 newsprint-texture py-20 flex-col">
      <Link href="/" className="mb-12 font-serif italic font-black text-4xl text-ink tracking-tight hover:text-editorial transition-colors">
        DevBlog.
      </Link>
      
      <div className="w-full max-w-md bg-white border-2 border-ink sharp-corners p-10 shadow-[8px_8px_0_0_#111111]">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-serif italic font-bold text-ink mb-3">Sign In to Continue</h2>
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">Provide your credentials below</p>
        </div>

        {authError && (
          <div className="mb-6 p-4 border-l-4 border-editorial bg-red-50 text-editorial font-mono text-xs font-bold uppercase">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col">
            <label className="font-sans font-bold uppercase tracking-widest text-[10px] text-ink mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-b-2 border-ink py-2 focus:outline-none focus:border-editorial font-mono text-ink placeholder:text-neutral-400 transition-colors sharp-corners"
              placeholder="user@example.com"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-sans font-bold uppercase tracking-widest text-[10px] text-ink mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent border-b-2 border-ink py-2 focus:outline-none focus:border-editorial font-mono text-ink placeholder:text-neutral-400 transition-colors sharp-corners"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ink hover:bg-neutral-800 text-white font-sans font-bold uppercase tracking-widest py-4 transition-colors flex justify-center items-center shadow-[4px_4px_0_0_#CC0000] sharp-corners disabled:opacity-70 disabled:shadow-none translate-y-0 hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#CC0000] active:translate-y-[4px] active:shadow-none"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Authenticate'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-body text-neutral-600">
          Not in the registry?{' '}
          <Link href="/auth/register" className="font-bold text-ink hover:text-editorial hover:underline decoration-2 underline-offset-4 transition-colors">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}