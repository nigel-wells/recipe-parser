import { NextRequest, NextResponse } from 'next/server';
import { parseRecipe } from '@/lib/parsers/recipeParser';
import { ParseRecipeResponse } from '@/types/recipe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json<ParseRecipeResponse>(
        {
          success: false,
          error: 'URL is required',
        },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json<ParseRecipeResponse>(
        {
          success: false,
          error: 'Invalid URL format',
        },
        { status: 400 }
      );
    }

    // Parse the recipe
    const result = await parseRecipe(url);

    if (!result.success) {
      return NextResponse.json<ParseRecipeResponse>(
        {
          success: false,
          error: result.error || 'Failed to parse recipe',
        },
        { status: 422 }
      );
    }

    return NextResponse.json<ParseRecipeResponse>({
      success: true,
      recipe: result.recipe,
      method: result.method,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json<ParseRecipeResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
