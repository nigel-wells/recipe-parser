/**
 * Decode HTML entities in a string
 */
export function decodeHtmlEntities(text: string): string {
  // Common HTML entities
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '...',
    '&deg;': '°',
    '&frac12;': '½',
    '&frac14;': '¼',
    '&frac34;': '¾',
  };

  let result = text;

  // Replace known entities
  for (const [entity, replacement] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), replacement);
  }

  // Handle numeric entities like &#160; or &#xA0;
  result = result.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  result = result.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

  return result;
}
