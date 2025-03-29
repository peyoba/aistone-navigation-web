/**
 * 数据服务 - 统一管理前端和后台的数据
 * 解决前端和管理后台数据不同步的问题
 */

// 内置默认游戏数据
const defaultGames = [
  {
    id: "2048",
    title: {
      en: "2048",
      zh: "2048数字方块"
    },
    description: {
      en: "Join the numbers and get to the 2048 tile! Classic and addictive puzzle game.",
      zh: "合并相同数字，获得2048方块！经典且让人上瘾的益智游戏。"
    },
    iframeUrl: "https://play2048.co/",
    thumbnail: "/images/placeholder.jpg",
    category: "puzzle",
    active: true,
    dateAdded: "2023-06-01T12:00:00Z"
  },
  {
    id: "wordle",
    title: {
      en: "Wordle Game",
      zh: "猜单词"
    },
    description: {
      en: "Guess the hidden word in 6 tries. Each guess must be a valid 5-letter word.",
      zh: "6次机会猜出隐藏的单词。每次猜测必须是有效的5个字母单词。"
    },
    iframeUrl: "https://wordlegame.org/",
    thumbnail: "/images/placeholder.jpg",
    category: "puzzle",
    active: true,
    dateAdded: "2023-08-15T12:00:00Z"
  },
  {
    id: "tetris",
    title: {
      en: "Tetris",
      zh: "俄罗斯方块"
    },
    description: {
      en: "The classic tile-matching game where you arrange falling blocks to create and destroy lines.",
      zh: "经典的方块消除游戏，排列下落的方块，创建并消除水平线。"
    },
    iframeUrl: "https://www.freetetris.org/game.php",
    thumbnail: "/images/placeholder.jpg",
    category: "puzzle",
    active: true,
    dateAdded: "2023-06-03T12:00:00Z"
  },
  {
    id: "snake",
    title: {
      en: "Snake Game",
      zh: "贪吃蛇"
    },
    description: {
      en: "Control a snake to eat food and grow longer, but avoid hitting walls or yourself.",
      zh: "控制蛇吃食物变得更长，但要避免撞到墙壁或自身。"
    },
    iframeUrl: "https://www.google.com/fbx?fbx=snake_arcade",
    thumbnail: "/images/placeholder.jpg",
    category: "action",
    active: true,
    dateAdded: "2023-06-04T12:00:00Z"
  }
];

// 内置默认分类数据
const defaultCategories = [
  {
    id: "all",
    name: {
      en: "All Games",
      zh: "所有游戏"
    },
    description: {
      en: "Browse all games in our collection",
      zh: "浏览我们收集的所有游戏"
    },
    icon: "🎲",
    order: 0,
    active: true
  },
  {
    id: "puzzle",
    name: {
      en: "Puzzle",
      zh: "益智游戏"
    },
    description: {
      en: "Brain teasers and logical challenges",
      zh: "脑筋急转弯和逻辑挑战"
    },
    icon: "🧩",
    order: 1,
    active: true
  },
  {
    id: "action",
    name: {
      en: "Action",
      zh: "动作游戏"
    },
    description: {
      en: "Fast-paced games requiring quick reflexes",
      zh: "需要快速反应的高节奏游戏"
    },
    icon: "🎮",
    order: 2,
    active: true
  },
  {
    id: "strategy",
    name: {
      en: "Strategy",
      zh: "策略游戏"
    },
    description: {
      en: "Planning and strategic thinking games",
      zh: "需要规划和战略思维的游戏"
    },
    icon: "♟️",
    order: 3,
    active: true
  }
];

// 数据版本标识，用于检测数据更新
const DATA_VERSION = "1.0";
const STORAGE_KEYS = {
  GAMES: "stone_games",
  CATEGORIES: "stone_categories",
  VERSION: "stone_data_version"
};

/**
 * 数据服务类
 */
class DataService {
  constructor() {
    this.games = [];
    this.categories = [];
    this.initialized = false;
    this.eventListeners = {
      'data-updated': []
    };
    this._notifying = false;
    this._notificationQueue = [];
  }
  
  /**
   * 初始化数据服务
   */
  async initialize() {
    if (this.initialized) return;
    
    console.log("初始化数据服务...");
    
    // 检查存储版本
    const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (storedVersion !== DATA_VERSION) {
      console.log("数据版本不匹配，初始化默认数据");
      // 重置数据为默认值
      this.resetToDefaults();
    } else {
      // 加载保存的数据
      this.loadFromStorage();
    }
    
    this.initialized = true;
    console.log("数据服务初始化完成:", { 
      games: this.games.length, 
      categories: this.categories.length 
    });
    
    return {
      games: this.games,
      categories: this.categories
    };
  }
  
  /**
   * 重置为默认数据
   */
  resetToDefaults() {
    this.games = [...defaultGames];
    this.categories = [...defaultCategories];
    this.saveToStorage();
    localStorage.setItem(STORAGE_KEYS.VERSION, DATA_VERSION);
    this.notifyListeners('data-updated');
  }
  
  /**
   * 从本地存储加载数据
   */
  loadFromStorage() {
    try {
      const gamesJson = localStorage.getItem(STORAGE_KEYS.GAMES);
      const categoriesJson = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      
      if (gamesJson) {
        this.games = JSON.parse(gamesJson);
      } else {
        this.games = [...defaultGames];
      }
      
      if (categoriesJson) {
        this.categories = JSON.parse(categoriesJson);
      } else {
        this.categories = [...defaultCategories];
      }
      
      console.log("已从本地存储加载数据");
    } catch (error) {
      console.error("加载数据失败，使用默认数据:", error);
      this.games = [...defaultGames];
      this.categories = [...defaultCategories];
    }
  }
  
  /**
   * 保存数据到本地存储
   */
  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(this.games));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
      localStorage.setItem(STORAGE_KEYS.VERSION, DATA_VERSION);
      console.log("数据已保存到本地存储");
    } catch (error) {
      console.error("保存数据失败:", error);
    }
  }
  
  /**
   * 获取所有游戏
   * @returns {Array} 游戏数据数组
   */
  getAllGames() {
    return [...this.games];
  }
  
  /**
   * 获取所有分类
   * @returns {Array} 分类数据数组
   */
  getAllCategories() {
    return [...this.categories];
  }
  
  /**
   * 根据ID获取游戏
   * @param {string} id 游戏ID
   * @returns {Object|null} 游戏数据或null
   */
  getGameById(id) {
    return this.games.find(game => game.id === id) || null;
  }
  
  /**
   * 根据ID获取分类
   * @param {string} id 分类ID
   * @returns {Object|null} 分类数据或null
   */
  getCategoryById(id) {
    return this.categories.find(category => category.id === id) || null;
  }
  
  /**
   * 添加或更新游戏
   * @param {Object} gameData 游戏数据
   * @returns {boolean} 操作是否成功
   */
  saveGame(gameData) {
    if (!gameData || !gameData.id) {
      console.error("游戏数据无效");
      return false;
    }
    
    // 查找是否存在此游戏
    const existingIndex = this.games.findIndex(game => game.id === gameData.id);
    
    if (existingIndex >= 0) {
      // 更新现有游戏
      this.games[existingIndex] = {...gameData};
    } else {
      // 添加新游戏
      this.games.push({...gameData});
    }
    
    // 保存更改
    this.saveToStorage();
    
    // 触发数据更新事件
    this.notifyListeners('data-updated');
    
    return true;
  }
  
  /**
   * 删除游戏
   * @param {string} gameId 游戏ID
   * @returns {boolean} 操作是否成功
   */
  deleteGame(gameId) {
    const initialLength = this.games.length;
    this.games = this.games.filter(game => game.id !== gameId);
    
    if (this.games.length !== initialLength) {
      // 游戏被删除，保存更改
      this.saveToStorage();
      
      // 触发数据更新事件
      this.notifyListeners('data-updated');
      
      return true;
    }
    
    return false;
  }
  
  /**
   * 添加或更新分类
   * @param {Object} categoryData 分类数据
   * @returns {boolean} 操作是否成功
   */
  saveCategory(categoryData) {
    if (!categoryData || !categoryData.id) {
      console.error("分类数据无效");
      return false;
    }
    
    // 查找是否存在此分类
    const existingIndex = this.categories.findIndex(category => category.id === categoryData.id);
    
    if (existingIndex >= 0) {
      // 更新现有分类
      this.categories[existingIndex] = {...categoryData};
    } else {
      // 添加新分类
      this.categories.push({...categoryData});
    }
    
    // 保存更改
    this.saveToStorage();
    
    // 触发数据更新事件
    this.notifyListeners('data-updated');
    
    return true;
  }
  
  /**
   * 删除分类
   * @param {string} categoryId 分类ID
   * @returns {boolean} 操作是否成功
   */
  deleteCategory(categoryId) {
    // 不允许删除"all"分类
    if (categoryId === 'all') {
      console.error("不能删除'all'分类");
      return false;
    }
    
    const initialLength = this.categories.length;
    this.categories = this.categories.filter(category => category.id !== categoryId);
    
    if (this.categories.length !== initialLength) {
      // 分类被删除，保存更改
      this.saveToStorage();
      
      // 触发数据更新事件
      this.notifyListeners('data-updated');
      
      return true;
    }
    
    return false;
  }
  
  /**
   * 添加事件监听器
   * @param {string} event 事件名称
   * @param {Function} callback 回调函数
   */
  addEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    }
  }
  
  /**
   * 移除事件监听器
   * @param {string} event 事件名称
   * @param {Function} callback 回调函数
   */
  removeEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        listener => listener !== callback
      );
    }
  }
  
  /**
   * 通知所有监听器
   * @param {string} event 事件名称
   * @param {*} data 事件数据
   */
  notifyListeners(event, data) {
    // 防止递归触发
    if (this._notifying) {
      console.warn('检测到可能的递归数据更新，已阻止');
      this._notificationQueue.push({ event, data });
      return;
    }
    
    this._notifying = true;
    
    try {
      if (this.eventListeners[event]) {
        console.log(`触发 '${event}' 事件，通知 ${this.eventListeners[event].length} 个监听器`);
        
        // 创建监听器副本以避免在迭代过程中修改数组
        const listeners = [...this.eventListeners[event]];
        
        listeners.forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error("事件监听器错误:", error);
          }
        });
      }
    } finally {
      // 确保_notifying标志被重置
      setTimeout(() => {
        this._notifying = false;
      }, 0);
      
      // 处理队列中的通知
      this.processNotificationQueue();
    }
  }
  
  /**
   * 处理通知队列
   */
  processNotificationQueue() {
    // 处理队列
    if (this._notificationQueue.length > 0) {
      console.log(`处理事件通知队列，当前队列长度: ${this._notificationQueue.length}`);
      
      // 获取队列中的第一个事件并移除
      const nextNotification = this._notificationQueue.shift();
      
      // 使用setTimeout确保异步执行，避免调用栈过深
      setTimeout(() => {
        this.notifyListeners(nextNotification.event, nextNotification.data);
      }, 0);
    }
  }
}

// 创建单例实例
const dataService = new DataService();

// 如果是浏览器环境，将dataService绑定到window上
if (typeof window !== 'undefined') {
  window.dataService = dataService;
}

// 如果是模块环境，导出dataService
if (typeof module !== 'undefined' && module.exports) {
  module.exports = dataService;
} 