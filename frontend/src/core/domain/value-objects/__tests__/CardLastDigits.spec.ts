import { describe, it, expect } from 'vitest';
import { CardLastDigits } from '../CardLastDigits';

describe('CardLastDigits', () => {
  describe('constructor', () => {
    it('should create CardLastDigits with valid 4 digits', () => {
      const digits = new CardLastDigits('1234');
      expect(digits.value).toBe('1234');
    });

    it('should clean non-numeric characters', () => {
      const digits = new CardLastDigits('12-34');
      expect(digits.value).toBe('1234');
    });

    it('should clean spaces and special characters', () => {
      const digits = new CardLastDigits('12 34');
      expect(digits.value).toBe('1234');
    });

    it('should throw error for less than 4 digits', () => {
      expect(() => new CardLastDigits('123')).toThrow(
        'Card last digits must be exactly 4 numeric digits'
      );
    });

    it('should throw error for more than 4 digits', () => {
      expect(() => new CardLastDigits('12345')).toThrow(
        'Card last digits must be exactly 4 numeric digits'
      );
    });

    it('should throw error for empty string', () => {
      expect(() => new CardLastDigits('')).toThrow(
        'Card last digits must be exactly 4 numeric digits'
      );
    });

    it('should throw error for non-numeric string', () => {
      expect(() => new CardLastDigits('abcd')).toThrow(
        'Card last digits must be exactly 4 numeric digits'
      );
    });
  });

  describe('format', () => {
    it('should format with asterisks prefix', () => {
      const digits = new CardLastDigits('1234');
      expect(digits.format()).toBe('**** 1234');
    });

    it('should format consistently', () => {
      const digits = new CardLastDigits('5678');
      expect(digits.format()).toBe('**** 5678');
    });
  });

  describe('toString', () => {
    it('should return the raw value', () => {
      const digits = new CardLastDigits('1234');
      expect(digits.toString()).toBe('1234');
    });

    it('should return string without formatting', () => {
      const digits = new CardLastDigits('9999');
      const str = digits.toString();
      expect(str).not.toContain('*');
      expect(str).toBe('9999');
    });
  });

  describe('equals', () => {
    it('should return true for equal values', () => {
      const digits1 = new CardLastDigits('1234');
      const digits2 = new CardLastDigits('1234');
      expect(digits1.equals(digits2)).toBe(true);
    });

    it('should return false for different values', () => {
      const digits1 = new CardLastDigits('1234');
      const digits2 = new CardLastDigits('5678');
      expect(digits1.equals(digits2)).toBe(false);
    });

    it('should work with cleaned input', () => {
      const digits1 = new CardLastDigits('12-34');
      const digits2 = new CardLastDigits('1234');
      expect(digits1.equals(digits2)).toBe(true);
    });
  });
});
