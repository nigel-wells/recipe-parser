import { RecipeInput } from '@/components/RecipeInput';
import { SavedRecipesList } from '@/components/SavedRecipesList';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Recipe Parser
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Extract recipes from any URL, convert to NZ measurements,
          and save them for easy access and printing.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
          <span className="text-3xl">🔍</span>
          Parse a New Recipe
        </h2>
        <RecipeInput />
      </div>

      {/* Saved Recipes Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-200">
        <SavedRecipesList />
      </div>
    </div>
  );
}
