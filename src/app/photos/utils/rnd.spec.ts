import { randomIntFromRange } from './rnd';

describe('randomIntFromRange', () => {
  it('should generate random numbers in range', () => {

    for (let index = 0; index < 1000; index++) {
      const rndVal = randomIntFromRange(1, 100);

      expect(rndVal).toBeGreaterThanOrEqual(1);
      expect(rndVal).toBeLessThanOrEqual(100);
    }
  });
});
