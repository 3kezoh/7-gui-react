/**
 * Determines whether `str` is a numeric value.
 */
export function isNumeric(str: string) {
  return !isNaN(+str) && !isNaN(parseFloat(str));
}
