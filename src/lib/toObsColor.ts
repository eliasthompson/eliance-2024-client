/**
 * Turn a CSS hex color such as `#9147ff` or `#fff` into the integer OBS stores colors as: opaque, with the bytes in
 * alpha, blue, green, red order. Anything that is not a hex color becomes opaque white.
 */
export const toObsColor = (hexColor: string) => {
  const hex = hexColor.trim().replace(/^#/, '');
  const digits = hex.length === 3 ? [...hex].map((digit) => digit + digit).join('') : hex;

  if (!/^[0-9a-f]{6}$/i.test(digits)) return 0xffffffff;

  const red = parseInt(digits.slice(0, 2), 16);
  const green = parseInt(digits.slice(2, 4), 16);
  const blue = parseInt(digits.slice(4, 6), 16);

  return ((0xff << 24) | (blue << 16) | (green << 8) | red) >>> 0;
};
