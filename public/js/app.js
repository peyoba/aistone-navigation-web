/**
 * AI Stone游戏导航网站主脚本
 * 实现数据加载、国际化、分类过滤等功能
 */

// 全局变量
let games = [];
let categories = [];
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

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
  console.log('页面加载完成，开始初始化...');
  
  // 初始化语言
  currentLang = getStoredLanguage();
  console.log('当前语言:', currentLang);
  
  try {
    // 加载数据
    await loadData();
    
    // 设置语言
    setLanguage(currentLang);
    
    // 初始化分类
    initCategories();
    
    // 初始化收藏功能
    initFavorites();
    
    // 初始化搜索功能
    initSearch();
  } catch (error) {
    console.error('初始化过程中出现错误:', error);
    document.getElementById('loading').innerHTML = `
      <p>初始化出错: ${error.message}，使用备用数据</p>
      <button onclick="location.reload()" class="game-link">重试</button>
    `;
    
    // 使用后备数据
    useFallbackData();
  }
});

/**
 * 使用后备数据
 */
function useFallbackData() {
  console.log('使用后备数据...');
  games = fallbackGames;
  categories = fallbackCategories;
  
  // 设置语言
  setLanguage(currentLang);
  
  // 初始化分类
  initCategories();
  
  // 初始化收藏功能
  initFavorites();
  
  // 初始化搜索功能
  initSearch();
  
  // 渲染游戏卡片
  renderGames();
  
  // 隐藏加载状态
  document.getElementById('loading').style.display = 'none';
  document.getElementById('gameGrid').style.display = 'grid';
}

/**
 * 从localStorage获取存储的语言设置
 * @returns {string} 语言代码
 */
function getStoredLanguage() {
  return localStorage.getItem('locale') || 'zh';
}

/**
 * 加载游戏和分类数据
 */
async function loadData() {
  try {
    console.log('开始加载数据...');
    
    // 显示加载状态
    document.getElementById('loading').style.display = 'block';
    document.getElementById('gameGrid').style.display = 'none';
    
    // 加载游戏数据
    console.log('尝试加载games.json...');
    const gamesResponse = await fetch('/data/games.json');
    
    if (!gamesResponse.ok) {
      console.error('games.json加载失败:', gamesResponse.status, gamesResponse.statusText);
      throw new Error(`游戏数据加载失败 (${gamesResponse.status})`);
    }
    
    console.log('尝试解析games.json...');
    const gamesData = await gamesResponse.json();
    console.log('游戏数据加载成功:', gamesData);
    
    // 加载分类数据
    console.log('尝试加载categories.json...');
    const categoriesResponse = await fetch('/data/categories.json');
    
    if (!categoriesResponse.ok) {
      console.error('categories.json加载失败:', categoriesResponse.status, categoriesResponse.statusText);
      throw new Error(`分类数据加载失败 (${categoriesResponse.status})`);
    }
    
    console.log('尝试解析categories.json...');
    const categoriesData = await categoriesResponse.json();
    console.log('分类数据加载成功:', categoriesData);
    
    // 设置数据
    games = gamesData.games;
    categories = categoriesData.categories;
    
    console.log(`成功加载 ${games.length} 个游戏和 ${categories.length} 个分类`);
    
    // 渲染游戏卡片
    renderGames();
    
    // 隐藏加载状态
    document.getElementById('loading').style.display = 'none';
    document.getElementById('gameGrid').style.display = 'grid';
    
  } catch (error) {
    console.error('数据加载错误:', error);
    document.getElementById('loading').innerHTML = `
      <p>加载数据时出错: ${error.message}</p>
      <button onclick="useFallbackData()" class="game-link">使用备用数据</button>
      <button onclick="location.reload()" class="game-link">重试</button>
    `;
    throw error; // 重新抛出错误以便上层捕获
  }
}

/**
 * 设置网站语言
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 */
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('locale', lang);
  
  // 更新UI文本
  updateUIText();
  
  // 更新游戏卡片
  renderGames();
  
  // 更新分类标签
  updateCategoryLabels();
  
  // 更新语言选择器按钮样式
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

/**
 * 更新UI文本
 */
function updateUIText() {
  const translations = {
    'zh': {
      'site.title': 'AI Stone导航',
      'site.description': '探索AI和游戏的精彩世界',
      'button.play': '开始游戏',
      'button.favorite': '收藏',
      'button.unfavorite': '已收藏',
      'loading': '正在加载游戏数据...',
      'search.placeholder': '搜索游戏...',
      'search.button': '搜索',
      'no.results': '没有找到匹配的游戏'
    },
    'en': {
      'site.title': 'AI Stone Navigation',
      'site.description': 'Explore the world of AI and games',
      'button.play': 'Play Now',
      'button.favorite': 'Favorite',
      'button.unfavorite': 'Favorited',
      'loading': 'Loading game data...',
      'search.placeholder': 'Search games...',
      'search.button': 'Search',
      'no.results': 'No matching games found'
    }
  };
  
  const t = key => translations[currentLang][key] || key;
  
  // 更新标题和描述
  document.querySelector('header h1').textContent = t('site.title');
  document.querySelector('header p').textContent = t('site.description');
  document.querySelector('#loading p').textContent = t('loading');
  
  // 更新搜索栏
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.placeholder = t('search.placeholder');
    document.querySelector('.search-btn').textContent = t('search.button');
  }
  
  // 更新页面标题
  document.title = t('site.title');
}

/**
 * 初始化分类功能
 */
function initCategories() {
  const categoryNav = document.querySelector('.category-nav');
  if (!categoryNav) return;
  
  // 清空现有分类
  categoryNav.innerHTML = '';
  
  // 按顺序排列分类
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
  
  // 创建分类按钮
  sortedCategories.forEach(category => {
    if (category.active) {
      const btn = document.createElement('button');
      btn.className = `category-btn ${category.id === currentCategory ? 'active' : ''}`;
      btn.dataset.category = category.id;
      btn.textContent = category.name[currentLang];
      btn.onclick = () => filterGamesByCategory(category.id);
      categoryNav.appendChild(btn);
    }
  });
}

/**
 * 更新分类标签
 */
function updateCategoryLabels() {
  document.querySelectorAll('.category-btn').forEach(btn => {
    const categoryId = btn.dataset.category;
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      btn.textContent = category.name[currentLang];
    }
  });
}

/**
 * 按分类过滤游戏
 * @param {string} categoryId - 分类ID
 */
function filterGamesByCategory(categoryId) {
  currentCategory = categoryId;
  
  // 更新分类按钮样式
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === categoryId);
  });
  
  // 重新渲染游戏
  renderGames();
}

/**
 * 渲染游戏卡片
 */
function renderGames() {
  const gameGrid = document.getElementById('gameGrid');
  if (!gameGrid) return;
  
  // 清空现有游戏卡片
  gameGrid.innerHTML = '';
  
  // 过滤活跃游戏
  let filteredGames = games.filter(game => game.active);
  
  // 按分类过滤
  if (currentCategory !== 'all') {
    filteredGames = filteredGames.filter(game => game.category === currentCategory);
  }
  
  // 如果没有游戏
  if (filteredGames.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.textContent = currentLang === 'zh' ? '没有找到匹配的游戏' : 'No matching games found';
    gameGrid.appendChild(noResults);
    return;
  }
  
  // 渲染游戏卡片
  filteredGames.forEach(game => {
    const card = createGameCard(game);
    gameGrid.appendChild(card);
  });
}

/**
 * 创建游戏卡片
 * @param {Object} game - 游戏数据
 * @returns {HTMLElement} 游戏卡片元素
 */
function createGameCard(game) {
  const isFavorite = favorites.includes(game.id);
  
  const card = document.createElement('div');
  card.className = 'game-card';
  
  // 使用图片占位符处理图片加载错误
  const thumbnailSrc = game.thumbnail || '/images/placeholder.jpg';
  
  card.innerHTML = `
    <img class="game-thumbnail" src="${thumbnailSrc}" alt="${game.title[currentLang]}" onerror="this.src='/images/placeholder.jpg'">
    <div class="game-info">
      <h2 class="game-title">${game.title[currentLang]}</h2>
      <p class="game-desc">${game.description[currentLang]}</p>
      <div class="game-actions">
        <a href="/game/?id=${game.id}" class="game-link">${currentLang === 'zh' ? '开始游戏' : 'Play Now'}</a>
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${game.id}">
          ${isFavorite ? '★' : '☆'}
        </button>
      </div>
    </div>
  `;
  
  // 添加收藏按钮事件
  card.querySelector('.favorite-btn').addEventListener('click', (e) => {
    toggleFavorite(game.id);
    e.target.classList.toggle('active');
    e.target.textContent = e.target.classList.contains('active') ? '★' : '☆';
  });
  
  return card;
}

/**
 * 初始化收藏功能
 */
function initFavorites() {
  // 从localStorage加载收藏
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    favorites = JSON.parse(storedFavorites);
  }
}

/**
 * 切换游戏收藏状态
 * @param {string} gameId - 游戏ID
 */
function toggleFavorite(gameId) {
  const index = favorites.indexOf(gameId);
  if (index === -1) {
    // 添加到收藏
    favorites.push(gameId);
  } else {
    // 从收藏中移除
    favorites.splice(index, 1);
  }
  
  // 保存到localStorage
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

/**
 * 初始化搜索功能
 */
function initSearch() {
  const searchForm = document.querySelector('.search-bar');
  if (!searchForm) return;
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query) {
      searchGames(query);
    } else {
      // 如果搜索框为空，重置为显示所有游戏
      currentCategory = 'all';
      document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === 'all');
      });
      renderGames();
    }
  });
}

/**
 * 搜索游戏
 * @param {string} query - 搜索关键词
 */
function searchGames(query) {
  const gameGrid = document.getElementById('gameGrid');
  if (!gameGrid) return;
  
  // 清空现有游戏卡片
  gameGrid.innerHTML = '';
  
  // 过滤活跃游戏
  const activeGames = games.filter(game => game.active);
  
  // 按关键词搜索
  const searchResults = activeGames.filter(game => {
    const title = game.title[currentLang].toLowerCase();
    const description = game.description[currentLang].toLowerCase();
    return title.includes(query) || description.includes(query);
  });
  
  // 如果没有结果
  if (searchResults.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.textContent = currentLang === 'zh' ? '没有找到匹配的游戏' : 'No matching games found';
    gameGrid.appendChild(noResults);
    return;
  }
  
  // 渲染搜索结果
  searchResults.forEach(game => {
    const card = createGameCard(game);
    gameGrid.appendChild(card);
  });
} 