'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ParseRecipeResponse } from '@/types/recipe';
import { saveRecipe, recipeExists } from '@/lib/storage/localStorage';

export function RecipeInput() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate URL
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    // Check if recipe already exists
    const existing = recipeExists(url);
    if (existing) {
      // Navigate to existing recipe
      router.push(`/recipe?id=${existing.id}`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/parse-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data: ParseRecipeResponse = await response.json();

      if (!data.success || !data.recipe) {
        setError(data.error || 'Failed to parse recipe');
        setLoading(false);
        return;
      }

      // Save to localStorage
      const savedRecipe = saveRecipe(data.recipe);

      // Navigate to recipe page
      router.push(`/recipe?id=${savedRecipe.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="space-y-5">
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-3">
            Recipe URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/recipe"
            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg shadow-sm hover:border-gray-300"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm shadow-sm">
            <span className="font-medium">⚠️ {error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Parsing Recipe...
            </span>
          ) : (
            '✨ Parse Recipe'
          )}
        </button>
      </div>
    </form>
  );
}
