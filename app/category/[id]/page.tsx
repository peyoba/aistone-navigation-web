import { categories } from '../../data/games';
import CategoryClient from './CategoryClient';

// 为静态导出生成所有可能的分类ID参数
export function generateStaticParams() {
  return categories.map(category => ({
    id: category.id,
  }));
}

export default function CategoryPage() {
  return <CategoryClient />;
} 