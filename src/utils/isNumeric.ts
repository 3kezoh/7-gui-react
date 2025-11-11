/**
 * Determines whether `str` is a numeric value.
 */
export function isNumeric(str: string) {
  return !Number.isNaN(+str) && !Number.isNaN(parseFloat(str));
}
