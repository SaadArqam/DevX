'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import api from '@/lib/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await api.post('/auth/register', { name, username, email, password });
      await login(email, password);
      toast('Registration successful!', 'success');
      router.push('/');
    } catch (err: any) {
      const errMsg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Registration failed';
      setError(errMsg);
      toast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-newsprint px-6 sm:px-0 newsprint-texture py-20 flex-col">
      <Link href="/" className="mb-12 font-serif italic font-black text-4xl text-ink tracking-tight hover:text-editorial transition-colors">
        DevBlog.
      </Link>
      
      <div className="w-full max-w-md bg-white border-2 border-ink sharp-corners p-10 shadow-[8px_8px_0_0_#111111]">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-serif italic font-bold text-ink mb-3">Create Account</h2>
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">Join the publishing registry</p>
        </div>

        {error && (
          <div className="mb-6 p-4 border-l-4 border-editorial bg-red-50 text-editorial font-mono text-xs font-bold uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="font-sans font-bold uppercase tracking-widest text-[10px] text-ink mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-transparent border-b-2 border-ink py-2 focus:outline-none focus:border-editorial font-mono text-ink placeholder:text-neutral-400 transition-colors sharp-corners"
              placeholder="John Doe"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-sans font-bold uppercase tracking-widest text-[10px] text-ink mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-transparent border-b-2 border-ink py-2 focus:outline-none focus:border-editorial font-mono text-ink placeholder:text-neutral-400 transition-colors sharp-corners"
              placeholder="johndoe123"
              disabled={isLoading}
            />
          </div>

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
            className="w-full bg-ink hover:bg-neutral-800 text-white font-sans font-bold uppercase tracking-widest mt-4 py-4 transition-colors flex justify-center items-center shadow-[4px_4px_0_0_#CC0000] sharp-corners disabled:opacity-70 disabled:shadow-none translate-y-0 hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#CC0000] active:translate-y-[4px] active:shadow-none"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Register'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-body text-neutral-600">
          Already have clearance?{' '}
          <Link href="/auth/login" className="font-bold text-ink hover:text-editorial hover:underline decoration-2 underline-offset-4 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}