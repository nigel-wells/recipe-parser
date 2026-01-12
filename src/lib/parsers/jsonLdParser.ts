import * as cheerio from 'cheerio';
import { ParsedRecipe } from '@/types/recipe';
import { convertIngredients, convertInstructions } from '../converters/measurementConverter';
import { decodeHtmlEntities } from '../utils/textUtils';

interface JsonLdRecipe {
  '@type': string;
  name?: string;
  description?: string;
  recipeYield?: string | string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeIngredient?: string[];
  recipeInstructions?: any[];
  image?: string | string[] | { url: string };
}

/**
 * Extract JSON-LD Recipe data from HTML
 */
export function extractJsonLd(html: string, url: string): ParsedRecipe | null {
  try {
    const $ = cheerio.load(html);

    // Find all JSON-LD script tags
    const jsonLdScripts = $('script[type="application/ld+json"]');

    for (let i = 0; i < jsonLdScripts.length; i++) {
      const scriptContent = $(jsonLdScripts[i]).html();
      if (!scriptContent) continue;

      try {
        const json = JSON.parse(scriptContent);

        // Handle both single objects and arrays
        const recipes = Array.isArray(json) ? json : [json];

        for (const item of recipes) {
          // Check if this is a Recipe type or contains a Recipe
          const recipe = findRecipe(item);
          if (recipe) {
            return parseJsonLdRecipe(recipe, url);
          }
        }
      } catch (e) {
        // Skip invalid JSON
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting JSON-LD:', error);
    return null;
  }
}

/**
 * Recursively find Recipe object in JSON-LD structure
 */
function findRecipe(obj: any): JsonLdRecipe | null {
  if (!obj || typeof obj !== 'object') return null;

  // Check if this object is a Recipe
  if (obj['@type'] === 'Recipe') {
    return obj as JsonLdRecipe;
  }

  // Check if @type is an array containing "Recipe"
  if (Array.isArray(obj['@type']) && obj['@type'].includes('Recipe')) {
    return obj as JsonLdRecipe;
  }

  // Search in @graph property (common in some schemas)
  if (obj['@graph'] && Array.isArray(obj['@graph'])) {
    for (const item of obj['@graph']) {
      const recipe = findRecipe(item);
      if (recipe) return recipe;
    }
  }

  // Search in nested objects
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const recipe = findRecipe(obj[key]);
      if (recipe) return recipe;
    }
  }

  return null;
}

/**
 * Parse JSON-LD Recipe into ParsedRecipe format
 */
function parseJsonLdRecipe(recipe: JsonLdRecipe, url: string): ParsedRecipe {
  // Parse ingredients - decode HTML entities
  const ingredientStrings = (recipe.recipeIngredient || []).map(ing => decodeHtmlEntities(ing));
  const ingredientMeasurements = convertIngredients(ingredientStrings);
  const ingredients = ingredientMeasurements.map((measurement, index) => ({
    raw: ingredientStrings[index],
    measurement,
    item: extractIngredientName(ingredientStrings[index]),
  }));

  // Parse instructions
  const instructions = parseInstructions(recipe.recipeInstructions);
  const convertedInstructions = convertInstructions(instructions);

  // Parse image
  const imageUrl = parseImage(recipe.image);

  // Parse times
  const prepTime = parseTime(recipe.prepTime);
  const cookTime = parseTime(recipe.cookTime);
  const totalTime = parseTime(recipe.totalTime);

  // Parse yield/servings
  const servings = parseServings(recipe.recipeYield);

  return {
    url,
    title: decodeHtmlEntities(recipe.name || 'Untitled Recipe'),
    description: recipe.description ? decodeHtmlEntities(recipe.description) : undefined,
    servings: servings ? decodeHtmlEntities(servings) : undefined,
    prepTime,
    cookTime,
    totalTime,
    ingredients,
    instructions: convertedInstructions,
    imageUrl,
  };
}

/**
 * Extract ingredient name from ingredient string
 * Example: "1 cup flour" → "flour"
 */
function extractIngredientName(ingredient: string): string {
  // Remove measurement patterns and return the ingredient name
  const cleaned = ingredient
    .replace(/^\d+[\s\-\/\d]*[a-zA-Z.\s]*?\s+/, '') // Remove leading measurements
    .replace(/^(a|an|the)\s+/i, '') // Remove articles
    .trim();

  return cleaned || ingredient;
}

/**
 * Parse recipe instructions from various formats
 */
function parseInstructions(instructions: any[] | undefined): string[] {
  if (!instructions || !Array.isArray(instructions)) {
    return [];
  }

  const result: string[] = [];

  for (const instruction of instructions) {
    if (typeof instruction === 'string') {
      result.push(instruction);
    } else if (instruction['@type'] === 'HowToStep' || instruction.type === 'HowToStep') {
      const text = instruction.text || instruction.name || '';
      if (text) result.push(text);
    } else if (instruction['@type'] === 'HowToSection' || instruction.type === 'HowToSection') {
      // Handle sections with multiple steps
      const steps = parseInstructions(instruction.itemListElement || instruction.steps || []);
      result.push(...steps);
    } else if (instruction.text) {
      result.push(instruction.text);
    } else if (instruction.name) {
      result.push(instruction.name);
    }
  }

  return result
    .filter(s => s.trim().length > 0)
    .map(s => decodeHtmlEntities(s));
}

/**
 * Parse image URL from various formats
 */
function parseImage(image: string | string[] | { url: string } | undefined): string | undefined {
  if (!image) return undefined;

  if (typeof image === 'string') {
    return image;
  }

  if (Array.isArray(image) && image.length > 0) {
    return typeof image[0] === 'string' ? image[0] : (image[0] as any).url;
  }

  if (typeof image === 'object' && 'url' in image) {
    return image.url;
  }

  return undefined;
}

/**
 * Parse ISO 8601 duration to human-readable format
 * Example: "PT15M" → "15 minutes", "PT1H30M" → "1 hour 30 minutes"
 */
function parseTime(duration: string | undefined): string | undefined {
  if (!duration) return undefined;

  // Check if it's ISO 8601 format (PT...)
  if (duration.startsWith('PT')) {
    const hours = duration.match(/(\d+)H/);
    const minutes = duration.match(/(\d+)M/);

    const parts: string[] = [];
    if (hours) parts.push(`${hours[1]} hour${hours[1] === '1' ? '' : 's'}`);
    if (minutes) parts.push(`${minutes[1]} minute${minutes[1] === '1' ? '' : 's'}`);

    return parts.join(' ') || duration;
  }

  // Return as-is if already human-readable
  return duration;
}

/**
 * Parse servings/yield
 */
function parseServings(recipeYield: string | string[] | undefined): string | undefined {
  if (!recipeYield) return undefined;

  if (Array.isArray(recipeYield)) {
    return recipeYield[0];
  }

  return recipeYield;
}
