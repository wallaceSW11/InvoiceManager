import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageCardRepository } from '../LocalStorageCardRepository'
import type { CreateCardDTO, UpdateCardDTO } from '@/core/domain/entities'

describe('LocalStorageCardRepository', () => {
  let repository: LocalStorageCardRepository

  beforeEach(() => {
    localStorage.clear()
    repository = new LocalStorageCardRepository()
  })

  describe('create', () => {
    it('should create a new card', async () => {
      const dto: CreateCardDTO = {
        nickname: 'My Card',
        lastFourDigits: '1234'
      }

      const card = await repository.create(dto)

      expect(card.id).toBeTruthy()
      expect(card.nickname).toBe('My Card')
      expect(card.lastFourDigits).toBe('1234')
      expect(card.createdAt).toBeInstanceOf(Date)
      expect(card.updatedAt).toBeInstanceOf(Date)
    })

    it('should persist card to localStorage', async () => {
      const dto: CreateCardDTO = {
        nickname: 'Test Card',
        lastFourDigits: '5678'
      }

      await repository.create(dto)
      const stored = localStorage.getItem('invoicemanager:cards')
      
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].nickname).toBe('Test Card')
    })

    it('should generate unique IDs', async () => {
      const dto: CreateCardDTO = {
        nickname: 'Card',
        lastFourDigits: '1234'
      }

      const card1 = await repository.create(dto)
      const card2 = await repository.create(dto)

      expect(card1.id).not.toBe(card2.id)
    })
  })

  describe('findAll', () => {
    it('should return empty array when no cards exist', async () => {
      const cards = await repository.findAll()
      expect(cards).toEqual([])
    })

    it('should return all cards', async () => {
      await repository.create({ nickname: 'Card 1', lastFourDigits: '1111' })
      await repository.create({ nickname: 'Card 2', lastFourDigits: '2222' })

      const cards = await repository.findAll()

      expect(cards).toHaveLength(2)
      expect(cards[0]?.nickname).toBe('Card 1')
      expect(cards[1]?.nickname).toBe('Card 2')
    })

    it('should deserialize dates correctly', async () => {
      await repository.create({ nickname: 'Card', lastFourDigits: '1234' })

      const cards = await repository.findAll()

      expect(cards[0]?.createdAt).toBeInstanceOf(Date)
      expect(cards[0]?.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe('findById', () => {
    it('should return null when card not found', async () => {
      const card = await repository.findById('non-existent')
      expect(card).toBeNull()
    })

    it('should return card by id', async () => {
      const created = await repository.create({
        nickname: 'Test Card',
        lastFourDigits: '1234'
      })

      const found = await repository.findById(created.id)

      expect(found).not.toBeNull()
      expect(found?.id).toBe(created.id)
      expect(found?.nickname).toBe('Test Card')
    })
  })

  describe('update', () => {
    it('should update card nickname', async () => {
      const created = await repository.create({
        nickname: 'Old Name',
        lastFourDigits: '1234'
      })

      const dto: UpdateCardDTO = { nickname: 'New Name' }
      const updated = await repository.update(created.id, dto)

      expect(updated.nickname).toBe('New Name')
      expect(updated.lastFourDigits).toBe('1234')
      expect(updated.id).toBe(created.id)
    })

    it('should update card lastFourDigits', async () => {
      const created = await repository.create({
        nickname: 'Card',
        lastFourDigits: '1234'
      })

      const dto: UpdateCardDTO = { lastFourDigits: '5678' }
      const updated = await repository.update(created.id, dto)

      expect(updated.lastFourDigits).toBe('5678')
    })

    it('should update updatedAt timestamp', async () => {
      const created = await repository.create({
        nickname: 'Card',
        lastFourDigits: '1234'
      })

      await new Promise(resolve => setTimeout(resolve, 10))

      const updated = await repository.update(created.id, { nickname: 'Updated' })

      expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime())
    })

    it('should throw error when card not found', async () => {
      await expect(
        repository.update('non-existent', { nickname: 'Test' })
      ).rejects.toThrow('not found')
    })

    it('should persist update to localStorage', async () => {
      const created = await repository.create({
        nickname: 'Original',
        lastFourDigits: '1234'
      })

      await repository.update(created.id, { nickname: 'Updated' })

      const stored = localStorage.getItem('invoicemanager:cards')
      const parsed = JSON.parse(stored!)
      expect(parsed[0].nickname).toBe('Updated')
    })
  })

  describe('delete', () => {
    it('should delete card by id', async () => {
      const created = await repository.create({
        nickname: 'Card',
        lastFourDigits: '1234'
      })

      await repository.delete(created.id)

      const cards = await repository.findAll()
      expect(cards).toHaveLength(0)
    })

    it('should throw error when card not found', async () => {
      await expect(repository.delete('non-existent')).rejects.toThrow('not found')
    })

    it('should only delete specified card', async () => {
      const card1 = await repository.create({ nickname: 'Card 1', lastFourDigits: '1111' })
      const card2 = await repository.create({ nickname: 'Card 2', lastFourDigits: '2222' })

      await repository.delete(card1.id)

      const cards = await repository.findAll()
      expect(cards).toHaveLength(1)
      expect(cards[0]?.id).toBe(card2.id)
    })

    it('should persist deletion to localStorage', async () => {
      const created = await repository.create({
        nickname: 'Card',
        lastFourDigits: '1234'
      })

      await repository.delete(created.id)

      const stored = localStorage.getItem('invoicemanager:cards')
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(0)
    })
  })

  describe('findByLastDigits', () => {
    it('should return cards with matching last digits', async () => {
      await repository.create({ nickname: 'Card 1', lastFourDigits: '1234' })
      await repository.create({ nickname: 'Card 2', lastFourDigits: '1234' })
      await repository.create({ nickname: 'Card 3', lastFourDigits: '5678' })

      const cards = await repository.findByLastDigits('1234')

      expect(cards).toHaveLength(2)
      expect(cards.every(c => c.lastFourDigits === '1234')).toBe(true)
    })

    it('should return empty array when no matches', async () => {
      await repository.create({ nickname: 'Card', lastFourDigits: '1234' })

      const cards = await repository.findByLastDigits('5678')

      expect(cards).toEqual([])
    })

    it('should return empty array when no cards exist', async () => {
      const cards = await repository.findByLastDigits('1234')
      expect(cards).toEqual([])
    })
  })

  describe('serialization', () => {
    it('should serialize and deserialize correctly', async () => {
      const dto: CreateCardDTO = {
        nickname: 'Test Card',
        lastFourDigits: '1234'
      }

      const created = await repository.create(dto)
      const found = await repository.findById(created.id)

      expect(found).toEqual(created)
    })

    it('should handle dates in serialization', async () => {
      const created = await repository.create({
        nickname: 'Card',
        lastFourDigits: '1234'
      })

      const stored = localStorage.getItem('invoicemanager:cards')
      const parsed = JSON.parse(stored!)
      
      expect(typeof parsed[0].createdAt).toBe('string')
      expect(typeof parsed[0].updatedAt).toBe('string')

      const found = await repository.findById(created.id)
      expect(found?.createdAt).toBeInstanceOf(Date)
      expect(found?.updatedAt).toBeInstanceOf(Date)
    })
  })
})
