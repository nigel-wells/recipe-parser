import { Recipe, ParsedRecipe, RecipeStorage } from '@/types/recipe';

const STORAGE_KEY = 'recipe-parser:recipes';
const VERSION = '1.0';

/**
 * Load all recipes from localStorage
 */
export function loadRecipes(): Recipe[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const storage: RecipeStorage = JSON.parse(data);

    // Version check (for future migrations)
    if (storage.version !== VERSION) {
      console.warn('Storage version mismatch, may need migration');
    }

    return storage.recipes;
  } catch (error) {
    console.error('Error loading recipes from localStorage:', error);
    return [];
  }
}

/**
 * Save a new recipe to localStorage
 */
export function saveRecipe(recipe: ParsedRecipe): Recipe {
  const recipes = loadRecipes();

  const newRecipe: Recipe = {
    ...recipe,
    id: crypto.randomUUID(),
    savedAt: Date.now(),
  };

  recipes.unshift(newRecipe); // Add to beginning

  const storage: RecipeStorage = {
    version: VERSION,
    recipes,
    lastUpdated: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    return newRecipe;
  } catch (error) {
    // Handle quota exceeded
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      // Try removing oldest recipe and retry
      if (recipes.length > 1) {
        recipes.pop(); // Remove oldest
        storage.recipes = recipes;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
          console.warn('Removed oldest recipe due to storage quota');
          return newRecipe;
        } catch {
          throw new Error('Storage quota exceeded. Please delete some recipes.');
        }
      }
      throw new Error('Storage quota exceeded. Please delete some recipes.');
    }
    throw error;
  }
}

/**
 * Delete a recipe by ID
 */
export function deleteRecipe(id: string): void {
  const recipes = loadRecipes();
  const filtered = recipes.filter(r => r.id !== id);

  if (filtered.length === recipes.length) {
    console.warn(`Recipe with id ${id} not found`);
    return;
  }

  const storage: RecipeStorage = {
    version: VERSION,
    recipes: filtered,
    lastUpdated: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

/**
 * Get a single recipe by ID
 */
export function getRecipeById(id: string): Recipe | null {
  const recipes = loadRecipes();
  return recipes.find(r => r.id === id) || null;
}

/**
 * Check if a recipe URL already exists
 */
export function recipeExists(url: string): Recipe | null {
  const recipes = loadRecipes();
  return recipes.find(r => r.url === url) || null;
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): { used: number; total: number; percentage: number } {
  if (typeof window === 'undefined') {
    return { used: 0, total: 0, percentage: 0 };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const used = data ? new Blob([data]).size : 0;
    const total = 5 * 1024 * 1024; // Assume 5MB limit (conservative estimate)
    const percentage = (used / total) * 100;

    return { used, total, percentage };
  } catch {
    return { used: 0, total: 0, percentage: 0 };
  }
}
