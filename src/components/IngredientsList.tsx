import { Ingredient } from '@/types/recipe';

interface IngredientsListProps {
  ingredients: Ingredient[];
  showOriginal: boolean;
}

export function IngredientsList({ ingredients, showOriginal }: IngredientsListProps) {
  return (
    <ul className="space-y-2 ingredients-list">
      {ingredients.map((ing, index) => (
        <li key={index} className="flex items-start">
          <input
            type="checkbox"
            className="print:hidden mr-3 mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            id={`ingredient-${index}`}
          />
          <label
            htmlFor={`ingredient-${index}`}
            className="text-gray-800 cursor-pointer select-none"
          >
            {showOriginal ? ing.measurement.original : ing.measurement.metric}
          </label>
        </li>
      ))}
    </ul>
  );
}
