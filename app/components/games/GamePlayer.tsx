'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Game } from '../../data/games';

interface GamePlayerProps {
  game: Game;
  locale: string;
  t: any;
}

export default function GamePlayer({ game, locale, t }: GamePlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 获取当前语言的游戏标题和描述
  const title = locale === 'en' ? game.title.en : game.title.zh;
  const description = locale === 'en' ? game.description.en : game.description.zh;
  
  // 处理全屏切换
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      // 进入全屏模式
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // 退出全屏模式
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            {t('games.back')}
          </Link>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className={`relative ${isFullscreen ? 'w-screen h-screen' : 'w-full'}`}
      >
        {/* 游戏iframe容器 */}
        <div className={`${isFullscreen ? 'w-full h-full' : 'aspect-video'}`}>
          <iframe
            ref={iframeRef}
            src={game.iframeUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* 控制栏 */}
        <div className={`p-4 bg-gray-100 ${isFullscreen ? 'absolute bottom-0 left-0 right-0 bg-opacity-80' : ''}`}>
          <button 
            onClick={toggleFullscreen}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {isFullscreen ? t('games.exitFullscreen') : t('games.fullscreen')}
          </button>
        </div>
      </div>
      
      {/* 游戏描述 */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-gray-800">{locale === 'en' ? 'About This Game' : '游戏介绍'}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
} 