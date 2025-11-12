import { describe, it, expect } from 'vitest'
import { MoneyCalculator } from '../MoneyCalculator'

describe('MoneyCalculator', () => {
  describe('add', () => {
    it('should add multiple values correctly', () => {
      const result = MoneyCalculator.add(10.5, 20.3, 30.7)
      expect(result).toBe(61.5)
    })

    it('should handle single value', () => {
      const result = MoneyCalculator.add(100.50)
      expect(result).toBe(100.50)
    })

    it('should handle no values (return zero)', () => {
      const result = MoneyCalculator.add()
      expect(result).toBe(0)
    })

    it('should handle decimal precision correctly', () => {
      const result = MoneyCalculator.add(0.1, 0.2)
      expect(result).toBe(0.3)
    })

    it('should round to 2 decimal places', () => {
      const result = MoneyCalculator.add(10.555, 20.444)
      expect(result).toBe(31.00)
    })

    it('should handle large numbers', () => {
      const result = MoneyCalculator.add(1000000.99, 999999.01)
      expect(result).toBe(2000000.00)
    })
  })

  describe('subtract', () => {
    it('should subtract two values correctly', () => {
      const result = MoneyCalculator.subtract(100.50, 50.25)
      expect(result).toBe(50.25)
    })

    it('should handle zero subtraction', () => {
      const result = MoneyCalculator.subtract(100, 0)
      expect(result).toBe(100)
    })

    it('should handle negative results', () => {
      const result = MoneyCalculator.subtract(50, 100)
      expect(result).toBe(-50)
    })

    it('should handle decimal precision correctly', () => {
      const result = MoneyCalculator.subtract(0.3, 0.1)
      expect(result).toBe(0.2)
    })

    it('should round to 2 decimal places', () => {
      const result = MoneyCalculator.subtract(10.556, 5.444)
      expect(result).toBe(5.11)
    })
  })

  describe('multiply', () => {
    it('should multiply value by multiplier', () => {
      const result = MoneyCalculator.multiply(100, 2.5)
      expect(result).toBe(250)
    })

    it('should multiply by zero', () => {
      const result = MoneyCalculator.multiply(100, 0)
      expect(result).toBe(0)
    })

    it('should multiply by one', () => {
      const result = MoneyCalculator.multiply(100.50, 1)
      expect(result).toBe(100.50)
    })

    it('should handle decimal multiplication', () => {
      const result = MoneyCalculator.multiply(10.5, 3.3)
      expect(result).toBe(34.65)
    })

    it('should round to 2 decimal places', () => {
      const result = MoneyCalculator.multiply(10.333, 3)
      expect(result).toBe(31.00)
    })

    it('should handle negative multipliers', () => {
      const result = MoneyCalculator.multiply(100, -2)
      expect(result).toBe(-200)
    })
  })

  describe('divide', () => {
    it('should divide value by divisor', () => {
      const result = MoneyCalculator.divide(100, 2)
      expect(result).toBe(50)
    })

    it('should handle decimal division', () => {
      const result = MoneyCalculator.divide(100, 3)
      expect(result).toBe(33.33)
    })

    it('should throw error when dividing by zero', () => {
      expect(() => MoneyCalculator.divide(100, 0)).toThrow('Division by zero')
    })

    it('should handle division by one', () => {
      const result = MoneyCalculator.divide(100.50, 1)
      expect(result).toBe(100.50)
    })

    it('should round to 2 decimal places', () => {
      const result = MoneyCalculator.divide(10, 3)
      expect(result).toBe(3.33)
    })

    it('should handle negative divisors', () => {
      const result = MoneyCalculator.divide(100, -2)
      expect(result).toBe(-50)
    })
  })

  describe('round', () => {
    it('should round to 2 decimal places', () => {
      expect(MoneyCalculator.round(10.556)).toBe(10.56)
      expect(MoneyCalculator.round(10.554)).toBe(10.55)
      expect(MoneyCalculator.round(10.555)).toBe(10.56)
    })

    it('should handle values with less than 2 decimals', () => {
      expect(MoneyCalculator.round(10.5)).toBe(10.5)
      expect(MoneyCalculator.round(10)).toBe(10)
    })

    it('should handle zero', () => {
      expect(MoneyCalculator.round(0)).toBe(0)
    })

    it('should handle negative values', () => {
      expect(MoneyCalculator.round(-10.555)).toBe(-10.56)
    })
  })

  describe('splitEqually', () => {
    it('should split total equally among parts', () => {
      const parts = MoneyCalculator.splitEqually(100, 3)
      expect(parts).toHaveLength(3)
      expect(parts[0]).toBe(33.33)
      expect(parts[1]).toBe(33.33)
      expect(parts[2]).toBe(33.34) // Last part gets the remainder
    })

    it('should split total equally when divisible', () => {
      const parts = MoneyCalculator.splitEqually(100, 4)
      expect(parts).toHaveLength(4)
      expect(parts.every(p => p === 25)).toBe(true)
    })

    it('should handle single part', () => {
      const parts = MoneyCalculator.splitEqually(100, 1)
      expect(parts).toHaveLength(1)
      expect(parts[0]).toBe(100)
    })

    it('should ensure sum equals total', () => {
      const total = 100.99
      const parts = MoneyCalculator.splitEqually(total, 7)
      const sum = parts.reduce((acc, val) => MoneyCalculator.add(acc, val), 0)
      expect(sum).toBe(total)
    })

    it('should throw error for zero parts', () => {
      expect(() => MoneyCalculator.splitEqually(100, 0)).toThrow('Number of parts must be positive')
    })

    it('should throw error for negative parts', () => {
      expect(() => MoneyCalculator.splitEqually(100, -3)).toThrow('Number of parts must be positive')
    })

    it('should handle splitting small amounts', () => {
      const parts = MoneyCalculator.splitEqually(1, 3)
      expect(parts).toHaveLength(3)
      const sum = parts.reduce((acc, val) => MoneyCalculator.add(acc, val), 0)
      expect(sum).toBe(1)
    })
  })

  describe('equals', () => {
    it('should return true for equal values', () => {
      expect(MoneyCalculator.equals(100.50, 100.50)).toBe(true)
    })

    it('should return false for different values', () => {
      expect(MoneyCalculator.equals(100.50, 100.51)).toBe(false)
    })

    it('should handle floating point precision', () => {
      // Note: JavaScript 0.1 + 0.2 = 0.30000000000000004
      // Big.js helps but direct comparison may still have precision issues
      const sum = MoneyCalculator.add(0.1, 0.2)
      expect(MoneyCalculator.equals(sum, 0.3)).toBe(true)
    })

    it('should handle zero', () => {
      expect(MoneyCalculator.equals(0, 0)).toBe(true)
    })

    it('should handle negative values', () => {
      expect(MoneyCalculator.equals(-100.50, -100.50)).toBe(true)
      expect(MoneyCalculator.equals(-100.50, -100.51)).toBe(false)
    })
  })

  describe('isNegligible', () => {
    it('should return true for values less than 0.01', () => {
      expect(MoneyCalculator.isNegligible(0.005)).toBe(true)
      expect(MoneyCalculator.isNegligible(0.009)).toBe(true)
    })

    it('should return false for values greater than or equal to 0.01', () => {
      expect(MoneyCalculator.isNegligible(0.01)).toBe(false)
      expect(MoneyCalculator.isNegligible(0.05)).toBe(false)
    })

    it('should return true for zero', () => {
      expect(MoneyCalculator.isNegligible(0)).toBe(true)
    })

    it('should handle negative values', () => {
      expect(MoneyCalculator.isNegligible(-0.005)).toBe(true)
      expect(MoneyCalculator.isNegligible(-0.01)).toBe(false)
    })
  })

  describe('format', () => {
    it('should format value as BRL currency', () => {
      const formatted = MoneyCalculator.format(1234.56)
      expect(formatted).toMatch(/1\.234,56/)
    })

    it('should format zero', () => {
      const formatted = MoneyCalculator.format(0)
      expect(formatted).toBeTruthy()
    })

    it('should format negative values', () => {
      const formatted = MoneyCalculator.format(-1234.56)
      expect(formatted).toContain('-')
    })

    it('should format small values', () => {
      const formatted = MoneyCalculator.format(0.50)
      expect(formatted).toBeTruthy()
    })
  })
})
