import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { PageTransition } from './page-transition';
import { Layout } from '@/components/layout/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevBlog - Developer Social Platform',
  description: 'A modern social blogging platform for developers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#030712]`}>
        <Providers>
          <Layout>
            <PageTransition>{children}</PageTransition>
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
