import { Measurement } from './measurement';

export interface Ingredient {
  raw: string;                // Original text
  measurement: Measurement;
  item: string;               // The ingredient name
}

export interface Recipe {
  id: string;                 // UUID
  url: string;                // Original URL
  title: string;
  description?: string;
  servings?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  ingredients: Ingredient[];
  instructions: string[];
  notes?: string[];
  imageUrl?: string;
  savedAt: number;            // Timestamp
}

export interface ParsedRecipe extends Omit<Recipe, 'id' | 'savedAt'> {}

export interface RecipeStorage {
  version: string;
  recipes: Recipe[];
  lastUpdated: number;
}

export interface ParseRecipeResponse {
  success: boolean;
  recipe?: ParsedRecipe;
  error?: string;
  method?: 'json-ld' | 'llm' | 'fallback' | 'failed';
}
