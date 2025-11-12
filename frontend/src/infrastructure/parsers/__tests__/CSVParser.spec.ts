import { describe, it, expect, beforeEach } from 'vitest'
import { CSVParser } from '../CSVParser'

describe('CSVParser', () => {
  let parser: CSVParser

  beforeEach(() => {
    parser = new CSVParser()
  })

  describe('parse', () => {
    it('should parse valid CSV content with single transaction', () => {
      const csv = '01/01;Test Transaction;100,50'
      const result = parser.parse(csv)
      
      expect(result.success).toBe(true)
      expect(result.transactions).toHaveLength(1)
      expect(result.transactions[0]).toMatchObject({
        description: 'Test Transaction',
        amount: 100.50
      })
      expect(result.totalAmount).toBe(100.50)
      expect(result.errors).toHaveLength(0)
    })

    it('should parse multiple transactions', () => {
      const csv = `01/01;Transaction 1;100,50
02/02;Transaction 2;200,75
03/03;Transaction 3;50,25`
      const result = parser.parse(csv)
      
      expect(result.success).toBe(true)
      expect(result.transactions).toHaveLength(3)
      expect(result.totalAmount).toBe(351.50)
    })

    it('should handle transactions with semicolons in description', () => {
      const csv = '01/01;Description; with semicolons;100,50'
      const result = parser.parse(csv)
      
      expect(result.success).toBe(true)
      expect(result.transactions[0]?.description).toBe('Description; with semicolons')
      expect(result.transactions[0]?.amount).toBe(100.50)
    })

    it('should skip empty lines', () => {
      const csv = `01/01;Transaction 1;100,50

02/02;Transaction 2;200,75

`
      const result = parser.parse(csv)
      
      expect(result.success).toBe(true)
      expect(result.transactions).toHaveLength(2)
    })

    it('should handle amounts with dots (thousands separator)', () => {
      const csv = '01/01;Big Transaction;1.234,56'
      const result = parser.parse(csv)
      
      expect(result.success).toBe(true)
      expect(result.transactions[0]?.amount).toBe(1234.56)
    })

    it('should collect errors for invalid lines', () => {
      const csv = `01/01;Valid Transaction;100,50
invalid line
02/02;Another Valid;200,75`
      const result = parser.parse(csv)
      
      expect(result.success).toBe(false)
      expect(result.transactions).toHaveLength(2)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain('Line 2')
    })

    it('should handle empty CSV content', () => {
      const csv = ''
      const result = parser.parse(csv)
      
      expect(result.success).toBe(true)
      expect(result.transactions).toHaveLength(0)
      expect(result.totalAmount).toBe(0)
    })

    it('should trim whitespace from lines', () => {
      const csv = '  01/01;Transaction;100,50  '
      const result = parser.parse(csv)
      
      expect(result.success).toBe(true)
      expect(result.transactions).toHaveLength(1)
    })

    it('should calculate total amount correctly with decimal precision', () => {
      const csv = `01/01;Transaction 1;10,10
02/02;Transaction 2;20,20
03/03;Transaction 3;30,30`
      const result = parser.parse(csv)
      
      expect(result.totalAmount).toBe(60.60)
    })
  })

  describe('parseLine (through parse)', () => {
    it('should throw error for missing semicolon separator', () => {
      const csv = 'invalid line without semicolons'
      const result = parser.parse(csv)
      
      expect(result.success).toBe(false)
      expect(result.errors[0]).toContain('missing semicolon separator')
    })

    it('should throw error for missing amount', () => {
      const csv = '01/01;Description only'
      const result = parser.parse(csv)
      
      expect(result.success).toBe(false)
      expect(result.errors[0]).toContain('missing amount')
    })

    it('should throw error for empty description', () => {
      const csv = '01/01;;100,50'
      const result = parser.parse(csv)
      
      expect(result.success).toBe(false)
      expect(result.errors[0]).toContain('Description is empty')
    })

    it('should preserve raw line in transaction', () => {
      const csv = '01/01;Test;100,50'
      const result = parser.parse(csv)
      
      expect(result.transactions[0]?.rawLine).toBe(csv)
    })
  })

  describe('parseDate (through parse)', () => {
    it('should parse valid date in DD/MM format', () => {
      const csv = '15/03;Transaction;100,50'
      const result = parser.parse(csv)
      const currentYear = new Date().getFullYear()
      
      expect(result.success).toBe(true)
      expect(result.transactions[0]?.date).toBe(`${currentYear}-03-15`)
    })

    it('should handle single digit day and month', () => {
      const csv = '01/02;Transaction;100,50'
      const result = parser.parse(csv)
      const currentYear = new Date().getFullYear()
      
      expect(result.success).toBe(true)
      expect(result.transactions[0]?.date).toBe(`${currentYear}-02-01`)
    })

    it('should throw error for invalid date format', () => {
      const csv = '2024-01-01;Transaction;100,50'
      const result = parser.parse(csv)
      
      expect(result.success).toBe(false)
      expect(result.errors[0]).toContain('Invalid date format')
    })

    it('should throw error for date with only day', () => {
      const csv = '15;Transaction;100,50'
      const result = parser.parse(csv)
      
      expect(result.success).toBe(false)
      expect(result.errors[0]).toContain('Invalid date format')
    })

    it('should throw error for date with letters', () => {
      const csv = 'ab/cd;Transaction;100,50'
      const result = parser.parse(csv)
      
      expect(result.success).toBe(false)
      expect(result.errors[0]).toContain('Invalid date format')
    })
  })

  describe('parseAmount (through parse)', () => {
    it('should parse amount with comma as decimal separator', () => {
      const csv = '01/01;Transaction;100,50'
      const result = parser.parse(csv)
      
      expect(result.transactions[0]?.amount).toBe(100.50)
    })

    it('should parse amount with thousands separator', () => {
      const csv = '01/01;Transaction;1.234,56'
      const result = parser.parse(csv)
      
      expect(result.transactions[0]?.amount).toBe(1234.56)
    })

    it('should parse integer amount', () => {
      const csv = '01/01;Transaction;100'
      const result = parser.parse(csv)
      
      expect(result.transactions[0]?.amount).toBe(100)
    })

    it('should parse zero amount', () => {
      const csv = '01/01;Transaction;0'
      const result = parser.parse(csv)
      
      expect(result.transactions[0]?.amount).toBe(0)
    })

    it('should round to 2 decimal places', () => {
      const csv = '01/01;Transaction;100,555'
      const result = parser.parse(csv)
      
      expect(result.transactions[0]?.amount).toBe(100.56)
    })

    it('should throw error for invalid amount', () => {
      const csv = '01/01;Transaction;abc'
      const result = parser.parse(csv)
      
      expect(result.success).toBe(false)
      expect(result.errors[0]).toContain('Invalid amount')
    })

    it('should throw error for empty amount', () => {
      const csv = '01/01;Transaction;'
      const result = parser.parse(csv)
      
      expect(result.success).toBe(false)
      expect(result.errors[0]).toContain('Invalid amount')
    })
  })

  describe('validateFile', () => {
    it('should validate correct CSV file', () => {
      const file = new File(['content'], 'test.csv', { type: 'text/csv' })
      const result = parser.validateFile(file)
      
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate text file', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      const result = parser.validateFile(file)
      
      expect(result.valid).toBe(true)
    })

    it('should reject null file', () => {
      const result = parser.validateFile(null as any)
      
      expect(result.valid).toBe(false)
      expect(result.error).toBe('No file selected')
    })

    it('should reject non-text file type', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const result = parser.validateFile(file)
      
      expect(result.valid).toBe(false)
      expect(result.error).toBe('File must be a CSV or text file')
    })

    it('should reject file with no type that is too large', () => {
      const largeContent = 'x'.repeat(6 * 1024 * 1024)
      const file = new File([largeContent], 'test.csv', { type: '' })
      const result = parser.validateFile(file)
      
      expect(result.valid).toBe(false)
      expect(result.error).toContain('5MB')
    })

    it('should accept file smaller than 5MB', () => {
      const content = 'x'.repeat(1024)
      const file = new File([content], 'test.csv', { type: 'text/csv' })
      const result = parser.validateFile(file)
      
      expect(result.valid).toBe(true)
    })

    it('should accept file without type if size is valid', () => {
      const file = new File(['content'], 'test.csv', { type: '' })
      const result = parser.validateFile(file)
      
      expect(result.valid).toBe(true)
    })
  })

  describe('readFile', () => {
    it('should read file content', async () => {
      const content = '01/01;Transaction;100,50'
      const file = new File([content], 'test.csv', { type: 'text/csv' })
      
      const result = await parser.readFile(file)
      
      expect(result).toBe(content)
    })

    it('should read empty file', async () => {
      const file = new File([''], 'test.csv', { type: 'text/csv' })
      
      const result = await parser.readFile(file)
      
      expect(result).toBe('')
    })

    it('should read file with UTF-8 encoding', async () => {
      const content = '01/01;Transação com acentos;100,50'
      const file = new File([content], 'test.csv', { type: 'text/csv' })
      
      const result = await parser.readFile(file)
      
      expect(result).toBe(content)
    })
  })
})
