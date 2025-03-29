'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import GameGrid from '../../components/games/GameGrid';
import { games, categories } from '../../data/games';
import { getTranslations, useTranslation } from '../../utils/i18n';

export default function CategoryClient() {
  const params = useParams();
  const categoryId = params.id as string;
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const { t } = useTranslation(locale, translations);

  // 检查分类是否存在
  const category = categories.find(c => c.id === categoryId);
  
  // 在客户端加载时获取当前语言
  useEffect(() => {
    // 从localStorage获取语言设置
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
    
    // 加载翻译
    const loadTranslations = async () => {
      const trans = await getTranslations(savedLocale);
      setTranslations(trans);
    };
    
    loadTranslations();
  }, []);

  // 加载中状态
  if (!translations || Object.keys(translations).length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // 分类不存在
  if (!category) {
    return (
      <Layout locale={locale} t={t}>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold mb-4">
            {locale === 'en' ? 'Category not found' : '分类未找到'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? 'The category you are looking for does not exist.'
              : '您查找的游戏分类不存在。'
            }
          </p>
        </div>
      </Layout>
    );
  }

  // 分类标题
  const categoryTitle = locale === 'en' ? category.name.en : category.name.zh;
  
  return (
    <Layout locale={locale} t={t}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{categoryTitle}</h1>
        <p className="text-gray-600">
          {locale === 'en' 
            ? `Browse all ${categoryTitle.toLowerCase()} games`
            : `浏览所有${categoryTitle}游戏`
          }
        </p>
      </div>
      
      <GameGrid 
        games={games} 
        locale={locale} 
        t={t} 
        categoryId={categoryId} 
      />
    </Layout>
  );
} 