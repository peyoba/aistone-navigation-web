'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { categories } from '../../data/games';

interface HeaderProps {
  locale: string;
  t: any;
}

export default function Header({ locale, t }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 切换语言
  const handleLanguageChange = (newLocale: string) => {
    // 获取当前的路径，移除语言前缀
    let path = pathname || '/';
    if (path.startsWith(`/${locale}/`)) {
      path = path.replace(`/${locale}/`, '/');
    }
    
    // 跳转到新语言的同一页面
    router.push(`/${newLocale}${path}`);
  };

  // 切换移动菜单
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* 网站Logo */}
          <Link href="/">
            <div className="text-2xl font-bold">{t('site.title')}</div>
          </Link>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-gray-300">
              {t('nav.home')}
            </Link>
            <div className="relative group">
              <button className="flex items-center hover:text-gray-300">
                {t('nav.categories')}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {locale === 'en' ? category.name.en : category.name.zh}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* 语言切换 */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleLanguageChange('en')} 
                className={`px-2 py-1 rounded ${locale === 'en' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                {t('language.en')}
              </button>
              <button 
                onClick={() => handleLanguageChange('zh')} 
                className={`px-2 py-1 rounded ${locale === 'zh' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                {t('language.zh')}
              </button>
            </div>
            
            {/* 管理员登录 */}
            <Link 
              href="/admin/login" 
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              {t('admin.login')}
            </Link>
          </nav>

          {/* 移动菜单按钮 */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>

        {/* 移动导航菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <Link 
              href="/" 
              className="block py-2 hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            
            <div className="py-2">
              <div className="font-medium mb-1">{t('nav.categories')}</div>
              <div className="pl-4 space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="block py-1 hover:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {locale === 'en' ? category.name.en : category.name.zh}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="py-2">
              <div className="font-medium mb-1">{t('language.en')}/{t('language.zh')}</div>
              <div className="flex space-x-2 pl-4">
                <button 
                  onClick={() => handleLanguageChange('en')} 
                  className={`px-2 py-1 rounded ${locale === 'en' ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  {t('language.en')}
                </button>
                <button 
                  onClick={() => handleLanguageChange('zh')} 
                  className={`px-2 py-1 rounded ${locale === 'zh' ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  {t('language.zh')}
                </button>
              </div>
            </div>
            
            <Link 
              href="/admin/login" 
              className="block py-2 hover:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('admin.login')}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
} 