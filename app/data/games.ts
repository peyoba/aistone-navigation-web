export interface Game {
  id: string;
  title: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  iframeUrl: string;
  thumbnail: string;
  category: string;
  active: boolean;
  dateAdded: string;
}

export interface Category {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  order: number;
  active: boolean;
}

// 预设游戏分类
export const categories: Category[] = [
  {
    id: 'all',
    name: {
      en: 'All Games',
      zh: '所有游戏'
    },
    order: 0,
    active: true
  },
  {
    id: 'action',
    name: {
      en: 'Action',
      zh: '动作游戏'
    },
    order: 1,
    active: true
  },
  {
    id: 'puzzle',
    name: {
      en: 'Puzzle',
      zh: '益智游戏'
    },
    order: 2,
    active: true
  },
  {
    id: 'adventure',
    name: {
      en: 'Adventure',
      zh: '冒险游戏'
    },
    order: 3,
    active: true
  },
  {
    id: 'strategy',
    name: {
      en: 'Strategy',
      zh: '策略游戏'
    },
    order: 4,
    active: true
  },
  {
    id: 'sports',
    name: {
      en: 'Sports',
      zh: '体育游戏'
    },
    order: 5,
    active: true
  }
];

// 示例游戏数据
export const games: Game[] = [
  {
    id: 'game1',
    title: {
      en: '2048',
      zh: '2048数字方块'
    },
    description: {
      en: 'Join the numbers and get to the 2048 tile!',
      zh: '合并相同数字，获得2048方块！'
    },
    iframeUrl: 'https://play2048.co',
    thumbnail: '/images/games/2048.jpg',
    category: 'puzzle',
    active: true,
    dateAdded: '2023-06-01T12:00:00Z'
  },
  {
    id: 'game2',
    title: {
      en: 'Flappy Bird',
      zh: '飞扬的小鸟'
    },
    description: {
      en: 'Control the bird to fly through pipes without hitting them.',
      zh: '控制小鸟飞行，避开水管障碍物。'
    },
    iframeUrl: 'https://flappybird.io',
    thumbnail: '/images/games/flappy-bird.jpg',
    category: 'action',
    active: true,
    dateAdded: '2023-06-02T12:00:00Z'
  },
  {
    id: 'game3',
    title: {
      en: 'Tetris',
      zh: '俄罗斯方块'
    },
    description: {
      en: 'Arrange falling blocks to create and destroy horizontal lines.',
      zh: '排列下落的方块，创建并消除水平线。'
    },
    iframeUrl: 'https://tetris.com/play-tetris',
    thumbnail: '/images/games/tetris.jpg',
    category: 'puzzle',
    active: true,
    dateAdded: '2023-06-03T12:00:00Z'
  },
  {
    id: 'game4',
    title: {
      en: 'Snake',
      zh: '贪吃蛇'
    },
    description: {
      en: 'Control a snake to eat food and avoid hitting walls or itself.',
      zh: '控制蛇吃食物，避免撞到墙壁或自身。'
    },
    iframeUrl: 'https://playsnake.org',
    thumbnail: '/images/games/snake.jpg',
    category: 'action',
    active: true,
    dateAdded: '2023-06-04T12:00:00Z'
  },
  {
    id: 'game5',
    title: {
      en: 'Minesweeper',
      zh: '扫雷'
    },
    description: {
      en: 'Find all mines without triggering any of them.',
      zh: '找出所有地雷，但不要触发它们。'
    },
    iframeUrl: 'https://minesweeper.online',
    thumbnail: '/images/games/minesweeper.jpg',
    category: 'puzzle',
    active: true,
    dateAdded: '2023-06-05T12:00:00Z'
  },
  {
    id: 'game6',
    title: {
      en: 'Pacman',
      zh: '吃豆人'
    },
    description: {
      en: 'Navigate Pacman through a maze, eating dots and avoiding ghosts.',
      zh: '引导吃豆人穿过迷宫，吃掉豆子并避开幽灵。'
    },
    iframeUrl: 'https://pacman.live',
    thumbnail: '/images/games/pacman.jpg',
    category: 'action',
    active: false,
    dateAdded: '2023-06-06T12:00:00Z'
  }
]; 