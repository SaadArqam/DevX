'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Add debugging log per prompt rules
    console.log("REGISTER PAYLOAD:", form);
    
    try {
      const res = await api.post('/auth/register', form);
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      router.push('/');
    } catch (err: any) {
      // Prioritize Zod's specific validation array messages before falling back
      const specificError = err?.response?.data?.errors?.[0]?.message;
      const generalMessage = err?.response?.data?.message;
      setError(specificError || generalMessage || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c] px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Join the developer community
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {(['name', 'username', 'email', 'password'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm text-gray-400 mb-1 capitalize">
                {field === 'name' ? 'Full Name' : field}
              </label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={update(field)}
                required
                minLength={field === 'password' ? 8 : field === 'username' ? 3 : field === 'name' ? 2 : undefined}
                maxLength={field === 'password' ? 100 : field === 'username' ? 30 : field === 'name' ? 50 : undefined}
                pattern={field === 'username' ? '^[a-z0-9_]+$' : undefined}
                title={field === 'username' ? 'Username can only contain lowercase letters, numbers, and underscores' : undefined}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-400 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}