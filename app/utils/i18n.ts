import { useCallback, useMemo } from 'react';

// 简易翻译函数
export const useTranslation = (locale: string, translations: Record<string, any>) => {
  const t = useMemo(() => {
    return (key: string): string => {
      const keys = key.split('.');
      let result: any = translations;
      
      for (const k of keys) {
        if (result[k] === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
        result = result[k];
      }
      
      if (typeof result !== 'string') {
        console.warn(`Translation result is not a string for key: ${key}`);
        return key;
      }
      
      return result;
    };
  }, [translations, locale]);

  return { t };
};

// 获取翻译数据
export const getTranslations = async (locale: string = 'en'): Promise<Record<string, any>> => {
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