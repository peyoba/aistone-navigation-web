'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Game } from '../../data/games';

interface GameCardProps {
  game: Game;
  locale: string;
  t: any;
}

export default function GameCard({ game, locale, t }: GameCardProps) {
  // 根据当前语言选择显示的标题和描述
  const title = locale === 'en' ? game.title.en : game.title.zh;
  const description = locale === 'en' ? game.description.en : game.description.zh;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48 w-full">
        {/* 游戏缩略图 */}
        <Image
          src={game.thumbnail || '/images/placeholder.jpg'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4 h-12 overflow-hidden">{description}</p>
        
        <Link
          href={`/game/${game.id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded font-medium hover:bg-blue-700 transition-colors"
        >
          {t('games.play')}
        </Link>
      </div>
    </div>
  );
} 