/**
 * AI Stone游戏导航网站管理后台脚本
 * 包含管理后台通用功能和数据处理
 */

// 全局变量
let gamesData = []; // 游戏数据
let categoriesData = []; // 分类数据
let currentLang = 'zh'; // 当前语言，默认中文

/**
 * 页面加载完成时执行
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('管理后台脚本初始化');
  
  // 获取当前语言
  currentLang = localStorage.getItem('locale') || 'zh';
  
  // 检查登录状态
  checkAdminLogin();
  
  // 绑定语言切换按钮
  const langToggleBtn = document.getElementById('toggleLang');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', toggleLanguage);
  }
  
  // 加载数据
  loadAllData();
});

/**
 * 检查管理员登录状态
 * @returns {boolean} 是否已登录
 */
function checkAdminLogin() {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  console.log('管理员登录状态:', isLoggedIn);
  
  // 登录状态处理逻辑
  if (!isLoggedIn) {
    // 如果在管理员页面但未登录
    if (window.location.pathname.includes('/admin/') && 
        !window.location.pathname.includes('/admin/index.html')) {
      // 重定向到登录页
      window.location.href = '/admin/index.html';
      return false;
    }
  }
  
  return isLoggedIn;
}

/**
 * 管理员登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {boolean} 登录是否成功
 */
function adminLogin(username, password) {
  // 简单的验证逻辑，实际项目中应使用安全的身份验证方式
  if (username === 'admin' && password === 'password') {
    localStorage.setItem('adminLoggedIn', 'true');
    return true;
  }
  return false;
}

/**
 * 管理员登出
 */
function adminLogout() {
  localStorage.removeItem('adminLoggedIn');
  window.location.href = '/admin/index.html';
}

/**
 * 切换界面语言
 */
function toggleLanguage() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('locale', currentLang);
  
  // 更新语言按钮文本
  const langToggleBtn = document.getElementById('toggleLang');
  if (langToggleBtn) {
    langToggleBtn.textContent = currentLang === 'zh' ? 'English' : '中文';
  }
  
  // 更新页面UI
  updateAdminUI();
}

/**
 * 更新管理界面UI文本
 * 根据当前页面类型，选择性地更新UI元素
 */
function updateAdminUI() {
  // 获取当前页面类型
  const currentPage = window.location.pathname;
  
  // 更新导航链接文本
  updateNavigation();
  
  // 根据页面类型更新特定内容
  if (currentPage.includes('/admin/games.html')) {
    updateGamesPage();
  } else if (currentPage.includes('/admin/categories.html')) {
    updateCategoriesPage();
  } else if (currentPage.includes('/admin/upload.html')) {
    updateUploadPage();
  } else if (currentPage.includes('/admin/settings.html')) {
    updateSettingsPage();
  } else {
    // 管理首页
    updateAdminHomePage();
  }
}

/**
 * 更新导航文本
 */
function updateNavigation() {
  const translations = {
    zh: {
      'nav.home': '首页',
      'nav.favorites': '收藏夹',
      'nav.admin': '管理'
    },
    en: {
      'nav.home': 'Home',
      'nav.favorites': 'Favorites',
      'nav.admin': 'Admin'
    }
  };
  
  const navLinks = document.querySelectorAll('.main-nav a');
  if (navLinks.length >= 3) {
    navLinks[0].textContent = translations[currentLang]['nav.home'];
    navLinks[1].textContent = translations[currentLang]['nav.favorites'];
    navLinks[2].textContent = translations[currentLang]['nav.admin'];
  }
}

/**
 * 更新管理首页文本
 */
function updateAdminHomePage() {
  const translations = {
    zh: {
      'admin.title': 'AI Stone 游戏导航 - 管理后台',
      'admin.login': '管理员登录',
      'admin.username': '用户名',
      'admin.password': '密码',
      'admin.login.button': '登录',
      'admin.games': '游戏管理',
      'admin.games.desc': '添加、编辑和删除游戏',
      'admin.categories': '分类管理',
      'admin.categories.desc': '管理游戏分类',
      'admin.upload': '上传游戏',
      'admin.upload.desc': '添加新游戏到平台',
      'admin.settings': '网站设置',
      'admin.settings.desc': '管理网站基本设置'
    },
    en: {
      'admin.title': 'AI Stone Game Navigation - Admin',
      'admin.login': 'Administrator Login',
      'admin.username': 'Username',
      'admin.password': 'Password',
      'admin.login.button': 'Login',
      'admin.games': 'Game Management',
      'admin.games.desc': 'Add, edit and delete games',
      'admin.categories': 'Category Management',
      'admin.categories.desc': 'Manage game categories',
      'admin.upload': 'Upload Game',
      'admin.upload.desc': 'Add new games to the platform',
      'admin.settings': 'Website Settings',
      'admin.settings.desc': 'Manage website settings'
    }
  };
  
  document.title = translations[currentLang]['admin.title'];
  const titleElem = document.querySelector('.site-title');
  if (titleElem) {
    titleElem.textContent = translations[currentLang]['admin.title'];
  }
  
  // 更新登录表单
  const loginTitle = document.querySelector('#loginPanel h2');
  if (loginTitle) {
    loginTitle.textContent = translations[currentLang]['admin.login'];
  }
  
  const usernameLabel = document.querySelector('label[for="username"]');
  if (usernameLabel) {
    usernameLabel.textContent = translations[currentLang]['admin.username'];
  }
  
  const passwordLabel = document.querySelector('label[for="password"]');
  if (passwordLabel) {
    passwordLabel.textContent = translations[currentLang]['admin.password'];
  }
  
  const loginButton = document.querySelector('#loginForm .btn-primary');
  if (loginButton) {
    loginButton.textContent = translations[currentLang]['admin.login.button'];
  }
  
  // 更新菜单卡片
  const cards = document.querySelectorAll('.admin-card h3');
  const cardDescs = document.querySelectorAll('.admin-card p');
  
  if (cards.length >= 4) {
    cards[0].textContent = translations[currentLang]['admin.games'];
    cards[1].textContent = translations[currentLang]['admin.categories'];
    cards[2].textContent = translations[currentLang]['admin.upload'];
    cards[3].textContent = translations[currentLang]['admin.settings'];
    
    cardDescs[0].textContent = translations[currentLang]['admin.games.desc'];
    cardDescs[1].textContent = translations[currentLang]['admin.categories.desc'];
    cardDescs[2].textContent = translations[currentLang]['admin.upload.desc'];
    cardDescs[3].textContent = translations[currentLang]['admin.settings.desc'];
  }
}

/**
 * 更新游戏管理页面文本
 */
function updateGamesPage() {
  // 相应页面翻译实现
}

/**
 * 更新分类管理页面文本
 */
function updateCategoriesPage() {
  // 相应页面翻译实现
}

/**
 * 更新上传页面文本
 */
function updateUploadPage() {
  // 相应页面翻译实现
}

/**
 * 更新设置页面文本
 */
function updateSettingsPage() {
  // 相应页面翻译实现
}

/**
 * 加载所有数据
 */
async function loadAllData() {
  try {
    // 尝试加载内置数据和自定义数据
    const [games, categories] = await Promise.all([
      loadGamesData(),
      loadCategoriesData()
    ]);
    
    gamesData = games;
    categoriesData = categories;
    
    console.log(`已加载 ${gamesData.length} 个游戏和 ${categoriesData.length} 个分类`);
    
    // 加载成功后触发数据准备完成事件
    document.dispatchEvent(new CustomEvent('admin-data-ready'));
  } catch (error) {
    console.error('加载数据失败:', error);
    showAdminAlert('数据加载失败，请刷新页面重试。', 'danger');
  }
}

/**
 * 加载游戏数据
 * @returns {Promise<Array>} 游戏数据数组
 */
async function loadGamesData() {
  try {
    // 合并内置游戏和自定义游戏
    const builtInGames = await loadBuiltInGames();
    const customGames = loadCustomGames();
    
    // 合并并按时间排序
    return [...builtInGames, ...customGames].sort((a, b) => 
      new Date(b.dateAdded) - new Date(a.dateAdded)
    );
  } catch (error) {
    console.error('加载游戏数据失败:', error);
    return [];
  }
}

/**
 * 加载内置游戏数据
 * @returns {Promise<Array>} 内置游戏数据
 */
async function loadBuiltInGames() {
  // 在生产环境中应从服务器获取，这里使用内嵌数据
  const gamesData = {
    games: [
      {
        id: "2048",
        title: {
          en: "2048",
          zh: "2048数字方块"
        },
        description: {
          en: "Join the numbers and get to the 2048 tile! Classic puzzle game.",
          zh: "合并相同数字，获得2048方块！经典益智游戏。"
        },
        iframeUrl: "https://play2048.co/",
        thumbnail: "/images/placeholder.jpg",
        category: "puzzle",
        active: true,
        dateAdded: "2023-06-01T12:00:00Z"
      },
      // 这里应有更多内置游戏
    ]
  };
  
  return gamesData.games;
}

/**
 * 加载自定义游戏数据
 * @returns {Array} 自定义游戏数据
 */
function loadCustomGames() {
  try {
    const customGames = localStorage.getItem('customGames');
    return customGames ? JSON.parse(customGames) : [];
  } catch (error) {
    console.error('加载自定义游戏失败:', error);
    return [];
  }
}

/**
 * 加载分类数据
 * @returns {Promise<Array>} 分类数据
 */
async function loadCategoriesData() {
  try {
    // 使用内嵌分类数据
    const categoriesData = {
      categories: [
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
          icon: "🎲"
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
          icon: "🎮"
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
          icon: "🧩"
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
          icon: "♟️"
        }
      ]
    };
    
    return categoriesData.categories;
  } catch (error) {
    console.error('加载分类数据失败:', error);
    return [];
  }
}

/**
 * 保存游戏数据
 * @param {Object} gameData - 游戏数据对象
 * @returns {boolean} 保存是否成功
 */
function saveGame(gameData) {
  try {
    // 验证游戏数据
    if (!validateGameData(gameData)) {
      console.error('游戏数据验证失败');
      return false;
    }
    
    // 获取当前自定义游戏
    const customGames = JSON.parse(localStorage.getItem('customGames') || '[]');
    
    // 检查是否为编辑现有游戏
    const existingIndex = customGames.findIndex(game => game.id === gameData.id);
    
    if (existingIndex >= 0) {
      // 更新现有游戏
      customGames[existingIndex] = gameData;
    } else {
      // 添加新游戏
      customGames.push(gameData);
    }
    
    // 保存回本地存储
    localStorage.setItem('customGames', JSON.stringify(customGames));
    
    console.log('游戏数据保存成功:', gameData.id);
    return true;
  } catch (error) {
    console.error('保存游戏数据失败:', error);
    return false;
  }
}

/**
 * 验证游戏数据
 * @param {Object} gameData - 游戏数据对象
 * @returns {boolean} 数据是否有效
 */
function validateGameData(gameData) {
  // 简单验证必填字段
  if (!gameData.id || !gameData.title || !gameData.description || 
      !gameData.iframeUrl || !gameData.category) {
    return false;
  }
  
  // 验证多语言内容
  if (!gameData.title.zh || !gameData.title.en || 
      !gameData.description.zh || !gameData.description.en) {
    return false;
  }
  
  return true;
}

/**
 * 删除游戏
 * @param {string} gameId - 要删除的游戏ID
 * @returns {boolean} 删除是否成功
 */
function deleteGame(gameId) {
  try {
    // 获取当前自定义游戏
    const customGames = JSON.parse(localStorage.getItem('customGames') || '[]');
    
    // 找到游戏索引
    const gameIndex = customGames.findIndex(game => game.id === gameId);
    
    if (gameIndex === -1) {
      console.error('游戏未找到:', gameId);
      return false;
    }
    
    // 删除游戏
    customGames.splice(gameIndex, 1);
    
    // 保存回本地存储
    localStorage.setItem('customGames', JSON.stringify(customGames));
    
    console.log('游戏已删除:', gameId);
    return true;
  } catch (error) {
    console.error('删除游戏失败:', error);
    return false;
  }
}

/**
 * 显示管理后台提醒消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, danger, warning, info)
 */
function showAdminAlert(message, type = 'info') {
  // 查找警告容器
  const alertContainer = document.getElementById('alertContainer');
  
  if (!alertContainer) {
    // 如果没有容器，创建一个
    const container = document.createElement('div');
    container.id = 'alertContainer';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
  }
  
  // 创建警告元素
  const alertEl = document.createElement('div');
  alertEl.className = `alert alert-${type}`;
  alertEl.style.marginBottom = '10px';
  alertEl.textContent = message;
  
  // 添加关闭按钮
  const closeBtn = document.createElement('span');
  closeBtn.style.marginLeft = '10px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = function() {
    alertEl.remove();
  };
  alertEl.appendChild(closeBtn);
  
  // 添加到容器
  alertContainer.appendChild(alertEl);
  
  // 5秒后自动关闭
  setTimeout(() => {
    if (alertEl.parentNode) {
      alertEl.remove();
    }
  }, 5000);
}

// 导出函数（在模块环境中使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkAdminLogin,
    adminLogin,
    adminLogout,
    loadAllData,
    saveGame,
    deleteGame,
    showAdminAlert
  };
} 