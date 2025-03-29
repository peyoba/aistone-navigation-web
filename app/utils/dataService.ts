import { Game, Category, games as initialGames, categories as initialCategories } from '../data/games';

// 本地存储键名
const GAMES_STORAGE_KEY = 'stone_games_data';
const CATEGORIES_STORAGE_KEY = 'stone_categories_data';

// 获取游戏数据，优先从localStorage获取，如果没有则使用初始数据
export const getGames = (): Game[] => {
  if (typeof window === 'undefined') {
    return initialGames;
  }
  
  try {
    const storedGames = localStorage.getItem(GAMES_STORAGE_KEY);
    if (storedGames) {
      console.log('从localStorage加载游戏数据成功');
      return JSON.parse(storedGames);
    } else {
      console.log('localStorage中没有游戏数据，使用初始数据');
      // 初次使用时，保存初始数据到localStorage
      saveGames(initialGames);
      return initialGames;
    }
  } catch (error) {
    console.error('Error loading games from localStorage:', error);
    return initialGames;
  }
};

// 保存游戏数据到localStorage
export const saveGames = (games: Game[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
    console.log('保存游戏数据到localStorage成功');
  } catch (error) {
    console.error('Error saving games to localStorage:', error);
  }
};

// 获取分类数据，优先从localStorage获取
export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') {
    return initialCategories;
  }
  
  try {
    const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (storedCategories) {
      return JSON.parse(storedCategories);
    } else {
      // 初次使用时，保存初始数据到localStorage
      saveCategories(initialCategories);
      return initialCategories;
    }
  } catch (error) {
    console.error('Error loading categories from localStorage:', error);
    return initialCategories;
  }
};

// 保存分类数据到localStorage
export const saveCategories = (categories: Category[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories to localStorage:', error);
  }
};

// 更新游戏状态（显示/隐藏）
export const updateGameStatus = (gameId: string, active: boolean): Game[] => {
  const games = getGames();
  const updatedGames = games.map(game => 
    game.id === gameId ? { ...game, active } : game
  );
  
  saveGames(updatedGames);
  return updatedGames;
};

// 添加新游戏
export const addGame = (game: Game): Game[] => {
  const games = getGames();
  // 确保游戏ID不重复
  if (games.some(g => g.id === game.id)) {
    throw new Error('Game ID already exists');
  }
  
  const updatedGames = [...games, game];
  saveGames(updatedGames);
  return updatedGames;
};

// 编辑现有游戏
export const updateGame = (updatedGame: Game): Game[] => {
  const games = getGames();
  const updatedGames = games.map(game => 
    game.id === updatedGame.id ? updatedGame : game
  );
  
  saveGames(updatedGames);
  return updatedGames;
};

// 删除游戏
export const deleteGame = (gameId: string): Game[] => {
  const games = getGames();
  const updatedGames = games.filter(game => game.id !== gameId);
  
  saveGames(updatedGames);
  return updatedGames;
};

// 重置为初始数据（用于测试或重置功能）
export const resetToInitialData = (): void => {
  saveGames(initialGames);
  saveCategories(initialCategories);
}; 