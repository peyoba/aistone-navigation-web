'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Game } from '../../data/games';
import FavoriteButton from './FavoriteButton';

interface GameCardProps {
  game: Game;
  locale: string;
  t: (key: string) => string;
}

export default function GameCard({ game, locale, t }: GameCardProps) {
  // 为缩略图URL添加时间戳，防止浏览器缓存
  const thumbnailWithTimestamp = `${game.thumbnail}${game.thumbnail.includes('?') ? '&' : '?'}v=${Date.now()}`;
  
  // 根据当前语言选择显示的标题和描述
  const title = locale === 'en' ? game.title.en : game.title.zh;
  const description = locale === 'en' ? game.description.en : game.description.zh;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video bg-gray-200">
        <img 
          src={thumbnailWithTimestamp} 
          alt={title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <Link
            href={`/game/${game.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            {t('games.play')}
          </Link>
          <FavoriteButton gameId={game.id} />
        </div>
      </div>
    </div>
  );
} 