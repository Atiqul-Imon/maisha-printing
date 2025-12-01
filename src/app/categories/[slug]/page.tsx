import { notFound } from 'next/navigation';
import { getAllCategories, getCategoryBySlug } from '@/data/categories';
import CategoryDetailPage from '@/components/CategoryDetailPage';
import { getAllProducts } from '@/lib/products-server';
import { Product } from '@/types/product';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export const revalidate = 60; // Revalidate category pages every 60 seconds

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found - Maisha Printing',
      description: 'The category you are looking for could not be found.',
      robots: 'noindex, nofollow',
    };
  }

  return {
    title: `${category.name} - Maisha Printing`,
    description: category.description || `Browse our ${category.name} collection. Professional printing services in Bangladesh.`,
    keywords: `${category.name}, printing services, Bangladesh, ${category.name.toLowerCase().replace(/\s+/g, ', ')}`,
    openGraph: {
      title: `${category.name} - Maisha Printing`,
      description: category.description || `Browse our ${category.name} collection`,
      url: `https://maishaprinting.com/categories/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} - Maisha Printing`,
      description: category.description || `Browse our ${category.name} collection`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Fetch all products and filter by category
  const allProducts = await getAllProducts();
  const categoryProducts = allProducts.filter(
    (product: Product) => product.categorySlug === slug
  );

  return (
    <CategoryDetailPage category={category} products={categoryProducts} />
  );
}

