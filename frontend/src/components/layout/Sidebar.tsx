'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Edit3, User, Bookmark, LogOut, LogIn } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/auth/login');
  };

  const navLinks = [
    { name: 'Feed', href: '/', icon: Home, show: true },
    { name: 'Create Post', href: '/create', icon: Edit3, show: isAuthenticated },
    { name: 'Profile', href: user ? `/profile/${user.id}` : '#', icon: User, show: isAuthenticated },
    { name: 'Bookmarks', href: user ? `/profile/${user.id}?tab=bookmarks` : '#', icon: Bookmark, show: isAuthenticated },
  ];

  return (
    <aside className="w-64 fixed top-0 left-0 h-screen border-r border-[#111111] bg-newsprint flex flex-col justify-between hidden md:flex z-40 mt-[60px]">
      <div className="pt-8">
        <nav className="flex flex-col">
          {navLinks.filter((link) => link.show).map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center space-x-3 px-6 py-4 uppercase tracking-widest text-sm font-sans font-semibold transition-colors hover:bg-neutral-100 ${
                  isActive ? 'border-l-4 border-editorial text-ink bg-neutral-100' : 'border-l-4 border-transparent text-neutral-600 hover:text-ink'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-editorial' : ''} strokeWidth={isActive ? 2.5 : 1.5} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-[#111111] pb-24">
        {isAuthenticated && user ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 border border-[#111111] flex items-center justify-center text-ink font-bold font-serif text-lg sharp-corners bg-white overflow-hidden shrink-0">
                {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover grayscale" /> : user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs uppercase tracking-widest font-sans font-bold text-ink truncate">{user.name}</p>
                <p className="text-xs font-mono text-neutral-500 truncate">@{user.username}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center justify-center space-x-2 w-full py-2 border border-[#111111] text-ink hover:bg-[#111111] hover:text-white transition-colors text-xs uppercase tracking-widest font-bold sharp-corners"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <Link href="/auth/login" className="flex items-center justify-center space-x-2 w-full py-3 bg-[#111111] text-white hover:bg-neutral-800 transition-colors uppercase tracking-widest text-xs font-bold sharp-corners">
            <LogIn size={16} />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </aside>
  );
};
