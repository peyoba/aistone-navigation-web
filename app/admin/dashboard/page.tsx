'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Game, Category } from '../../data/games';
import { getTranslations, useTranslation } from '../../utils/i18n';
import { getGames, getCategories, updateGameStatus } from '../../utils/dataService';
import SyncStatusPanel from '../../components/admin/SyncStatusPanel';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { t } = useTranslation(locale, translations);
  
  // 在客户端加载时获取当前语言和数据
  useEffect(() => {
    // 从localStorage获取语言设置
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
    
    // 加载翻译
    const loadTranslations = async () => {
      const trans = await getTranslations(savedLocale);
      setTranslations(trans);
    };
    
    // 加载游戏和分类数据
    const loadData = () => {
      const gamesData = getGames();
      const categoriesData = getCategories();
      setGames(gamesData);
      setCategories(categoriesData);
    };
    
    loadTranslations();
    loadData();
    
    // 检查是否已登录
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/admin/login');
    }
  }, []); // 删除router依赖，避免重复触发

  // 加载中状态
  if (!translations || Object.keys(translations).length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // 切换游戏状态
  const toggleGameStatus = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      try {
        console.log(`正在切换游戏 ${gameId} 的状态，从 ${game.active} 到 ${!game.active}`);
        // 显示正在切换的状态
        setGames(games.map(g => g.id === gameId ? { ...g, isToggling: true } : g));
        
        // 更新游戏状态并获取最新数据
        const updatedGames = updateGameStatus(gameId, !game.active);
        console.log('游戏状态更新成功');
        
        // 更新游戏列表状态，移除isToggling标志
        setGames(updatedGames.map(g => ({ ...g, isToggling: false })));
      } catch (error) {
        console.error('更新游戏状态时出错:', error);
        // 恢复原始状态，移除isToggling标志
        setGames(games.map(g => ({ ...g, isToggling: false })));
      }
    }
  };

  // 手动刷新数据
  const refreshData = () => {
    // 获取最新游戏数据
    const gamesData = getGames(true);  // true表示强制刷新
    const categoriesData = getCategories();
    setGames(gamesData);
    setCategories(categoriesData);
  };

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">{t('admin.dashboard')}</div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-300">
              {locale === 'en' ? 'View Site' : '查看网站'}
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              {locale === 'en' ? 'Logout' : '登出'}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <SyncStatusPanel locale={locale} />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">{t('admin.gameManagement')}</h1>
          
          <div className="flex justify-between mb-4">
            <button
              onClick={refreshData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {locale === 'en' ? 'Refresh Data' : '刷新数据'}
            </button>
            <Link 
              href="/admin/games/add" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {t('admin.addGame')}
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'en' ? 'Game' : '游戏'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'en' ? 'Category' : '分类'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'en' ? 'Status' : '状态'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'en' ? 'Actions' : '操作'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {games.map((game) => {
                  const category = categories.find(c => c.id === game.category);
                  return (
                    <tr key={game.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-md object-cover" src={game.thumbnail} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {locale === 'en' ? game.title.en : game.title.zh}
                            </div>
                            <div className="text-sm text-gray-500">
                              {game.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {category ? (locale === 'en' ? category.name.en : category.name.zh) : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${game.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {game.active 
                            ? (locale === 'en' ? 'Active' : '显示') 
                            : (locale === 'en' ? 'Hidden' : '隐藏')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => toggleGameStatus(game.id)}
                          disabled={game.isToggling}
                          className={`mr-2 px-3 py-1 rounded ${
                            game.isToggling ? 'bg-gray-300 text-gray-600' :
                            game.active ? 'bg-red-100 hover:bg-red-200 text-red-700' : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                        >
                          {game.isToggling 
                            ? (locale === 'en' ? 'Updating...' : '更新中...') 
                            : game.active 
                              ? (locale === 'en' ? 'Hide' : '隐藏') 
                              : (locale === 'en' ? 'Show' : '显示')}
                        </button>
                        <Link 
                          href={`/admin/games/edit/${game.id}`}
                          className="mr-2 px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
                        >
                          {locale === 'en' ? 'Edit' : '编辑'}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 