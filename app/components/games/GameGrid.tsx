'use client';

import { useState } from 'react';
import GameCard from './GameCard';
import { Game } from '../../data/games';

interface GameGridProps {
  games: Game[];
  locale: string;
  t: any;
  categoryId?: string;
}

export default function GameGrid({ games, locale, t, categoryId = 'all' }: GameGridProps) {
  // 根据分类过滤游戏
  const filteredGames = categoryId === 'all' 
    ? games.filter(game => game.active) 
    : games.filter(game => game.active && game.category === categoryId);
  
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {categoryId === 'all' 
            ? t('categories.all') 
            : (locale === 'en' 
              ? t(`categories.${categoryId}`) 
              : t(`categories.${categoryId}`))}
        </h2>
        
        {filteredGames.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600">{locale === 'en' ? 'No games found in this category.' : '该分类下暂无游戏。'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.map(game => (
              <GameCard 
                key={game.id} 
                game={game} 
                locale={locale} 
                t={t} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 