/**
 * Express a width and height as a `width:height` ratio with small whole numbers, such as `16:9`.
 *
 * Uses continued fraction convergents, so rounded pixel sizes still resolve to the ratio they came from. When no
 * ratio with a denominator up to `maxDenominator` matches exactly, the closest one is prefixed with `≈`.
 */
export const formatAspectRatio = (width: number, height: number, maxDenominator = 20): string => {
  if (!width || !height) return '0:0';

  const value = width / height;
  let [previousNumerator, previousDenominator] = [1, 0];
  let [numerator, denominator] = [Math.floor(value), 1];
  let remainder = value - Math.floor(value);

  while (remainder > 1e-9) {
    const inverse = 1 / remainder;
    const term = Math.floor(inverse);
    const nextNumerator = term * numerator + previousNumerator;
    const nextDenominator = term * denominator + previousDenominator;

    if (nextDenominator > maxDenominator) break;

    [previousNumerator, previousDenominator] = [numerator, denominator];
    [numerator, denominator] = [nextNumerator, nextDenominator];
    remainder = inverse - term;
  }

  const isExact = numerator * height === denominator * width;

  return `${isExact ? '' : '≈'}${numerator}:${denominator}`;
};
