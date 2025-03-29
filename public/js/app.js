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

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
  // 初始化语言
  currentLang = getStoredLanguage();
  
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
});

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
    // 显示加载状态
    document.getElementById('loading').style.display = 'block';
    document.getElementById('gameGrid').style.display = 'none';
    
    // 并行加载数据
    const [gamesResponse, categoriesResponse] = await Promise.all([
      fetch('/data/games.json'),
      fetch('/data/categories.json')
    ]);
    
    if (!gamesResponse.ok || !categoriesResponse.ok) {
      throw new Error('数据加载失败');
    }
    
    const gamesData = await gamesResponse.json();
    const categoriesData = await categoriesResponse.json();
    
    games = gamesData.games;
    categories = categoriesData.categories;
    
    // 渲染游戏卡片
    renderGames();
    
    // 隐藏加载状态
    document.getElementById('loading').style.display = 'none';
    document.getElementById('gameGrid').style.display = 'grid';
  } catch (error) {
    console.error('数据加载错误:', error);
    document.getElementById('loading').innerHTML = `
      <p>加载数据时出错: ${error.message}</p>
      <button onclick="location.reload()">重试</button>
    `;
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