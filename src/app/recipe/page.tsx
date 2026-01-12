'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Recipe } from '@/types/recipe';
import { getRecipeById } from '@/lib/storage/localStorage';
import { RecipeDisplay } from '@/components/RecipeDisplay';

function RecipePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');

    if (!id) {
      setError('Recipe ID is required');
      setLoading(false);
      return;
    }

    const foundRecipe = getRecipeById(id);

    if (!foundRecipe) {
      setError('Recipe not found');
      setLoading(false);
      return;
    }

    setRecipe(foundRecipe);
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h1>
        <p className="text-gray-600 mb-6">{error || 'The recipe you are looking for does not exist.'}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return <RecipeDisplay recipe={recipe} />;
}

export default function RecipePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    }>
      <RecipePageContent />
    </Suspense>
  );
}
