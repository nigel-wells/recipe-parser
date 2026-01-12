import { ParsedRecipe } from '@/types/recipe';
import { extractJsonLd } from './jsonLdParser';
import { preprocessHtml, estimateTokens } from './htmlPreprocessor';
import { parseWithLlm } from './llmParser';
import { fetchUrl } from '../utils/fetchUrl';

export type ParseMethod = 'json-ld' | 'llm' | 'failed';

export interface ParseResult {
  success: boolean;
  recipe?: ParsedRecipe;
  error?: string;
  method?: ParseMethod;
}

/**
 * Main recipe parser orchestrator
 * Tries multiple parsing strategies in order:
 * 1. JSON-LD schema.org markup (fast, free, reliable)
 * 2. LLM parsing with Claude API (flexible, costs money)
 */
export async function parseRecipe(url: string): Promise<ParseResult> {
  try {
    console.log(`Parsing recipe from: ${url}`);

    // Step 1: Fetch HTML from URL
    console.log('Fetching HTML...');
    const html = await fetchUrl(url);
    console.log(`Fetched ${html.length} characters`);

    // Step 2: Try JSON-LD extraction first (fast and free)
    console.log('Attempting JSON-LD extraction...');
    const jsonLdResult = extractJsonLd(html, url);
    if (jsonLdResult) {
      console.log('Successfully parsed with JSON-LD');
      return {
        success: true,
        recipe: jsonLdResult,
        method: 'json-ld',
      };
    }
    console.log('No JSON-LD found, falling back to LLM parsing');

    // Step 3: Preprocess HTML to reduce token count
    console.log('Preprocessing HTML...');
    const cleanedContent = preprocessHtml(html);
    const tokenEstimate = estimateTokens(cleanedContent);
    console.log(`Cleaned content: ${cleanedContent.length} characters (est. ${tokenEstimate} tokens)`);

    if (cleanedContent.length < 100) {
      return {
        success: false,
        error: 'Could not extract meaningful content from the page. The page may require JavaScript or may not contain a recipe.',
        method: 'failed',
      };
    }

    // Step 4: Parse with Claude API (LLM)
    console.log('Parsing with Claude API...');
    const llmResult = await parseWithLlm(cleanedContent, url);
    console.log('Successfully parsed with LLM');

    return {
      success: true,
      recipe: llmResult,
      method: 'llm',
    };
  } catch (error) {
    console.error('Error parsing recipe:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred while parsing recipe',
      method: 'failed',
    };
  }
}
