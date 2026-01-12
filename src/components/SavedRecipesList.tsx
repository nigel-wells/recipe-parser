'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types/recipe';
import { loadRecipes, deleteRecipe } from '@/lib/storage/localStorage';

export function SavedRecipesList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = loadRecipes();
    setRecipes(saved);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleView = (id: string) => {
    router.push(`/recipe?id=${id}`);
  };

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🍳</div>
        <p className="text-gray-500 text-xl font-medium">No saved recipes yet.</p>
        <p className="text-gray-400 text-sm mt-2">
          Parse a recipe from a URL to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-3xl">📚</span>
        Saved Recipes ({recipes.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:scale-[1.02] relative"
          >
            {/* Delete button - positioned on top right of image */}
            <button
              onClick={(e) => handleDelete(recipe.id, e)}
              className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm text-red-600 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-lg hover:scale-110"
              title="Delete recipe"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>

            <div onClick={() => handleView(recipe.id)} className="cursor-pointer">
              {recipe.imageUrl && (
                <div className="relative overflow-hidden">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {recipe.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    📅 {new Date(recipe.savedAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-3">
                    {recipe.servings && <span>👥 {recipe.servings}</span>}
                    {recipe.totalTime && <span>⏱️ {recipe.totalTime}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
