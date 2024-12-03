import Decimal from 'decimal.js';
import { formatDecimal as formatDecimalUtil } from './decimal';

export const formatDecimal = formatDecimalUtil;

export function formatNumber(num: number | Decimal): string {
  if (num instanceof Decimal) {
    return formatDecimal(num);
  }
  return new Decimal(num).toFixed(0);
}

export function chance(percentage: number): boolean {
  return Math.random() * 100 < percentage;
} 