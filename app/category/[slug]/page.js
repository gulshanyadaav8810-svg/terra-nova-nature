import { notFound } from 'next/navigation';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';
import { getArticlesByCategory } from '@/lib/articles';
import CategoryClientView from './CategoryClientView';

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryArticles = getArticlesByCategory(category.key);

  return <CategoryClientView category={category} categoryArticles={categoryArticles} />;
}

