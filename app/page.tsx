'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './components/layout/Layout';
import GameGrid from './components/games/GameGrid';
import { Game } from './data/games';
import { getTranslations, useTranslation } from './utils/i18n';
import { getGames, addDataChangeListener } from './utils/dataService';

export default function HomePage() {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation(locale, translations);
  
  // 在客户端加载时获取当前语言和游戏数据
  useEffect(() => {
    // 从localStorage或URL路径获取语言设置
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
    
    // 加载翻译
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const trans = await getTranslations(savedLocale);
        setTranslations(trans);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // 加载游戏数据
    const loadGames = () => {
      try {
        console.log('Loading games from data service...');
        const gamesData = getGames();
        console.log(`Loaded ${gamesData.length} games, filtering active games only`);
        
        // 只显示激活的游戏
        const activeGames = gamesData.filter(game => game.active);
        console.log(`Found ${activeGames.length} active games`);
        
        setGames(activeGames);
      } catch (error) {
        console.error('Error loading games:', error);
      }
    };
    
    loadTranslations();
    loadGames();

    // 使用增强的数据变化监听
    const cleanup = addDataChangeListener(() => {
      console.log('Data change detected, reloading games...');
      loadGames();
    });
    
    return cleanup;
  }, []);
  
  if (isLoading || !translations || Object.keys(translations).length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <Layout locale={locale} t={t}>
      <div className="mb-10">
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">{t('site.title')}</h1>
          <p className="text-xl">{t('site.description')}</p>
        </div>
        
        {games.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-600">
            {locale === 'en' 
              ? 'No active games found. Please add some games in the admin panel.' 
              : '没有找到激活的游戏。请在管理员面板中添加一些游戏。'}
          </div>
        ) : (
          <GameGrid games={games} locale={locale} t={t} />
        )}
      </div>
    </Layout>
  );
} 