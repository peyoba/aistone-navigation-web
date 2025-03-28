import { useCallback } from 'react';

// 简易翻译函数
export const useTranslation = (locale: string, translations: Record<string, any>) => {
  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let result = translations;
    
    for (const k of keys) {
      if (result[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      result = result[k];
    }
    
    return result;
  }, [translations]);

  return { t };
};

// 获取翻译数据
export const getTranslations = async (locale: string = 'en') => {
  // 在实际应用中，这会是一个API调用或直接导入
  try {
    const translations = await import(`../../public/locales/${locale}/common.json`);
    return translations.default || translations;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    // 如果当前语言的翻译加载失败，返回英文翻译
    if (locale !== 'en') {
      return getTranslations('en');
    }
    return {};
  }
}; 