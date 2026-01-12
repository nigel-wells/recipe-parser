// Volume conversions: US measurements to metric (ml)
export const VOLUME_CONVERSIONS: Record<string, { metric: number; unit: string }> = {
  // Cups
  'cup': { metric: 250, unit: 'ml' },
  'cups': { metric: 250, unit: 'ml' },
  'c': { metric: 250, unit: 'ml' },

  // Tablespoons
  'tablespoon': { metric: 15, unit: 'ml' },
  'tablespoons': { metric: 15, unit: 'ml' },
  'tbsp': { metric: 15, unit: 'ml' },
  'tbs': { metric: 15, unit: 'ml' },
  'tb': { metric: 15, unit: 'ml' },
  'T': { metric: 15, unit: 'ml' },

  // Teaspoons
  'teaspoon': { metric: 5, unit: 'ml' },
  'teaspoons': { metric: 5, unit: 'ml' },
  'tsp': { metric: 5, unit: 'ml' },
  't': { metric: 5, unit: 'ml' },

  // Fluid ounces
  'fluid ounce': { metric: 30, unit: 'ml' },
  'fluid ounces': { metric: 30, unit: 'ml' },
  'fl oz': { metric: 30, unit: 'ml' },
  'fl. oz': { metric: 30, unit: 'ml' },
  'fl.oz': { metric: 30, unit: 'ml' },

  // Pints
  'pint': { metric: 473, unit: 'ml' },
  'pints': { metric: 473, unit: 'ml' },
  'pt': { metric: 473, unit: 'ml' },

  // Quarts
  'quart': { metric: 946, unit: 'ml' },
  'quarts': { metric: 946, unit: 'ml' },
  'qt': { metric: 946, unit: 'ml' },

  // Gallons
  'gallon': { metric: 3785, unit: 'ml' },
  'gallons': { metric: 3785, unit: 'ml' },
  'gal': { metric: 3785, unit: 'ml' },
};

// Weight conversions: US/Imperial measurements to metric (g)
export const WEIGHT_CONVERSIONS: Record<string, { metric: number; unit: string }> = {
  // Ounces
  'ounce': { metric: 28.35, unit: 'g' },
  'ounces': { metric: 28.35, unit: 'g' },
  'oz': { metric: 28.35, unit: 'g' },

  // Pounds
  'pound': { metric: 453.6, unit: 'g' },
  'pounds': { metric: 453.6, unit: 'g' },
  'lb': { metric: 453.6, unit: 'g' },
  'lbs': { metric: 453.6, unit: 'g' },
};

// NZ-specific equivalents for regional terms
export const NZ_EQUIVALENTS: Record<string, { amount: number; unit: string; note?: string }> = {
  // Butter
  'stick of butter': { amount: 125, unit: 'g', note: 'US stick' },
  'stick butter': { amount: 125, unit: 'g', note: 'US stick' },
  '1 stick of butter': { amount: 125, unit: 'g', note: 'US stick' },
  '1 stick butter': { amount: 125, unit: 'g', note: 'US stick' },

  // Canned goods (common sizes)
  'can (15 oz)': { amount: 425, unit: 'g' },
  'can (14.5 oz)': { amount: 410, unit: 'g' },
  'can (14 oz)': { amount: 400, unit: 'g' },
  'can (12 oz)': { amount: 340, unit: 'g' },
  'can (10.5 oz)': { amount: 300, unit: 'g' },
  'can (10 oz)': { amount: 280, unit: 'g' },
  'can (8 oz)': { amount: 225, unit: 'g' },
  'can (6 oz)': { amount: 170, unit: 'g' },

  // Packages
  'package cream cheese': { amount: 250, unit: 'g', note: 'Standard US package' },
  'package (8 oz) cream cheese': { amount: 225, unit: 'g' },

  // Eggs (for reference)
  'large egg': { amount: 50, unit: 'g', note: 'Approximate' },
  'medium egg': { amount: 44, unit: 'g', note: 'Approximate' },
};

// Temperature conversion
export const convertFahrenheitToCelsius = (fahrenheit: number): number => {
  return Math.round((fahrenheit - 32) * 5 / 9);
};

// Common temperature conversions for quick reference
export const COMMON_TEMP_CONVERSIONS: Record<number, number> = {
  200: 95,   // °F to °C
  250: 120,
  275: 135,
  300: 150,
  325: 165,
  350: 175,
  375: 190,
  400: 200,
  425: 220,
  450: 230,
  475: 245,
  500: 260,
};

// Fractional conversions
export const FRACTIONS: Record<string, number> = {
  '⅛': 0.125,
  '¼': 0.25,
  '⅓': 0.333,
  '⅜': 0.375,
  '½': 0.5,
  '⅝': 0.625,
  '⅔': 0.667,
  '¾': 0.75,
  '⅞': 0.875,

  // Text versions
  '1/8': 0.125,
  '1/4': 0.25,
  '1/3': 0.333,
  '3/8': 0.375,
  '1/2': 0.5,
  '5/8': 0.625,
  '2/3': 0.667,
  '3/4': 0.75,
  '7/8': 0.875,
};
