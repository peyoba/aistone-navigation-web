import { games } from '../../data/games';
import GameClient from './GameClient';

// 为静态导出生成所有可能的游戏ID参数
export function generateStaticParams() {
  return games.map(game => ({
    id: game.id,
  }));
}

export default function GamePage() {
  return <GameClient />;
} 