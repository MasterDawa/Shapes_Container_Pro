import Decimal from 'decimal.js';

// Configure Decimal.js
Decimal.config({
  precision: 20,
  rounding: Decimal.ROUND_DOWN,
  maxE: 9e15,
  minE: -9e15,
  toExpPos: 9e15,
  toExpNeg: -9e15
});

export function formatDecimal(value: Decimal): string {
  if (value.lessThan(new Decimal(1e6))) {
    return value.toFixed(0);
  }
  
  const exp = value.e;
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
  const suffixIndex = Math.min(Math.floor(exp / 3), suffixes.length - 1);
  
  const scaled = value.dividedBy(new Decimal(10).pow(suffixIndex * 3));
  return `${scaled.toFixed(2)}${suffixes[suffixIndex]}`;
}

// Helper function to safely convert numbers to Decimal
export function toDecimal(value: number | string | Decimal): Decimal {
  if (value instanceof Decimal) return value;
  return new Decimal(value);
} 