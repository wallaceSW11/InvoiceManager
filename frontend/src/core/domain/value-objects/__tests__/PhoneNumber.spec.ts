import { describe, it, expect } from 'vitest';
import { PhoneNumber } from '../PhoneNumber';

describe('PhoneNumber', () => {
  describe('constructor', () => {
    it('should create PhoneNumber with valid 10 digits', () => {
      const phone = new PhoneNumber('1234567890');
      expect(phone.value).toBe('1234567890');
    });

    it('should create PhoneNumber with valid 11 digits', () => {
      const phone = new PhoneNumber('12345678901');
      expect(phone.value).toBe('12345678901');
    });

    it('should clean formatting characters', () => {
      const phone = new PhoneNumber('(12) 3456-7890');
      expect(phone.value).toBe('1234567890');
    });

    it('should clean spaces and special characters', () => {
      const phone = new PhoneNumber('12 3456 7890');
      expect(phone.value).toBe('1234567890');
    });

    it('should clean parentheses, dashes and spaces', () => {
      const phone = new PhoneNumber('(12) 98765-4321');
      expect(phone.value).toBe('12987654321');
    });

    it('should throw error for less than 10 digits', () => {
      expect(() => new PhoneNumber('123456789')).toThrow('Invalid phone number format');
    });

    it('should throw error for more than 11 digits', () => {
      expect(() => new PhoneNumber('123456789012')).toThrow('Invalid phone number format');
    });

    it('should throw error for empty string', () => {
      expect(() => new PhoneNumber('')).toThrow('Invalid phone number format');
    });

    it('should throw error for letters', () => {
      expect(() => new PhoneNumber('abcdefghij')).toThrow('Invalid phone number format');
    });
  });

  describe('format', () => {
    it('should format 10-digit phone number', () => {
      const phone = new PhoneNumber('1234567890');
      expect(phone.format()).toBe('(12) 3456-7890');
    });

    it('should format 11-digit phone number', () => {
      const phone = new PhoneNumber('12345678901');
      expect(phone.format()).toBe('(12) 34567-8901');
    });

    it('should format correctly with mobile 9', () => {
      const phone = new PhoneNumber('11987654321');
      expect(phone.format()).toBe('(11) 98765-4321');
    });

    it('should format correctly without mobile 9', () => {
      const phone = new PhoneNumber('1134567890');
      expect(phone.format()).toBe('(11) 3456-7890');
    });
  });

  describe('toString', () => {
    it('should return formatted phone number', () => {
      const phone = new PhoneNumber('1234567890');
      expect(phone.toString()).toBe('(12) 3456-7890');
    });

    it('should be consistent with format method', () => {
      const phone = new PhoneNumber('12345678901');
      expect(phone.toString()).toBe(phone.format());
    });
  });

  describe('equals', () => {
    it('should return true for equal values', () => {
      const phone1 = new PhoneNumber('1234567890');
      const phone2 = new PhoneNumber('1234567890');
      expect(phone1.equals(phone2)).toBe(true);
    });

    it('should return false for different values', () => {
      const phone1 = new PhoneNumber('1234567890');
      const phone2 = new PhoneNumber('9876543210');
      expect(phone1.equals(phone2)).toBe(false);
    });

    it('should work with formatted input', () => {
      const phone1 = new PhoneNumber('(12) 3456-7890');
      const phone2 = new PhoneNumber('1234567890');
      expect(phone1.equals(phone2)).toBe(true);
    });

    it('should differentiate 10 and 11 digit numbers', () => {
      const phone1 = new PhoneNumber('1234567890');
      const phone2 = new PhoneNumber('12345678901');
      expect(phone1.equals(phone2)).toBe(false);
    });
  });
});
