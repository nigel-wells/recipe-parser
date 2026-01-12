import { Measurement, ParsedMeasurement } from '@/types/measurement';
import {
  VOLUME_CONVERSIONS,
  WEIGHT_CONVERSIONS,
  NZ_EQUIVALENTS,
  FRACTIONS,
  convertFahrenheitToCelsius,
} from './conversionData';

/**
 * Parse a measurement string into its components
 * Examples:
 *   "1 cup flour" → { quantity: 1, unit: 'cup', ingredient: 'flour' }
 *   "1/2 stick butter" → { quantity: 0.5, unit: 'stick', ingredient: 'butter' }
 *   "2-3 tablespoons milk" → { quantity: '2-3', unit: 'tablespoons', ingredient: 'milk' }
 */
export function parseMeasurement(text: string): ParsedMeasurement | null {
  const trimmed = text.trim();

  // Handle qualitative measurements (no conversion needed)
  const qualitative = ['to taste', 'pinch', 'dash', 'handful', 'some', 'a few'];
  if (qualitative.some(q => trimmed.toLowerCase().includes(q))) {
    return null; // Keep as-is
  }

  // Match patterns like: "1 1/2 cups flour" or "2-3 tablespoons milk" or "½ teaspoon salt"
  const pattern = /^(\d+(?:\s+\d+\/\d+|\.\d+)?|[⅛¼⅓⅜½⅝⅔¾⅞]|\d+\/\d+|\d+-\d+)\s*([a-zA-Z.\s]+?)(?:\s+(.+))?$/;
  const match = trimmed.match(pattern);

  if (!match) {
    return null;
  }

  const [, quantityStr, unitStr, ingredientStr] = match;

  // Parse quantity (handle fractions, decimals, ranges)
  let quantity: number | string = quantityStr.trim();

  // Check for range (e.g., "2-3")
  if (quantity.includes('-')) {
    // Keep as string for ranges
    quantity = quantity;
  } else {
    // Convert fractions
    if (FRACTIONS[quantity]) {
      quantity = FRACTIONS[quantity];
    } else if (quantity.includes('/')) {
      // Handle text fractions like "1/2"
      const parts = quantity.split('/');
      quantity = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else if (quantity.includes(' ')) {
      // Handle mixed fractions like "1 1/2"
      const parts = quantity.split(' ');
      const whole = parseFloat(parts[0]);
      const fracParts = parts[1].split('/');
      const frac = parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
      quantity = whole + frac;
    } else {
      quantity = parseFloat(quantity);
    }
  }

  const unit = unitStr.trim().toLowerCase();
  const ingredient = ingredientStr ? ingredientStr.trim() : '';

  return { quantity, unit, ingredient };
}

/**
 * Convert a parsed measurement to metric
 */
export function convertToMetric(parsed: ParsedMeasurement): string {
  const { quantity, unit, ingredient } = parsed;

  // Keep metric units as-is (already in metric)
  const metricUnits = ['g', 'gram', 'grams', 'kg', 'kilogram', 'kilograms', 'ml', 'milliliter', 'milliliters', 'l', 'liter', 'liters', 'litre', 'litres'];
  if (metricUnits.includes(unit)) {
    return `${quantity}${unit}${ingredient ? ` ${ingredient}` : ''}`.trim();
  }

  // Keep common measurements as-is (cups, teaspoons, tablespoons are fine in NZ)
  const commonUnits = ['cup', 'cups', 'c', 'teaspoon', 'teaspoons', 'tsp', 't', 'tablespoon', 'tablespoons', 'tbsp', 'tbs', 'tb', 'T'];
  if (commonUnits.includes(unit)) {
    return `${quantity} ${unit}${ingredient ? ` ${ingredient}` : ''}`.trim();
  }

  // Check NZ equivalents first (for regional terms like "stick of butter")
  const nzKey = `${typeof quantity === 'number' && quantity === 1 ? '1 ' : ''}${unit} ${ingredient}`.trim().toLowerCase();
  for (const [key, value] of Object.entries(NZ_EQUIVALENTS)) {
    if (nzKey.includes(key.toLowerCase()) || key.toLowerCase().includes(unit.toLowerCase())) {
      if (typeof quantity === 'number') {
        const amount = value.amount * quantity;
        const formattedAmount = formatAmount(amount);
        return `${formattedAmount}${value.unit}${ingredient ? ` ${ingredient}` : ''}`;
      }
    }
  }

  // Check volume conversions (only for non-common units)
  if (VOLUME_CONVERSIONS[unit]) {
    const conversion = VOLUME_CONVERSIONS[unit];
    if (typeof quantity === 'number') {
      const amount = conversion.metric * quantity;
      const formattedAmount = formatAmount(amount);
      const formattedUnit = amount >= 1000 ? 'L' : conversion.unit;
      const finalAmount = amount >= 1000 ? formatAmount(amount / 1000) : formattedAmount;
      return `${finalAmount}${formattedUnit}${ingredient ? ` ${ingredient}` : ''}`;
    } else {
      // Handle range
      const [min, max] = quantity.split('-').map(v => parseFloat(v.trim()));
      const minAmount = conversion.metric * min;
      const maxAmount = conversion.metric * max;
      const formattedMin = formatAmount(minAmount);
      const formattedMax = formatAmount(maxAmount);
      return `${formattedMin}-${formattedMax}${conversion.unit}${ingredient ? ` ${ingredient}` : ''}`;
    }
  }

  // Check weight conversions
  if (WEIGHT_CONVERSIONS[unit]) {
    const conversion = WEIGHT_CONVERSIONS[unit];
    if (typeof quantity === 'number') {
      const amount = conversion.metric * quantity;
      const formattedAmount = formatAmount(amount);
      const formattedUnit = amount >= 1000 ? 'kg' : conversion.unit;
      const finalAmount = amount >= 1000 ? formatAmount(amount / 1000) : formattedAmount;
      return `${finalAmount}${formattedUnit}${ingredient ? ` ${ingredient}` : ''}`;
    } else {
      // Handle range
      const [min, max] = quantity.split('-').map(v => parseFloat(v.trim()));
      const minAmount = conversion.metric * min;
      const maxAmount = conversion.metric * max;
      const formattedMin = formatAmount(minAmount);
      const formattedMax = formatAmount(maxAmount);
      return `${formattedMin}-${formattedMax}${conversion.unit}${ingredient ? ` ${ingredient}` : ''}`;
    }
  }

  // If already metric or no conversion needed, return as-is
  return `${quantity} ${unit}${ingredient ? ` ${ingredient}` : ''}`.trim();
}

/**
 * Format amount for display (remove unnecessary decimals)
 */
function formatAmount(amount: number): string {
  if (Number.isInteger(amount)) {
    return amount.toString();
  }
  // Round to 1 decimal place for most values
  const rounded = Math.round(amount * 10) / 10;
  if (Number.isInteger(rounded)) {
    return rounded.toString();
  }
  return rounded.toFixed(1);
}

/**
 * Convert an ingredient string to include both original and metric measurements
 */
export function convertIngredient(original: string): Measurement {
  const parsed = parseMeasurement(original);

  if (!parsed) {
    // No parseable measurement, return as-is
    return {
      original,
      metric: original,
    };
  }

  const { unit } = parsed;

  // Check if this unit should be kept as-is (metric or common units)
  const metricUnits = ['g', 'gram', 'grams', 'kg', 'kilogram', 'kilograms', 'ml', 'milliliter', 'milliliters', 'l', 'liter', 'liters', 'litre', 'litres'];
  const commonUnits = ['cup', 'cups', 'c', 'teaspoon', 'teaspoons', 'tsp', 't', 'tablespoon', 'tablespoons', 'tbsp', 'tbs', 'tb', 'T'];

  if (metricUnits.includes(unit) || commonUnits.includes(unit)) {
    // Keep original formatting (preserves fractions like "1/2")
    return {
      original,
      metric: original,
      nzEquivalent: original,
    };
  }

  const metric = convertToMetric(parsed);

  return {
    original,
    metric,
    nzEquivalent: metric, // For now, metric and NZ equivalent are the same
  };
}

/**
 * Convert temperature string from Fahrenheit to Celsius
 * Examples: "350°F" → "175°C", "350F" → "175°C", "350 degrees F" → "175°C"
 */
export function convertTemperature(text: string): string {
  const pattern = /(\d+)\s*(?:°|degrees?)?\s*F(?:ahrenheit)?/gi;
  return text.replace(pattern, (match, temp) => {
    const celsius = convertFahrenheitToCelsius(parseInt(temp));
    return `${celsius}°C`;
  });
}

/**
 * Process a list of ingredients and convert measurements
 */
export function convertIngredients(ingredients: string[]): Measurement[] {
  return ingredients.map(ing => convertIngredient(ing));
}

/**
 * Process instructions and convert any temperatures
 */
export function convertInstructions(instructions: string[]): string[] {
  return instructions.map(inst => convertTemperature(inst));
}
