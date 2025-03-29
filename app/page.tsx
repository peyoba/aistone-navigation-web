'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './components/layout/Layout';
import GameGrid from './components/games/GameGrid';
import { Game } from './data/games';
import { getTranslations, useTranslation } from './utils/i18n';
import { getGames, addDataChangeListener, getSyncStatus } from './utils/dataService';

export default function HomePage() {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const { t } = useTranslation(locale, translations);
  
  // 加载游戏数据函数
  const loadGames = useCallback((forceRefresh = false) => {
    try {
      console.log(`加载游戏数据${forceRefresh ? '(强制刷新)' : ''}...`);
      setIsLoading(true);
      setSyncError(null);
      
      const gamesData = getGames(forceRefresh);
      console.log(`加载了 ${gamesData.length} 个游戏，过滤出激活的游戏`);
      
      // 只显示激活的游戏
      const activeGames = gamesData.filter(game => game.active);
      console.log(`找到 ${activeGames.length} 个激活的游戏`);
      
      setGames(activeGames);
      setLastUpdated(new Date().toISOString());
      
      // 检查同步状态
      const syncStatus = getSyncStatus();
      if (syncStatus.syncStatus === 'failed') {
        setSyncError(syncStatus.message || '数据同步失败');
      }
    } catch (error) {
      console.error('加载游戏数据出错:', error);
      setSyncError(`加载出错: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 在客户端加载时获取当前语言和游戏数据
  useEffect(() => {
    // 从localStorage或URL路径获取语言设置
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
    
    // 加载翻译
    const loadTranslations = async () => {
      try {
        const trans = await getTranslations(savedLocale);
        setTranslations(trans);
      } catch (error) {
        console.error('加载翻译出错:', error);
      }
    };
    
    loadTranslations();
    loadGames();

    // 使用增强的数据变化监听
    const cleanup = addDataChangeListener(() => {
      console.log('检测到数据变化，重新加载游戏...');
      loadGames(true); // 强制刷新数据
    });
    
    return cleanup;
  }, [loadGames]);
  
  // 手动刷新功能
  const handleRefresh = () => {
    console.log('手动刷新数据');
    loadGames(true);
  };
  
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
        
        {/* 状态显示和刷新按钮 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            {syncError && (
              <div className="text-red-600 bg-red-100 px-4 py-2 rounded">
                {syncError}
              </div>
            )}
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className={`px-4 py-2 rounded flex items-center ${
              isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 
              (locale === 'en' ? 'Refreshing...' : '刷新中...') : 
              (locale === 'en' ? 'Refresh Games' : '刷新游戏')}
          </button>
        </div>
        
        {isLoading ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-600">
            {locale === 'en' 
              ? 'Loading games...' 
              : '正在加载游戏...'}
          </div>
        ) : games.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-600">
            {locale === 'en' 
              ? 'No active games found. Please add some games in the admin panel.' 
              : '没有找到激活的游戏。请在管理员面板中添加一些游戏。'}
          </div>
        ) : (
          <GameGrid games={games} locale={locale} t={t} />
        )}
        
        {/* 更新时间指示器 */}
        <div className="text-right text-sm text-gray-500 mt-4">
          {locale === 'en' 
            ? `Last updated: ${new Date(lastUpdated).toLocaleString()}` 
            : `最后更新: ${new Date(lastUpdated).toLocaleString()}`}
        </div>
      </div>
    </Layout>
  );
} 