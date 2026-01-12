import Anthropic from '@anthropic-ai/sdk';
import { ParsedRecipe } from '@/types/recipe';
import { convertIngredients, convertInstructions } from '../converters/measurementConverter';
import { decodeHtmlEntities } from '../utils/textUtils';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface LLMRecipeResponse {
  title: string;
  description?: string;
  servings?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  ingredients: string[];
  instructions: string[];
  notes?: string[];
  imageUrl?: string;
}

/**
 * Parse recipe content using Claude API (LLM)
 */
export async function parseWithLlm(content: string, url: string): Promise<ParsedRecipe> {
  try {
    const prompt = `Extract recipe information from this webpage content.
Return ONLY valid JSON with this exact structure:
{
  "title": "Recipe Title",
  "description": "Brief description",
  "servings": "4 servings",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes",
  "totalTime": "45 minutes",
  "ingredients": [
    "1 cup flour",
    "2 eggs",
    ...
  ],
  "instructions": [
    "Step 1: Do this...",
    "Step 2: Do that...",
    ...
  ],
  "notes": ["Optional notes..."],
  "imageUrl": "https://..."
}

IMPORTANT:
- If a field is not found, omit it entirely (don't use null or empty string)
- Extract ingredients EXACTLY as written with measurements
- Each instruction should be a separate array item
- Do not include any text outside the JSON
- Ensure the JSON is valid and parseable

Content:
${content}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Use Haiku for cost efficiency
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract JSON from response
    const textContent = response.content[0];
    if (textContent.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    const jsonText = extractJson(textContent.text);
    const recipeData: LLMRecipeResponse = JSON.parse(jsonText);

    // Validate required fields
    if (!recipeData.title || !recipeData.ingredients || !recipeData.instructions) {
      throw new Error('Missing required recipe fields in LLM response');
    }

    // Convert measurements - decode HTML entities
    const decodedIngredients = recipeData.ingredients.map(ing => decodeHtmlEntities(ing));
    const ingredientMeasurements = convertIngredients(decodedIngredients);
    const ingredients = ingredientMeasurements.map((measurement, index) => ({
      raw: decodedIngredients[index],
      measurement,
      item: extractIngredientName(decodedIngredients[index]),
    }));

    const decodedInstructions = recipeData.instructions.map(inst => decodeHtmlEntities(inst));
    const convertedInstructions = convertInstructions(decodedInstructions);

    return {
      url,
      title: decodeHtmlEntities(recipeData.title),
      description: recipeData.description ? decodeHtmlEntities(recipeData.description) : undefined,
      servings: recipeData.servings ? decodeHtmlEntities(recipeData.servings) : undefined,
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      totalTime: recipeData.totalTime,
      ingredients,
      instructions: convertedInstructions,
      notes: recipeData.notes?.map(note => decodeHtmlEntities(note)),
      imageUrl: recipeData.imageUrl,
    };
  } catch (error) {
    console.error('Error parsing with LLM:', error);
    throw new Error(`Failed to parse recipe with Claude API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract JSON from response text (handles cases where LLM adds extra text)
 */
function extractJson(text: string): string {
  // Try to find JSON block
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  // If no JSON block found, try parsing the whole text
  return text.trim();
}

/**
 * Extract ingredient name from ingredient string
 * Example: "1 cup flour" → "flour"
 */
function extractIngredientName(ingredient: string): string {
  const cleaned = ingredient
    .replace(/^\d+[\s\-\/\d]*[a-zA-Z.\s]*?\s+/, '') // Remove leading measurements
    .replace(/^(a|an|the)\s+/i, '') // Remove articles
    .trim();

  return cleaned || ingredient;
}
