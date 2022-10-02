/**
 * Converts a temperature from Fahrenheit to Celsius.
 * @param fahrenheit The temperature in Fahrenheit.
 * @returns The temperature in Celsius.
 */
export function toCelsius(fahrenheit: number) {
  return (fahrenheit - 32) * (5 / 9);
}
