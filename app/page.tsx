'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './components/layout/Layout';
import GameGrid from './components/games/GameGrid';
import { games } from './data/games';
import { getTranslations, useTranslation } from './utils/i18n';

export default function HomePage() {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const { t } = useTranslation(locale, translations);
  
  // 在客户端加载时获取当前语言
  useEffect(() => {
    // 从localStorage或URL路径获取语言设置
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
    
    // 加载翻译
    const loadTranslations = async () => {
      const trans = await getTranslations(savedLocale);
      setTranslations(trans);
    };
    
    loadTranslations();
  }, []);
  
  if (!translations || Object.keys(translations).length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <Layout locale={locale} t={t}>
      <div className="mb-10">
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">{t('site.title')}</h1>
          <p className="text-xl">{t('site.description')}</p>
        </div>
        
        <GameGrid games={games} locale={locale} t={t} />
      </div>
    </Layout>
  );
} 