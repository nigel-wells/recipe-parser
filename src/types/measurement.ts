export interface Measurement {
  original: string;      // "1 stick butter"
  metric: string;        // "125g butter"
  nzEquivalent?: string; // If different from metric
}

export interface ParsedMeasurement {
  quantity: number | string; // number or range like "1-2"
  unit: string;
  ingredient: string;
}
