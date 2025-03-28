export default function Footer({ t }: { t: any }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 网站信息 */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('site.title')}</h3>
            <p className="text-gray-300">{t('site.description')}</p>
          </div>
          
          {/* 快速链接 */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('nav.categories')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/category/action" className="text-gray-300 hover:text-white">
                  {t('categories.action')}
                </a>
              </li>
              <li>
                <a href="/category/puzzle" className="text-gray-300 hover:text-white">
                  {t('categories.puzzle')}
                </a>
              </li>
              <li>
                <a href="/category/adventure" className="text-gray-300 hover:text-white">
                  {t('categories.adventure')}
                </a>
              </li>
              <li>
                <a href="/category/strategy" className="text-gray-300 hover:text-white">
                  {t('categories.strategy')}
                </a>
              </li>
            </ul>
          </div>
          
          {/* 管理入口 */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('admin.dashboard')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/admin/login" className="text-gray-300 hover:text-white">
                  {t('admin.login')}
                </a>
              </li>
              <li>
                <a href="/admin/games" className="text-gray-300 hover:text-white">
                  {t('admin.gameManagement')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {currentYear} {t('site.title')}. {t('site.description')}</p>
        </div>
      </div>
    </footer>
  );
} 