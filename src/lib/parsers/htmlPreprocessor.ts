import * as cheerio from 'cheerio';

/**
 * Preprocess HTML to reduce size and focus on recipe content
 * Goal: Reduce from 50-100KB to 5-15KB for LLM processing
 */
export function preprocessHtml(html: string): string {
  try {
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $(
      'script, style, iframe, noscript, svg, ' +
      'nav, header, footer, aside, ' +
      '.advertisement, .ad, .ads, .social-share, ' +
      '[class*="sidebar"], [class*="nav"], [class*="menu"], ' +
      '[class*="comment"], [class*="footer"], [class*="header"], ' +
      '[class*="popup"], [class*="modal"], [class*="overlay"], ' +
      '[id*="sidebar"], [id*="nav"], [id*="menu"]'
    ).remove();

    // Try to find the main content area
    let mainContent = $('main, article, [role="main"], .recipe, [class*="recipe"], [itemtype*="Recipe"]').first();

    if (mainContent.length === 0) {
      // Fallback to body if no main content found
      mainContent = $('body');
    }

    // Extract text content while preserving some structure
    const contentText = extractTextContent(mainContent, $);

    // Clean up the text
    const cleaned = contentText
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .trim();

    return cleaned;
  } catch (error) {
    console.error('Error preprocessing HTML:', error);
    // Return empty string if preprocessing fails
    return '';
  }
}

/**
 * Extract text content with basic structure preservation
 */
function extractTextContent(element: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): string {
  const parts: string[] = [];

  // Process headers
  element.find('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const text = $(el).text().trim();
    if (text) {
      parts.push(`\n## ${text}\n`);
    }
  });

  // Look for ingredients section
  const ingredientsSection = element.find(
    '[class*="ingredient"], [id*="ingredient"], ' +
    '[class*="Ingredient"], [id*="Ingredient"]'
  );

  if (ingredientsSection.length > 0) {
    parts.push('\n## Ingredients\n');
    ingredientsSection.find('li, p, div').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 2 && text.length < 200) {
        parts.push(`- ${text}`);
      }
    });
  }

  // Look for instructions/directions section
  const instructionsSection = element.find(
    '[class*="instruction"], [id*="instruction"], ' +
    '[class*="direction"], [id*="direction"], ' +
    '[class*="step"], [id*="step"], ' +
    '[class*="method"], [id*="method"], ' +
    'ol li'
  );

  if (instructionsSection.length > 0) {
    parts.push('\n## Instructions\n');
    let stepNum = 1;
    instructionsSection.each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 5 && text.length < 500) {
        parts.push(`${stepNum}. ${text}`);
        stepNum++;
      }
    });
  }

  // Look for time/servings info
  const timeInfo = element.find(
    '[class*="time"], [class*="Time"], ' +
    '[class*="yield"], [class*="Yield"], ' +
    '[class*="serving"], [class*="Serving"]'
  ).slice(0, 10);

  if (timeInfo.length > 0) {
    parts.push('\n## Recipe Info\n');
    timeInfo.each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 2 && text.length < 100) {
        parts.push(text);
      }
    });
  }

  // If no structured content found, just get main text
  if (parts.length === 0) {
    parts.push(element.text().trim());
  }

  return parts.join('\n');
}

/**
 * Estimate token count for a string (rough approximation)
 * ~4 characters per token on average
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
