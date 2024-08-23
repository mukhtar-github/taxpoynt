import { calculateVAT, calculateIncomeTax } from './utils';

describe('Tax Calculations', () => {
  describe('calculateVAT', () => {
    it('should correctly calculate VAT for 100', () => {
      expect(calculateVAT(100)).toBeCloseTo(7.5, 2);
    });
  });

  describe('calculateIncomeTax', () => {
    beforeAll(async () => {
      // Wait for dynamic imports to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should calculate tax correctly for income in the first bracket', () => {
      expect(calculateIncomeTax(200000)).toBeCloseTo(14000, 0);
      expect(calculateIncomeTax(300000)).toBeCloseTo(21000, 0);
    });

    it('should calculate tax correctly for income in the second bracket', () => {
      expect(calculateIncomeTax(400000)).toBeCloseTo(32000, 0);
      expect(calculateIncomeTax(600000)).toBeCloseTo(54000, 0);
    });

    it('should calculate tax correctly for income in the third bracket', () => {
      expect(calculateIncomeTax(800000)).toBeCloseTo(84000, 0);
      expect(calculateIncomeTax(1100000)).toBeCloseTo(129000, 0);
    });

    it('should calculate tax correctly for income in the fourth bracket', () => {
      expect(calculateIncomeTax(1300000)).toBeCloseTo(167000, 0);
      expect(calculateIncomeTax(1600000)).toBeCloseTo(224000, 0);
    });

    it('should calculate tax correctly for income in the fifth bracket', () => {
      expect(calculateIncomeTax(2000000)).toBeCloseTo(308000, 0);
      expect(calculateIncomeTax(3200000)).toBeCloseTo(560000, 0);
    });

    it('should calculate tax correctly for income in the highest bracket', () => {
      expect(calculateIncomeTax(4000000)).toBeCloseTo(752000, 0);
      expect(calculateIncomeTax(5000000)).toBeCloseTo(992000, 0);
    });

    it('should handle edge cases correctly', () => {
      expect(calculateIncomeTax(0)).toBe(0);
      expect(calculateIncomeTax(300001)).toBeCloseTo(21000.11, 2);
      expect(calculateIncomeTax(3200001)).toBeCloseTo(560000.24, 2);
    });

    it('should handle decimal income amounts correctly', () => {
      expect(calculateIncomeTax(500000.50)).toBeCloseTo(43000.055, 2);
      expect(calculateIncomeTax(1000000.75)).toBeCloseTo(114000.1125, 2);
    });
  });
});