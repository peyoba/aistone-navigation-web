'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  locale: string;
  t: any;
}

export default function Layout({ children, locale, t }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header locale={locale} t={t} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer t={t} />
    </div>
  );
} 