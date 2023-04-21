/**
 * Generate random number from min to max (min and max included)
 * @param min min value
 * @param max max value
 * @returns random value in range
 */
export function randomIntFromRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
