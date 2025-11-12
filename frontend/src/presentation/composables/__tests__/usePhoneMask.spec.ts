import { describe, it, expect } from 'vitest'
import { usePhoneMask } from '../usePhoneMask'

describe('usePhoneMask', () => {
  describe('formatPhone', () => {
    it('should return empty string for empty input', () => {
      const { formatPhone } = usePhoneMask()
      expect(formatPhone('')).toBe('')
    })

    it('should format 2 digits or less without parentheses', () => {
      const { formatPhone } = usePhoneMask()
      expect(formatPhone('11')).toBe('11')
      expect(formatPhone('1')).toBe('1')
    })

    it('should format 3-7 digits with area code', () => {
      const { formatPhone } = usePhoneMask()
      expect(formatPhone('123')).toBe('(12) 3')
      expect(formatPhone('12345')).toBe('(12) 345')
      expect(formatPhone('1234567')).toBe('(12) 34567')
    })

    it('should format 10-digit phone number', () => {
      const { formatPhone } = usePhoneMask()
      expect(formatPhone('1234567890')).toBe('(12) 34567-890')
    })

    it('should format 11-digit phone number', () => {
      const { formatPhone } = usePhoneMask()
      expect(formatPhone('12345678901')).toBe('(12) 34567-8901')
    })

    it('should format already formatted phone', () => {
      const { formatPhone } = usePhoneMask()
      expect(formatPhone('(12) 34567-8901')).toBe('(12) 34567-8901')
    })

    it('should strip non-numeric characters', () => {
      const { formatPhone } = usePhoneMask()
      expect(formatPhone('(12)abc 345-67-890')).toBe('(12) 34567-890')
    })

    it('should limit to 11 digits', () => {
      const { formatPhone } = usePhoneMask()
      expect(formatPhone('123456789012345')).toBe('(12) 34567-8901')
    })

    it('should handle spaces and dashes in input', () => {
      const { formatPhone } = usePhoneMask()
      expect(formatPhone('12 3456 7890')).toBe('(12) 34567-890')
    })
  })

  describe('unformatPhone', () => {
    it('should remove all non-numeric characters', () => {
      const { unformatPhone } = usePhoneMask()
      expect(unformatPhone('(12) 34567-8901')).toBe('12345678901')
    })

    it('should handle already clean input', () => {
      const { unformatPhone } = usePhoneMask()
      expect(unformatPhone('12345678901')).toBe('12345678901')
    })

    it('should handle empty string', () => {
      const { unformatPhone } = usePhoneMask()
      expect(unformatPhone('')).toBe('')
    })

    it('should remove spaces', () => {
      const { unformatPhone } = usePhoneMask()
      expect(unformatPhone('12 3456 7890')).toBe('1234567890')
    })

    it('should remove parentheses and dashes', () => {
      const { unformatPhone } = usePhoneMask()
      expect(unformatPhone('(12) 3456-7890')).toBe('1234567890')
    })

    it('should remove letters and special characters', () => {
      const { unformatPhone } = usePhoneMask()
      expect(unformatPhone('abc-123-def-456')).toBe('123456')
    })
  })

  describe('validatePhone', () => {
    it('should validate 10-digit phone number', () => {
      const { validatePhone } = usePhoneMask()
      expect(validatePhone('1234567890')).toBe(true)
    })

    it('should validate 11-digit phone number', () => {
      const { validatePhone } = usePhoneMask()
      expect(validatePhone('12345678901')).toBe(true)
    })

    it('should validate formatted 10-digit phone', () => {
      const { validatePhone } = usePhoneMask()
      expect(validatePhone('(12) 3456-7890')).toBe(true)
    })

    it('should validate formatted 11-digit phone', () => {
      const { validatePhone } = usePhoneMask()
      expect(validatePhone('(12) 34567-8901')).toBe(true)
    })

    it('should reject phone with less than 10 digits', () => {
      const { validatePhone } = usePhoneMask()
      expect(validatePhone('123456789')).toBe(false)
    })

    it('should reject phone with more than 11 digits', () => {
      const { validatePhone } = usePhoneMask()
      expect(validatePhone('123456789012')).toBe(false)
    })

    it('should reject empty string', () => {
      const { validatePhone } = usePhoneMask()
      expect(validatePhone('')).toBe(false)
    })

    it('should reject non-numeric string', () => {
      const { validatePhone } = usePhoneMask()
      expect(validatePhone('abcdefghij')).toBe(false)
    })

    it('should handle partially formatted numbers', () => {
      const { validatePhone } = usePhoneMask()
      expect(validatePhone('(12) 3456-789')).toBe(false)
      expect(validatePhone('(12) 3456-7890')).toBe(true)
    })
  })

  describe('integration tests', () => {
    it('should format and validate correctly', () => {
      const { formatPhone, validatePhone } = usePhoneMask()
      const formatted = formatPhone('11987654321')
      expect(formatted).toBe('(11) 98765-4321')
      expect(validatePhone(formatted)).toBe(true)
    })

    it('should unformat and validate correctly', () => {
      const { unformatPhone, validatePhone } = usePhoneMask()
      const unformatted = unformatPhone('(11) 98765-4321')
      expect(unformatted).toBe('11987654321')
      expect(validatePhone(unformatted)).toBe(true)
    })

    it('should handle full cycle: format -> unformat -> format', () => {
      const { formatPhone, unformatPhone } = usePhoneMask()
      const original = '11987654321'
      const formatted = formatPhone(original)
      const unformatted = unformatPhone(formatted)
      const reformatted = formatPhone(unformatted)
      
      expect(reformatted).toBe(formatted)
      expect(unformatted).toBe(original)
    })
  })
})
