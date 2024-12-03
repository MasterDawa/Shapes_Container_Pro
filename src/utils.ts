import Decimal from 'decimal.js';
import { formatDecimal as formatDecimalUtil } from './utils/decimal';

const SUFFIXES = [
  '', 'K', 'M', 'B', 'T',
  'Qa', 'Qi', 'Sx', 'Sp', 'Oc',
  'No', 'Dc', 'UDc', 'DDc', 'TDc',
  'QaDc', 'QiDc', 'SxDc', 'SpDc', 'ODc',
  'NDc', 'Vi', 'UVi', 'DVi', 'TVi',
  'QaVi', 'QiVi', 'SxVi', 'SpVi', 'OVi',
  'NVi', 'Tg', 'UTg', 'DTg', 'TTg',
  'QaTg', 'QiTg', 'SxTg', 'SpTg', 'OTg'
];

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num === 0) return '0';
  
  // Handle negative numbers
  if (num < 0) return '-' + formatNumber(-num);
  
  // Handle infinity
  if (!isFinite(num)) return 'Infinity';
  
  // Handle very large numbers with scientific notation
  if (num >= 1e120) {
    try {
      const exp = Math.floor(Math.log10(num));
      const mantissa = num / Math.pow(10, exp);
      return `${mantissa.toFixed(2)}e${exp}`;
    } catch (e) {
      console.error('Error formatting large number:', num, e);
      return 'Error';
    }
  }

  try {
    // Normal number formatting with suffixes
    if (num < 1000) return Math.floor(num).toString();

    const magnitude = Math.floor(Math.log10(num) / 3);
    const suffix = SUFFIXES[magnitude];
    
    if (!suffix) {
      // Fallback to scientific notation if no suffix available
      return num.toExponential(2).replace('+', '');
    }
    
    const scaled = num / Math.pow(1000, magnitude);
    const formatted = scaled >= 100 ? scaled.toFixed(0) : 
                     scaled >= 10 ? scaled.toFixed(1) : 
                     scaled.toFixed(2);
    
    return `${formatted}${suffix}`;
  } catch (e) {
    console.error('Error formatting number:', num, e);
    return 'Error';
  }
}

export function chance(percentage: number): boolean {
  return Math.random() * 100 < percentage;
}

export const formatDecimal = formatDecimalUtil;