/**
 * Fetch HTML content from a URL
 */
export async function fetchUrl(url: string): Promise<string> {
  try {
    // Validate URL
    const parsedUrl = new URL(url);
    if (!parsedUrl.protocol.startsWith('http')) {
      throw new Error('Invalid URL protocol. Must be http or https.');
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RecipeParser/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      // Add timeout (10 seconds)
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      throw new Error('URL does not return HTML content');
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
    throw new Error('Failed to fetch URL: Unknown error');
  }
}
