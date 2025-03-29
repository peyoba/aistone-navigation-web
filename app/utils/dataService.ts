import { Game, Category, games as initialGames, categories as initialCategories } from '../data/games';

// 本地存储键名
const GAMES_STORAGE_KEY = 'stone_games_data';
const CATEGORIES_STORAGE_KEY = 'stone_categories_data';
const SYNC_STATUS_KEY = 'stone_sync_status';

// 数据同步状态接口
export interface SyncStatus {
  lastSyncTime: string;
  frontendDataStatus: 'available' | 'unavailable';
  adminDataStatus: 'available' | 'unavailable';
  syncStatus: 'synced' | 'incomplete' | 'failed';
  message?: string;
}

// 初始同步状态
const initialSyncStatus: SyncStatus = {
  lastSyncTime: new Date().toISOString(),
  frontendDataStatus: 'unavailable',
  adminDataStatus: 'unavailable',
  syncStatus: 'incomplete'
};

// 获取游戏数据，优先从localStorage获取，如果没有则使用初始数据
export const getGames = (): Game[] => {
  if (typeof window === 'undefined') {
    return initialGames;
  }
  
  try {
    const storedGames = localStorage.getItem(GAMES_STORAGE_KEY);
    if (storedGames) {
      console.log('从localStorage加载游戏数据成功');
      // 更新同步状态
      updateSyncStatus({
        frontendDataStatus: 'available'
      });
      return JSON.parse(storedGames);
    } else {
      console.log('localStorage中没有游戏数据，使用初始数据');
      // 初次使用时，保存初始数据到localStorage
      saveGames(initialGames);
      updateSyncStatus({
        frontendDataStatus: 'available',
        message: '已初始化前端数据'
      });
      return initialGames;
    }
  } catch (error) {
    console.error('Error loading games from localStorage:', error);
    updateSyncStatus({
      syncStatus: 'failed',
      message: '加载数据失败: ' + (error instanceof Error ? error.message : String(error))
    });
    return initialGames;
  }
};

// 保存游戏数据到localStorage
export const saveGames = (games: Game[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const gamesJson = JSON.stringify(games);
    localStorage.setItem(GAMES_STORAGE_KEY, gamesJson);
    console.log('保存游戏数据到localStorage成功');
    
    // 更新同步状态
    updateSyncStatus({
      frontendDataStatus: 'available',
      adminDataStatus: 'available',
      syncStatus: 'synced',
      lastSyncTime: new Date().toISOString(),
      message: '数据已保存'
    });
    
    // 尝试广播更改到其他页面
    try {
      // 1. 使用 localStorage 事件触发（跨标签同步）
      localStorage.setItem('stone_games_data_update_trigger', new Date().toISOString());
      localStorage.removeItem('stone_games_data_update_trigger');
      
      // 2. 使用 BroadcastChannel API（如果浏览器支持）
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('stone_games_data_sync');
        channel.postMessage({
          type: 'games_updated',
          timestamp: new Date().toISOString()
        });
        setTimeout(() => channel.close(), 1000);
      }
      
      // 3. 尝试使用自定义事件（同一页面内同步）
      document.dispatchEvent(new CustomEvent('stone_games_updated', {
        detail: { timestamp: new Date().toISOString() }
      }));
    } catch (broadcastError) {
      console.warn('Broadcasting data change failed:', broadcastError);
    }
  } catch (error) {
    console.error('Error saving games to localStorage:', error);
    updateSyncStatus({
      syncStatus: 'failed',
      message: '保存数据失败: ' + (error instanceof Error ? error.message : String(error))
    });
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
  
  // 更新同步状态
  updateSyncStatus({
    frontendDataStatus: 'available',
    adminDataStatus: 'available',
    syncStatus: 'synced',
    lastSyncTime: new Date().toISOString(),
    message: '数据已重置到初始状态'
  });
};

// 获取同步状态
export const getSyncStatus = (): SyncStatus => {
  if (typeof window === 'undefined') {
    return initialSyncStatus;
  }
  
  try {
    const storedStatus = localStorage.getItem(SYNC_STATUS_KEY);
    return storedStatus ? JSON.parse(storedStatus) : initialSyncStatus;
  } catch (error) {
    console.error('Error loading sync status:', error);
    return initialSyncStatus;
  }
};

// 更新同步状态（部分更新）
export const updateSyncStatus = (partialStatus: Partial<SyncStatus>): SyncStatus => {
  if (typeof window === 'undefined') {
    return initialSyncStatus;
  }
  
  try {
    const currentStatus = getSyncStatus();
    const newStatus: SyncStatus = {
      ...currentStatus,
      ...partialStatus
    };
    
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(newStatus));
    return newStatus;
  } catch (error) {
    console.error('Error updating sync status:', error);
    return initialSyncStatus;
  }
};

// 手动同步前端和管理端数据
export const syncFrontendData = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    // 检查数据是否存在
    const storedGames = localStorage.getItem(GAMES_STORAGE_KEY);
    
    if (!storedGames) {
      console.error('没有可用的前端数据');
      updateSyncStatus({
        syncStatus: 'failed',
        message: '同步失败: 没有可用的前端数据'
      });
      return false;
    }
    
    // 广播同步消息
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('stone_games_data_sync');
      channel.postMessage({
        type: 'manual_sync_requested',
        timestamp: new Date().toISOString()
      });
      setTimeout(() => channel.close(), 1000);
    }
    
    // 更新同步状态
    updateSyncStatus({
      frontendDataStatus: 'available',
      adminDataStatus: 'available',
      syncStatus: 'synced',
      lastSyncTime: new Date().toISOString(),
      message: '手动同步成功'
    });
    
    // 触发自定义事件
    document.dispatchEvent(new CustomEvent('stone_games_sync_completed', {
      detail: { success: true, timestamp: new Date().toISOString() }
    }));
    
    // 触发localStorage事件
    localStorage.setItem('stone_sync_timestamp', new Date().toISOString());
    
    return true;
  } catch (error) {
    console.error('同步失败:', error);
    updateSyncStatus({
      syncStatus: 'failed',
      message: '同步失败: ' + (error instanceof Error ? error.message : String(error))
    });
    return false;
  }
};

// 添加数据变化监听器
export const addDataChangeListener = (callback: () => void): () => void => {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  // 1. 监听 localStorage 变化
  const storageHandler = (e: StorageEvent) => {
    if (e.key === GAMES_STORAGE_KEY || e.key === 'stone_sync_timestamp' || e.key === 'stone_games_data_update_trigger') {
      callback();
    }
  };
  
  // 2. 监听自定义事件
  const customEventHandler = () => {
    callback();
  };
  
  // 3. 创建 BroadcastChannel 监听器（如果支持）
  let channel: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel('stone_games_data_sync');
    channel.onmessage = () => {
      callback();
    };
  }
  
  // 添加所有事件监听器
  window.addEventListener('storage', storageHandler);
  document.addEventListener('stone_games_updated', customEventHandler);
  document.addEventListener('stone_games_sync_completed', customEventHandler);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('storage', storageHandler);
    document.removeEventListener('stone_games_updated', customEventHandler);
    document.removeEventListener('stone_games_sync_completed', customEventHandler);
    if (channel) {
      channel.close();
    }
  };
}; 