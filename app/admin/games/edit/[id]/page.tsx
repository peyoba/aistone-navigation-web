'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Game, Category } from '../../../../data/games';
import { getTranslations, useTranslation } from '../../../../utils/i18n';
import { getGames, getCategories, updateGame } from '../../../../utils/dataService';

export default function EditGamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.id as string;
  
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const { t } = useTranslation(locale, translations);
  
  // 表单状态
  const [titleEn, setTitleEn] = useState('');
  const [titleZh, setTitleZh] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionZh, setDescriptionZh] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('');
  const [active, setActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [originalGame, setOriginalGame] = useState<Game | null>(null);
  
  // 在客户端加载时获取当前语言和数据
  useEffect(() => {
    // 检查是否已登录
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    
    // 从localStorage获取语言设置
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
    
    // 加载翻译
    const loadTranslations = async () => {
      const trans = await getTranslations(savedLocale);
      setTranslations(trans);
    };
    
    // 加载游戏数据
    const loadGameData = () => {
      const games = getGames();
      const game = games.find(g => g.id === gameId);
      
      if (game) {
        setOriginalGame(game);
        setTitleEn(game.title.en);
        setTitleZh(game.title.zh);
        setDescriptionEn(game.description.en);
        setDescriptionZh(game.description.zh);
        setIframeUrl(game.iframeUrl);
        setThumbnail(game.thumbnail);
        setCategory(game.category);
        setActive(game.active);
      } else {
        setNotFound(true);
      }
    };
    
    // 加载分类数据
    const loadCategories = () => {
      const categoriesData = getCategories();
      setCategories(categoriesData.filter(cat => cat.id !== 'all')); // 排除"所有游戏"分类
    };
    
    loadTranslations();
    loadGameData();
    loadCategories();
  }, [gameId]);
  
  // 加载中状态
  if (!translations || Object.keys(translations).length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // 游戏未找到
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {locale === 'en' ? 'Game Not Found' : '找不到游戏'}
          </h1>
          <p className="text-gray-600 mb-6">
            {locale === 'en' 
              ? `The game with ID "${gameId}" does not exist.` 
              : `找不到ID为"${gameId}"的游戏。`
            }
          </p>
          <Link 
            href="/admin/dashboard" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {locale === 'en' ? 'Back to Dashboard' : '返回仪表盘'}
          </Link>
        </div>
      </div>
    );
  }
  
  // 处理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // 验证表单数据
    if (!titleEn || !titleZh || !descriptionEn || !descriptionZh || !iframeUrl || !category) {
      setErrorMsg(locale === 'en' ? 'All fields are required' : '所有字段都是必填的');
      return;
    }
    
    if (!originalGame) {
      setErrorMsg(locale === 'en' ? 'Original game data not found' : '找不到原始游戏数据');
      return;
    }
    
    // 生成更新的游戏数据对象
    const updatedGame: Game = {
      ...originalGame,
      title: {
        en: titleEn,
        zh: titleZh
      },
      description: {
        en: descriptionEn,
        zh: descriptionZh
      },
      iframeUrl,
      thumbnail,
      category,
      active
    };
    
    try {
      // 更新游戏
      updateGame(updatedGame);
      // 更新成功后跳转回仪表盘
      router.push('/admin/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg(locale === 'en' ? 'Failed to update game' : '更新游戏失败');
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">{t('admin.editGame')}</div>
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="hover:text-gray-300">
              {locale === 'en' ? 'Back to Dashboard' : '返回仪表盘'}
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            {locale === 'en' ? `Edit Game: ${titleEn}` : `编辑游戏：${titleZh}`}
          </h1>
          
          {errorMsg && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              <p>{errorMsg}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 游戏ID（只读） */}
              <div>
                <label htmlFor="gameId" className="block text-sm font-medium text-gray-700">
                  {locale === 'en' ? 'Game ID' : '游戏ID'}
                </label>
                <input
                  type="text"
                  id="gameId"
                  value={gameId}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                />
              </div>
              
              {/* 分类 */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  {locale === 'en' ? 'Category' : '分类'}
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">{locale === 'en' ? '-- Select Category --' : '-- 选择分类 --'}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {locale === 'en' ? cat.name.en : cat.name.zh}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 英文标题 */}
              <div>
                <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700">
                  {locale === 'en' ? 'Title (English)' : '标题（英文）'}
                </label>
                <input
                  type="text"
                  id="titleEn"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {/* 中文标题 */}
              <div>
                <label htmlFor="titleZh" className="block text-sm font-medium text-gray-700">
                  {locale === 'en' ? 'Title (Chinese)' : '标题（中文）'}
                </label>
                <input
                  type="text"
                  id="titleZh"
                  value={titleZh}
                  onChange={(e) => setTitleZh(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {/* 英文描述 */}
              <div className="md:col-span-2">
                <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700">
                  {locale === 'en' ? 'Description (English)' : '描述（英文）'}
                </label>
                <textarea
                  id="descriptionEn"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {/* 中文描述 */}
              <div className="md:col-span-2">
                <label htmlFor="descriptionZh" className="block text-sm font-medium text-gray-700">
                  {locale === 'en' ? 'Description (Chinese)' : '描述（中文）'}
                </label>
                <textarea
                  id="descriptionZh"
                  value={descriptionZh}
                  onChange={(e) => setDescriptionZh(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {/* iframe URL */}
              <div className="md:col-span-2">
                <label htmlFor="iframeUrl" className="block text-sm font-medium text-gray-700">
                  {locale === 'en' ? 'Game URL (iframe src)' : '游戏URL（iframe源）'}
                </label>
                <input
                  type="text"
                  id="iframeUrl"
                  value={iframeUrl}
                  onChange={(e) => setIframeUrl(e.target.value)}
                  placeholder="https://example.com/game"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {/* 缩略图URL */}
              <div className="md:col-span-2">
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                  {locale === 'en' ? 'Thumbnail URL' : '缩略图URL'}
                </label>
                <input
                  type="text"
                  id="thumbnail"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="/images/games/your-image.jpg"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {locale === 'en' ? 'Use path from public directory' : '使用从public目录开始的路径'}
                </p>
              </div>
              
              {/* 预览缩略图 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Thumbnail Preview' : '缩略图预览'}
                </label>
                <div className="w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                  {thumbnail && (
                    <img 
                      src={thumbnail} 
                      alt="Game thumbnail" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.svg';
                      }}
                    />
                  )}
                </div>
              </div>
              
              {/* 游戏状态 */}
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    {locale === 'en' ? 'Active (visible on site)' : '激活（在网站上可见）'}
                  </label>
                </div>
              </div>
            </div>
            
            {/* 提交按钮 */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {locale === 'en' ? 'Cancel' : '取消'}
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {locale === 'en' ? 'Save Changes' : '保存更改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 