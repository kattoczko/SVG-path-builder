export function positiveNumber(n) {
  n = parseInt(n);
  if (Number.isNaN(n) || n < 0) n = 0;

  return n;
}
