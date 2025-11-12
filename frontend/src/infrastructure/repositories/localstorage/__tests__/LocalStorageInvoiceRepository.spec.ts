import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageInvoiceRepository } from '../LocalStorageInvoiceRepository'
import type { CreateInvoiceDTO, UpdateInvoiceDTO, Transaction } from '@/core/domain/entities'
import { InvoiceStatus, SplitMode } from '@/core/domain/enums'

describe('LocalStorageInvoiceRepository', () => {
  let repository: LocalStorageInvoiceRepository

  const createMockTransaction = (): Transaction => ({
    id: '1',
    date: new Date('2024-01-01'),
    description: 'Test Transaction',
    amount: 100.50,
    splits: [
      { participantId: 'p1', amount: 50.25, mode: SplitMode.EQUAL_DIVISION },
      { participantId: 'p2', amount: 50.25, mode: SplitMode.EQUAL_DIVISION }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  })

  beforeEach(() => {
    localStorage.clear()
    repository = new LocalStorageInvoiceRepository()
  })

  describe('create', () => {
    it('should create a new invoice', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      const invoice = await repository.create(dto)

      expect(invoice.id).toBeTruthy()
      expect(invoice.cardId).toBe('card1')
      expect(invoice.totalAmount).toBe(100.50)
      expect(invoice.status).toBe(InvoiceStatus.PENDING)
      expect(invoice.transactions).toHaveLength(1)
    })

    it('should calculate total amount from transactions', async () => {
      const transaction1 = createMockTransaction()
      const transaction2 = { ...createMockTransaction(), amount: 200.75 }
      
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [transaction1, transaction2]
      }

      const invoice = await repository.create(dto)

      expect(invoice.totalAmount).toBe(301.25)
    })

    it('should set default status to PENDING', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      const invoice = await repository.create(dto)

      expect(invoice.status).toBe(InvoiceStatus.PENDING)
    })

    it('should persist invoice to localStorage', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      await repository.create(dto)
      const stored = localStorage.getItem('invoicemanager:invoices')
      
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
    })
  })

  describe('findAll', () => {
    it('should return empty array when no invoices exist', async () => {
      const invoices = await repository.findAll()
      expect(invoices).toEqual([])
    })

    it('should return all invoices', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      await repository.create(dto)
      await repository.create(dto)

      const invoices = await repository.findAll()

      expect(invoices).toHaveLength(2)
    })

    it('should deserialize dates correctly', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      await repository.create(dto)
      const invoices = await repository.findAll()

      expect(invoices[0]?.dueDate).toBeInstanceOf(Date)
      expect(invoices[0]?.createdAt).toBeInstanceOf(Date)
      expect(invoices[0]?.updatedAt).toBeInstanceOf(Date)
      expect(invoices[0]?.transactions[0]?.date).toBeInstanceOf(Date)
    })
  })

  describe('findById', () => {
    it('should return null when invoice not found', async () => {
      const invoice = await repository.findById('non-existent')
      expect(invoice).toBeNull()
    })

    it('should return invoice by id', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      const created = await repository.create(dto)
      const found = await repository.findById(created.id)

      expect(found).not.toBeNull()
      expect(found?.id).toBe(created.id)
    })
  })

  describe('update', () => {
    it('should update invoice status', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      const created = await repository.create(dto)
      
      const updateDto: UpdateInvoiceDTO = { status: InvoiceStatus.COMPLETED }
      const updated = await repository.update(created.id, updateDto)

      expect(updated.status).toBe(InvoiceStatus.COMPLETED)
    })

    it('should update invoice due date', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      const created = await repository.create(dto)
      
      const newDueDate = new Date('2025-01-31')
      const updateDto: UpdateInvoiceDTO = { dueDate: newDueDate }
      const updated = await repository.update(created.id, updateDto)

      expect(updated.dueDate.getTime()).toBe(newDueDate.getTime())
    })

    it('should recalculate total amount when transactions are updated', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      const created = await repository.create(dto)
      
      const newTransaction = { ...createMockTransaction(), amount: 200.00 }
      const updateDto: UpdateInvoiceDTO = { 
        transactions: [newTransaction]
      }
      const updated = await repository.update(created.id, updateDto)

      expect(updated.totalAmount).toBe(200.00)
    })

    it('should throw error when invoice not found', async () => {
      await expect(
        repository.update('non-existent', { status: InvoiceStatus.COMPLETED })
      ).rejects.toThrow('not found')
    })
  })

  describe('delete', () => {
    it('should delete invoice by id', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      const created = await repository.create(dto)
      await repository.delete(created.id)

      const invoices = await repository.findAll()
      expect(invoices).toHaveLength(0)
    })

    it('should throw error when invoice not found', async () => {
      await expect(repository.delete('non-existent')).rejects.toThrow('not found')
    })
  })

  describe('findByCardId', () => {
    it('should return invoices for specific card', async () => {
      const dto1: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }
      const dto2: CreateInvoiceDTO = {
        cardId: 'card2',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      await repository.create(dto1)
      await repository.create(dto1)
      await repository.create(dto2)

      const invoices = await repository.findByCardId('card1')

      expect(invoices).toHaveLength(2)
      expect(invoices.every(inv => inv.cardId === 'card1')).toBe(true)
    })

    it('should return empty array when no invoices for card', async () => {
      const invoices = await repository.findByCardId('non-existent')
      expect(invoices).toEqual([])
    })
  })

  describe('findByStatus', () => {
    it('should return invoices with specific status', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      const invoice1 = await repository.create(dto)
      await repository.create(dto)
      await repository.update(invoice1.id, { status: InvoiceStatus.COMPLETED })

      const pendingInvoices = await repository.findByStatus(InvoiceStatus.PENDING)
      const completedInvoices = await repository.findByStatus(InvoiceStatus.COMPLETED)

      expect(pendingInvoices).toHaveLength(1)
      expect(completedInvoices).toHaveLength(1)
    })

    it('should return empty array when no invoices with status', async () => {
      const invoices = await repository.findByStatus(InvoiceStatus.COMPLETED)
      expect(invoices).toEqual([])
    })
  })

  describe('findOpenInvoice', () => {
    it('should return first pending invoice', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      await repository.create(dto)
      await repository.create(dto)

      const openInvoice = await repository.findOpenInvoice()

      expect(openInvoice).not.toBeNull()
      expect(openInvoice?.status).toBe(InvoiceStatus.PENDING)
    })

    it('should return null when no pending invoices', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      const invoice = await repository.create(dto)
      await repository.update(invoice.id, { status: InvoiceStatus.COMPLETED })

      const openInvoice = await repository.findOpenInvoice()

      expect(openInvoice).toBeNull()
    })

    it('should return null when no invoices exist', async () => {
      const openInvoice = await repository.findOpenInvoice()
      expect(openInvoice).toBeNull()
    })
  })

  describe('serialization', () => {
    it('should serialize and deserialize correctly', async () => {
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [createMockTransaction()]
      }

      const created = await repository.create(dto)
      const found = await repository.findById(created.id)

      expect(found?.id).toBe(created.id)
      expect(found?.cardId).toBe(created.cardId)
      expect(found?.totalAmount).toBe(created.totalAmount)
      expect(found?.transactions).toHaveLength(created.transactions.length)
    })

    it('should handle transaction splits correctly', async () => {
      const transaction = createMockTransaction()
      const dto: CreateInvoiceDTO = {
        cardId: 'card1',
        dueDate: new Date('2024-12-31'),
        transactions: [transaction]
      }

      const created = await repository.create(dto)
      const found = await repository.findById(created.id)

      expect(found?.transactions[0]?.splits).toHaveLength(2)
      expect(found?.transactions[0]?.splits[0]?.participantId).toBe('p1')
      expect(found?.transactions[0]?.splits[0]?.amount).toBe(50.25)
      expect(found?.transactions[0]?.splits[0]?.mode).toBe(SplitMode.EQUAL_DIVISION)
    })
  })
})
