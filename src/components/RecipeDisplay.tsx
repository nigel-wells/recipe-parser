'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types/recipe';
import { IngredientsList } from './IngredientsList';
import { MeasurementToggle } from './MeasurementToggle';
import { PrintButton } from './PrintButton';
import { deleteRecipe } from '@/lib/storage/localStorage';

interface RecipeDisplayProps {
  recipe: Recipe;
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(recipe.id);
      router.push('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 print:mb-4">
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-80 object-cover rounded-2xl mb-6 shadow-lg print:h-48"
          />
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-2 print:text-2xl">{recipe.title}</h1>
      </div>

      {/* Recipe Info */}
      {(recipe.servings || recipe.prepTime || recipe.cookTime || recipe.totalTime) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 print:mb-4 print:text-sm">
          {recipe.servings && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 print:p-2">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Servings</div>
              <div className="text-lg font-bold text-gray-900 mt-1">{recipe.servings}</div>
            </div>
          )}
          {recipe.prepTime && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 print:p-2">
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Prep Time</div>
              <div className="text-lg font-bold text-gray-900 mt-1">{recipe.prepTime}</div>
            </div>
          )}
          {recipe.cookTime && (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100 print:p-2">
              <div className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Cook Time</div>
              <div className="text-lg font-bold text-gray-900 mt-1">{recipe.cookTime}</div>
            </div>
          )}
          {recipe.totalTime && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 print:p-2">
              <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">Total Time</div>
              <div className="text-lg font-bold text-gray-900 mt-1">{recipe.totalTime}</div>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="print:hidden flex items-center justify-between mb-8 gap-4 flex-wrap">
        <MeasurementToggle showOriginal={showOriginal} onToggle={setShowOriginal} />
        <div className="flex items-center gap-2">
          <PrintButton />
          <button
            onClick={handleDelete}
            className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 hover:scale-105"
            title="Delete recipe"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-8 print:gap-4 print:grid-cols-1">
        {/* Ingredients */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 print:shadow-none print:border-0 print:p-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 print:text-lg flex items-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm print:hidden">
              🥘
            </span>
            Ingredients
          </h2>
          <IngredientsList ingredients={recipe.ingredients} showOriginal={showOriginal} />
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 print:shadow-none print:border-0 print:p-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 print:text-lg flex items-center">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm print:hidden">
              📝
            </span>
            Instructions
          </h2>
          <ol className="space-y-5 instructions-list print:space-y-2">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex group">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold flex items-center justify-center mr-4 text-sm group-hover:scale-110 transition-transform print:bg-white print:text-black print:w-auto print:h-auto print:rounded-none">
                  {index + 1}
                </span>
                <span className="text-gray-700 leading-relaxed print:text-sm">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Notes */}
      {recipe.notes && recipe.notes.length > 0 && (
        <div className="mt-8 print:mt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 print:text-lg">Notes</h2>
          <ul className="space-y-2 text-gray-700 print:text-sm">
            {recipe.notes.map((note, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source */}
      <div className="mt-8 pt-6 border-t border-gray-200 print:hidden">
        <p className="text-sm text-gray-500">
          Source:{' '}
          <a
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {recipe.url}
          </a>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Saved on {new Date(recipe.savedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
