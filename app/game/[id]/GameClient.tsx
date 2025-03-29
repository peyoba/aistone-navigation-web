'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import GamePlayer from '../../components/games/GamePlayer';
import { games } from '../../data/games';
import { getTranslations, useTranslation } from '../../utils/i18n';

export default function GameClient() {
  const params = useParams();
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const { t } = useTranslation(locale, translations);
  
  // 根据ID查找游戏
  const gameId = params.id as string;
  const game = games.find(g => g.id === gameId);
  
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
    
    // 如果游戏不存在或未激活，重定向到首页
    if (!game || !game.active) {
      router.push('/');
    }
  }, [game, router]);
  
  // 加载中状态
  if (!translations || Object.keys(translations).length === 0 || !game) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <Layout locale={locale} t={t}>
      <GamePlayer game={game} locale={locale} t={t} />
    </Layout>
  );
} 