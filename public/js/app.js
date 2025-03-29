/**
 * AI Stone游戏导航网站主脚本
 * 实现数据加载、国际化、分类过滤等功能
 */

// 全局变量
let currentGames = [];
let currentCategories = [];
let currentLang = 'zh'; // 默认中文
let currentCategory = 'all'; // 默认所有分类
let favorites = []; // 收藏的游戏

// 后备数据，当远程数据加载失败时使用
const fallbackGames = [
  {
    id: '2048',
    title: {
      en: '2048',
      zh: '2048数字方块'
    },
    description: {
      en: 'Join the numbers and get to the 2048 tile!',
      zh: '合并相同数字，获得2048方块！'
    },
    iframeUrl: 'https://play2048.co',
    thumbnail: '/images/placeholder.jpg',
    category: 'puzzle',
    active: true,
    dateAdded: '2023-06-01T12:00:00Z'
  },
  {
    id: 'tetris',
    title: {
      en: 'Tetris',
      zh: '俄罗斯方块'
    },
    description: {
      en: 'Arrange falling blocks to create and destroy horizontal lines.',
      zh: '排列下落的方块，创建并消除水平线。'
    },
    iframeUrl: 'https://tetris.com/play-tetris',
    thumbnail: '/images/placeholder.jpg',
    category: 'puzzle',
    active: true,
    dateAdded: '2023-06-03T12:00:00Z'
  },
  {
    id: 'snake',
    title: {
      en: 'Snake',
      zh: '贪吃蛇'
    },
    description: {
      en: 'Control a snake to eat food and avoid hitting walls or itself.',
      zh: '控制蛇吃食物，避免撞到墙壁或自身。'
    },
    iframeUrl: 'https://playsnake.org',
    thumbnail: '/images/placeholder.jpg',
    category: 'action',
    active: true,
    dateAdded: '2023-06-04T12:00:00Z'
  }
];

const fallbackCategories = [
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
    id: 'puzzle',
    name: {
      en: 'Puzzle',
      zh: '益智游戏'
    },
    order: 1,
    active: true
  },
  {
    id: 'action',
    name: {
      en: 'Action',
      zh: '动作游戏'
    },
    order: 2,
    active: true
  }
];

// 内嵌数据（避免依赖外部JSON文件）
const gamesData = {
  "games": [
    {
      "id": "2048",
      "title": {
        "en": "2048",
        "zh": "2048数字方块"
      },
      "description": {
        "en": "Join the numbers and get to the 2048 tile! Classic and addictive puzzle game.",
        "zh": "合并相同数字，获得2048方块！经典且让人上瘾的益智游戏。"
      },
      "iframeUrl": "https://play2048.co/",
      "thumbnail": "/images/placeholder.jpg",
      "category": "puzzle",
      "active": true,
      "dateAdded": "2023-06-01T12:00:00Z"
    },
    {
      "id": "wordle",
      "title": {
        "en": "Wordle Game",
        "zh": "猜单词"
      },
      "description": {
        "en": "Guess the hidden word in 6 tries. Each guess must be a valid 5-letter word.",
        "zh": "6次机会猜出隐藏的单词。每次猜测必须是有效的5个字母单词。"
      },
      "iframeUrl": "https://wordlegame.org/",
      "thumbnail": "/images/placeholder.jpg",
      "category": "puzzle",
      "active": true,
      "dateAdded": "2023-08-15T12:00:00Z"
    },
    {
      "id": "tetris",
      "title": {
        "en": "Tetris",
        "zh": "俄罗斯方块"
      },
      "description": {
        "en": "The classic tile-matching game where you arrange falling blocks to create and destroy lines.",
        "zh": "经典的方块消除游戏，排列下落的方块，创建并消除水平线。"
      },
      "iframeUrl": "https://www.freetetris.org/game.php",
      "thumbnail": "/images/placeholder.jpg",
      "category": "puzzle",
      "active": true,
      "dateAdded": "2023-06-03T12:00:00Z"
    },
    {
      "id": "snake",
      "title": {
        "en": "Snake Game",
        "zh": "贪吃蛇"
      },
      "description": {
        "en": "Control a snake to eat food and grow longer, but avoid hitting walls or yourself.",
        "zh": "控制蛇吃食物变得更长，但要避免撞到墙壁或自身。"
      },
      "iframeUrl": "https://www.google.com/fbx?fbx=snake_arcade",
      "thumbnail": "/images/placeholder.jpg",
      "category": "action",
      "active": true,
      "dateAdded": "2023-06-04T12:00:00Z"
    },
    {
      "id": "pacman",
      "title": {
        "en": "Pac-Man",
        "zh": "吃豆人"
      },
      "description": {
        "en": "Navigate Pac-Man through a maze, eating dots and avoiding ghosts in this classic arcade game.",
        "zh": "在这款经典街机游戏中，引导吃豆人穿过迷宫，吃掉豆子并避开幽灵。"
      },
      "iframeUrl": "https://www.google.com/logos/2010/pacman10-i.html",
      "thumbnail": "/images/placeholder.jpg",
      "category": "action",
      "active": true,
      "dateAdded": "2023-06-06T12:00:00Z"
    },
    {
      "id": "chess",
      "title": {
        "en": "Chess",
        "zh": "国际象棋"
      },
      "description": {
        "en": "Play the classic game of chess against the computer at different difficulty levels.",
        "zh": "以不同难度级别与电脑对弈经典的国际象棋游戏。"
      },
      "iframeUrl": "https://www.Chess.com/play/computer",
      "thumbnail": "/images/placeholder.jpg",
      "category": "strategy",
      "active": true,
      "dateAdded": "2023-07-05T12:00:00Z"
    },
    {
      "id": "sudoku",
      "title": {
        "en": "Sudoku",
        "zh": "数独"
      },
      "description": {
        "en": "Fill in the grid so that every row, column, and region contains the digits 1-9 without repetition.",
        "zh": "填写网格，使每行、每列和每个区域都包含数字1-9，且不重复。"
      },
      "iframeUrl": "https://sudoku.com/",
      "thumbnail": "/images/placeholder.jpg",
      "category": "puzzle",
      "active": true,
      "dateAdded": "2023-07-12T12:00:00Z"
    },
    {
      "id": "minesweeper",
      "title": {
        "en": "Minesweeper",
        "zh": "扫雷"
      },
      "description": {
        "en": "Find all mines on the board without detonating any of them in this classic puzzle game.",
        "zh": "在这个经典益智游戏中，找出所有地雷，但不要触发它们。"
      },
      "iframeUrl": "https://minesweeper.online/",
      "thumbnail": "/images/placeholder.jpg",
      "category": "puzzle",
      "active": true,
      "dateAdded": "2023-06-05T12:00:00Z"
    }
  ]
};

const categoriesData = {
  "categories": [
    {
      "id": "all",
      "name": {
        "en": "All Games",
        "zh": "所有游戏"
      },
      "description": {
        "en": "Browse all games in our collection",
        "zh": "浏览我们收集的所有游戏"
      },
      "icon": "🎲"
    },
    {
      "id": "action",
      "name": {
        "en": "Action",
        "zh": "动作游戏"
      },
      "description": {
        "en": "Fast-paced games requiring quick reflexes",
        "zh": "需要快速反应的高节奏游戏"
      },
      "icon": "🎮"
    },
    {
      "id": "puzzle",
      "name": {
        "en": "Puzzle",
        "zh": "益智游戏"
      },
      "description": {
        "en": "Brain teasers and logical challenges",
        "zh": "脑筋急转弯和逻辑挑战"
      },
      "icon": "🧩"
    },
    {
      "id": "strategy",
      "name": {
        "en": "Strategy",
        "zh": "策略游戏"
      },
      "description": {
        "en": "Planning and strategic thinking games",
        "zh": "需要规划和战略思维的游戏"
      },
      "icon": "♟️"
    }
  ]
};

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM加载完成，开始初始化应用");
  
  try {
    // 初始化语言
    initializeLanguage();
    
    // 加载收藏夹数据
    loadFavorites();
    
    // 加载游戏数据和分类数据
    await loadData();
    
    // 更新UI
    updateCategories();
    updateRecentGames();
    updateAllGames();
    
    // 设置事件监听器
    setupEventListeners();
    
    console.log("应用初始化完成");
  } catch (error) {
    console.error("应用初始化失败:", error);
    showError("加载应用时出错，请刷新页面重试");
  }
});

/**
 * 设置页面的事件监听器
 */
function setupEventListeners() {
  // 搜索按钮事件
  const searchButton = document.getElementById('searchButton');
  if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
  }
  
  // 搜索输入框回车事件
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        handleSearch();
      }
    });
  }
  
  // 刷新按钮事件
  const reloadButton = document.getElementById('reloadButton');
  if (reloadButton) {
    reloadButton.addEventListener('click', async () => {
      document.getElementById('errorContainer').style.display = 'none';
      await loadData();
      updateCategories();
      updateRecentGames();
      updateAllGames();
    });
  }
  
  // 语言切换按钮
  const toggleLangButton = document.getElementById('toggleLang');
  if (toggleLangButton) {
    toggleLangButton.addEventListener('click', toggleLanguage);
  }
}

/**
 * 初始化语言设置
 */
function initializeLanguage() {
  currentLang = localStorage.getItem('locale') || 'zh';
  console.log("当前语言:", currentLang);
  updateLanguageButton();
  updatePageTitle();
}

/**
 * 更新语言切换按钮
 */
function updateLanguageButton() {
  const toggleButton = document.getElementById('toggleLang');
  if (toggleButton) {
    toggleButton.textContent = currentLang === 'zh' ? 'English' : '中文';
  }
}

/**
 * 更新页面标题和文本
 */
function updatePageTitle() {
  document.title = currentLang === 'zh' ? 'AI Stone 游戏导航' : 'AI Stone Game Navigation';
  
  const siteTitle = document.querySelector('.site-title');
  if (siteTitle) {
    siteTitle.textContent = currentLang === 'zh' ? 'AI Stone 游戏导航' : 'AI Stone Game Navigation';
  }
  
  // 更新导航链接文本
  const navLinks = document.querySelectorAll('.main-nav a');
  if (navLinks.length >= 3) {
    navLinks[0].textContent = currentLang === 'zh' ? '首页' : 'Home';
    navLinks[1].textContent = currentLang === 'zh' ? '收藏夹' : 'Favorites';
    navLinks[2].textContent = currentLang === 'zh' ? '管理' : 'Admin';
  }
  
  // 更新搜索框占位符和按钮文本
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = currentLang === 'zh' ? '搜索游戏...' : 'Search games...';
  }
  
  const searchButton = document.getElementById('searchButton');
  if (searchButton) {
    searchButton.textContent = currentLang === 'zh' ? '搜索' : 'Search';
  }
  
  // 更新区域标题
  const sectionTitles = document.querySelectorAll('.section-title');
  if (sectionTitles.length >= 3) {
    sectionTitles[0].textContent = currentLang === 'zh' ? '游戏分类' : 'Categories';
    sectionTitles[1].textContent = currentLang === 'zh' ? '热门游戏' : 'Popular Games';
    sectionTitles[2].textContent = currentLang === 'zh' ? '所有游戏' : 'All Games';
  }
}

/**
 * 切换语言
 */
function toggleLanguage() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('locale', currentLang);
  
  console.log("语言已切换为:", currentLang);
  
  updateLanguageButton();
  updatePageTitle();
  updateCategories();
  updateRecentGames();
  updateAllGames();
}

/**
 * 加载数据
 */
async function loadData() {
  console.log("开始加载数据");
  
  try {
    // 使用内嵌数据，不再尝试从外部加载
    currentGames = gamesData.games;
    currentCategories = categoriesData.categories;
    
    console.log("数据加载成功:", { 
      games: currentGames.length, 
      categories: currentCategories.length 
    });
    
    return { games: currentGames, categories: currentCategories };
  } catch (error) {
    console.error('数据加载失败:', error);
    showError('无法加载数据，请刷新页面重试');
    throw error;
  }
}

/**
 * 加载收藏夹数据
 */
function loadFavorites() {
  try {
    const favoritesData = localStorage.getItem('favorites');
    if (favoritesData) {
      favorites = JSON.parse(favoritesData);
      console.log("已加载收藏:", favorites.length);
    } else {
      favorites = [];
      console.log("没有收藏数据");
    }
  } catch (error) {
    console.error("加载收藏数据失败:", error);
    favorites = [];
  }
}

/**
 * 添加或移除收藏
 */
function toggleFavorite(gameId) {
  try {
    const index = favorites.indexOf(gameId);
    
    if (index === -1) {
      // 添加到收藏
      favorites.push(gameId);
      console.log("游戏已添加到收藏:", gameId);
    } else {
      // 从收藏中移除
      favorites.splice(index, 1);
      console.log("游戏已从收藏中移除:", gameId);
    }
    
    // 保存到本地存储
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // 更新UI
    updateAllGames();
    updateRecentGames();
  } catch (error) {
    console.error("更新收藏失败:", error);
  }
}

/**
 * 更新分类列表
 */
function updateCategories() {
  console.log("更新分类列表");
  
  const container = document.getElementById('categoriesContainer');
  if (!container) {
    console.error("找不到分类容器元素");
    return;
  }
  
  container.innerHTML = '';
  
  currentCategories.forEach(category => {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-card';
    categoryElement.dataset.id = category.id;
    
    categoryElement.innerHTML = `
      <div class="category-icon">${category.icon || '🎮'}</div>
      <h3>${category.name[currentLang] || '未命名分类'}</h3>
      <p>${category.description[currentLang] || '暂无描述'}</p>
    `;
    
    // 添加点击事件
    categoryElement.addEventListener('click', () => {
      const gamesInCategory = currentGames.filter(game => 
        category.id === 'all' ? true : game.category === category.id
      );
      
      console.log(`选择分类 ${category.id}，找到游戏:`, gamesInCategory.length);
      
      // 更新全部游戏区域标题
      const sectionTitle = document.querySelector('#allGamesSection .section-title');
      if (sectionTitle) {
        sectionTitle.textContent = category.name[currentLang];
      }
      
      renderGames(document.getElementById('allGamesContainer'), gamesInCategory);
      
      // 滚动到游戏区域
      const gamesSection = document.getElementById('allGamesSection');
      if (gamesSection) {
        gamesSection.scrollIntoView({behavior: 'smooth'});
      }
    });
    
    container.appendChild(categoryElement);
  });
}

/**
 * 更新最近游戏
 */
function updateRecentGames() {
  console.log("更新热门游戏");
  
  const container = document.getElementById('recentGamesContainer');
  if (!container) {
    console.error("找不到热门游戏容器元素");
    return;
  }
  
  // 获取最新的4个游戏
  const recentGames = [...currentGames]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 4);
  
  renderGames(container, recentGames);
}

/**
 * 更新所有游戏
 */
function updateAllGames() {
  console.log("更新所有游戏");
  
  const container = document.getElementById('allGamesContainer');
  if (!container) {
    console.error("找不到所有游戏容器元素");
    return;
  }
  
  renderGames(container, currentGames);
}

/**
 * 渲染游戏卡片
 */
function renderGames(container, games) {
  if (!container) {
    console.error("游戏容器不存在");
    return;
  }
  
  container.innerHTML = '';
  
  if (!games || games.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = currentLang === 'zh' ? '没有找到游戏' : 'No games found';
    container.appendChild(emptyMessage);
    return;
  }
  
  games.forEach(game => {
    try {
      const gameCard = document.createElement('div');
      gameCard.className = 'game-card';
      gameCard.dataset.id = game.id;
      
      const isFavorite = favorites.includes(game.id);
      
      const thumbnailSrc = game.thumbnail || '/images/placeholder.jpg';
      
      gameCard.innerHTML = `
        <div class="game-thumbnail">
          <img src="${thumbnailSrc}" alt="${game.title[currentLang]}" onerror="this.src='/images/placeholder.jpg'">
        </div>
        <div class="game-info">
          <h3>${game.title[currentLang]}</h3>
          <p>${game.description[currentLang]}</p>
          <div class="game-actions">
            <button class="play-button">${currentLang === 'zh' ? '开始' : 'Play'}</button>
            <button class="favorite-button ${isFavorite ? 'favorited' : ''}">
              ${isFavorite ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      `;
      
      // 添加游戏卡片点击事件
      const playButton = gameCard.querySelector('.play-button');
      if (playButton) {
        playButton.addEventListener('click', () => {
          window.location.href = `/game/index.html?id=${game.id}`;
        });
      }
      
      // 添加收藏按钮点击事件
      const favoriteButton = gameCard.querySelector('.favorite-button');
      if (favoriteButton) {
        favoriteButton.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleFavorite(game.id);
          
          // 更新按钮状态
          const isNowFavorite = favorites.includes(game.id);
          favoriteButton.textContent = isNowFavorite ? '❤️' : '🤍';
          favoriteButton.classList.toggle('favorited', isNowFavorite);
        });
      }
      
      container.appendChild(gameCard);
    } catch (error) {
      console.error(`渲染游戏卡片失败 [${game.id}]:`, error);
    }
  });
}

/**
 * 处理搜索功能
 */
function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) {
    console.error("找不到搜索输入框");
    return;
  }
  
  const searchTerm = searchInput.value.trim().toLowerCase();
  console.log("搜索关键词:", searchTerm);
  
  if (!searchTerm) {
    updateAllGames();
    return;
  }
  
  // 在标题和描述中搜索
  const filteredGames = currentGames.filter(game => {
    const titleMatch = game.title[currentLang].toLowerCase().includes(searchTerm);
    const descMatch = game.description[currentLang].toLowerCase().includes(searchTerm);
    return titleMatch || descMatch;
  });
  
  console.log(`搜索结果: 找到 ${filteredGames.length} 个游戏`);
  
  // 更新游戏列表
  const sectionTitle = document.querySelector('#allGamesSection .section-title');
  if (sectionTitle) {
    sectionTitle.textContent = currentLang === 'zh' 
      ? `搜索结果: ${searchTerm}` 
      : `Search Results: ${searchTerm}`;
  }
  
  renderGames(document.getElementById('allGamesContainer'), filteredGames);
  
  // 滚动到游戏区域
  const gamesSection = document.getElementById('allGamesSection');
  if (gamesSection) {
    gamesSection.scrollIntoView({behavior: 'smooth'});
  }
}

/**
 * 显示错误信息
 */
function showError(message) {
  console.error("显示错误:", message);
  
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');
  
  if (!errorContainer || !errorMessage) {
    console.error("找不到错误容器元素");
    alert(message); // 备用方案
    return;
  }
  
  errorMessage.textContent = currentLang === 'zh' 
    ? `加载失败: ${message}` 
    : `Loading Failed: ${message}`;
  
  errorContainer.style.display = 'flex';
} 