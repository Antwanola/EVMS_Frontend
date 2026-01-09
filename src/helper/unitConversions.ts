/**
 * Utility functions for converting energy and power units
 */

/**
 * Convert watt-hours (Wh) to kilowatt-hours (kWh)
 * @param wh - Value in watt-hours
 * @returns Formatted string with kWh unit
 */
export const convertWhToKwh = (wh: number): string => {
  const kwh = wh / 1000;
  return `${kwh.toFixed(2)} kWh`;
};

/**
 * Convert watts (W) to kilowatts (kW)
 * @param watts - Value in watts
 * @returns Formatted string with kW unit
 */
export const convertWToKw = (watts: number): string => {
  const kw = watts / 1000;
  return `${kw.toFixed(2)} kW`;
};

/**
 * Parse and convert meter value string to appropriate unit
 * @param meterValue - String like "16976199 Wh" or "5237.4 W"
 * @returns Converted value with appropriate unit
 */
export const convertMeterValue = (meterValue: string): string => {
  if (!meterValue || meterValue === '--') return meterValue;
  
  // Extract number and unit from string
  const match = meterValue.match(/^([\d.]+)\s*(\w+)$/);
  if (!match) return meterValue;
  
  const [, valueStr, unit] = match;
  const value = parseFloat(valueStr);
  
  switch (unit.toLowerCase()) {
    case 'wh':
      return convertWhToKwh(value);
    case 'w':
      return convertWToKw(value);
    default:
      return meterValue; // Return original if unit not recognized
  }
};

/**
 * Format numeric value with unit conversion
 * @param value - Numeric value
 * @param unit - Unit string (Wh, W, etc.)
 * @returns Formatted string with converted unit
 */
export const formatMeterValue = (value: number, unit: string): string => {
  switch (unit.toLowerCase()) {
    case 'wh':
      return convertWhToKwh(value);
    case 'w':
      return convertWToKw(value);
    default:
      return `${value} ${unit}`;
  }
};