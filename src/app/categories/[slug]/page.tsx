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

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} - Maisha Printing`,
    description: category.description || `Browse our ${category.name} collection`,
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

