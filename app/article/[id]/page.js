import { notFound } from 'next/navigation';
import { ARTICLES, getArticleById } from '@/lib/articles';
import ArticleClientView from './ArticleClientView';

export function generateStaticParams() {
  return ARTICLES.map((art) => ({
    id: art.id,
  }));
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  // Related articles (same category, excluding current)
  const relatedArticles = ARTICLES.filter(
    (a) => a.id !== article.id && a.category === article.category
  ).slice(0, 3);

  const fullUrl = `https://terra-nova-nature-delta.vercel.app/article/${article.id}`;

  return (
    <ArticleClientView
      article={article}
      relatedArticles={relatedArticles}
      fullUrl={fullUrl}
    />
  );
}

