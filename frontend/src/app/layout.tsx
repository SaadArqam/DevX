import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { PageTransition } from './page-transition';
import { Layout } from '@/components/layout/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'DevBlog — Developer Social Platform',
    template: '%s | DevBlog',
  },
  description:
    'A modern social blogging platform for developers to share knowledge, connect, and grow.',
  keywords: ['developer blog', 'programming', 'technology', 'open source'],
  authors: [{ name: 'DevBlog' }],
  openGraph: {
    title: 'DevBlog — Developer Social Platform',
    description:
      'A modern social blogging platform for developers to share knowledge, connect, and grow.',
    type: 'website',
    locale: 'en_US',
    siteName: 'DevBlog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevBlog — Developer Social Platform',
    description:
      'A modern social blogging platform for developers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
