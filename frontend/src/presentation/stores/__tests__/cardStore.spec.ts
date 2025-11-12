import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCardStore } from '../cardStore'
import type { CreateCardDTO, UpdateCardDTO, Card } from '@/core/domain/entities'

describe('cardStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('initial state', () => {
    it('should have empty cards array', () => {
      const store = useCardStore()
      expect(store.cards).toEqual([])
    })

    it('should not be loading', () => {
      const store = useCardStore()
      expect(store.loading).toBe(false)
    })

    it('should have no error', () => {
      const store = useCardStore()
      expect(store.error).toBeNull()
    })

    it('should have cardCount of 0', () => {
      const store = useCardStore()
      expect(store.cardCount).toBe(0)
    })
  })

  describe('fetchCards', () => {
    it('should fetch all cards', async () => {
      const store = useCardStore()
      
      await store.createCard({ nickname: 'Card 1', lastFourDigits: '1111' })
      await store.createCard({ nickname: 'Card 2', lastFourDigits: '2222' })
      
      store.cards = []
      
      await store.fetchCards()
      
      expect(store.cards).toHaveLength(2)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set loading state', async () => {
      const store = useCardStore()
      
      const promise = store.fetchCards()
      expect(store.loading).toBe(true)
      
      await promise
      expect(store.loading).toBe(false)
    })

    it('should handle errors', async () => {
      const store = useCardStore()
      
      localStorage.setItem('invoicemanager:cards', 'invalid json')
      
      await expect(store.fetchCards()).rejects.toThrow()
      expect(store.error).toBeTruthy()
    })
  })

  describe('createCard', () => {
    it('should create a new card', async () => {
      const store = useCardStore()
      const dto: CreateCardDTO = {
        nickname: 'My Card',
        lastFourDigits: '1234'
      }
      
      const card = await store.createCard(dto)
      
      expect(card.nickname).toBe('My Card')
      expect(card.lastFourDigits).toBe('1234')
      expect(store.cards).toHaveLength(1)
      expect(store.cards[0]).toEqual(card)
    })

    it('should update cardCount', async () => {
      const store = useCardStore()
      
      expect(store.cardCount).toBe(0)
      
      await store.createCard({ nickname: 'Card', lastFourDigits: '1234' })
      
      expect(store.cardCount).toBe(1)
    })

    it('should set loading state', async () => {
      const store = useCardStore()
      
      const promise = store.createCard({ nickname: 'Card', lastFourDigits: '1234' })
      expect(store.loading).toBe(true)
      
      await promise
      expect(store.loading).toBe(false)
    })

    it('should clear error on success', async () => {
      const store = useCardStore()
      store.error = 'Previous error'
      
      await store.createCard({ nickname: 'Card', lastFourDigits: '1234' })
      
      expect(store.error).toBeNull()
    })
  })

  describe('updateCard', () => {
    it('should update card nickname', async () => {
      const store = useCardStore()
      const card = await store.createCard({
        nickname: 'Old Name',
        lastFourDigits: '1234'
      })
      
      const dto: UpdateCardDTO = { nickname: 'New Name' }
      const updated = await store.updateCard(card.id, dto)
      
      expect(updated.nickname).toBe('New Name')
      expect(store.cards[0]?.nickname).toBe('New Name')
    })

    it('should update card in the array', async () => {
      const store = useCardStore()
      const card = await store.createCard({
        nickname: 'Original',
        lastFourDigits: '1234'
      })
      
      await store.updateCard(card.id, { nickname: 'Updated' })
      
      const found = store.cards.find((c: Card) => c.id === card.id)
      expect(found?.nickname).toBe('Updated')
    })

    it('should handle non-existent card', async () => {
      const store = useCardStore()
      
      await expect(
        store.updateCard('non-existent', { nickname: 'Test' })
      ).rejects.toThrow()
      expect(store.error).toBeTruthy()
    })
  })

  describe('deleteCard', () => {
    it('should delete a card', async () => {
      const store = useCardStore()
      const card = await store.createCard({
        nickname: 'Card',
        lastFourDigits: '1234'
      })
      
      await store.deleteCard(card.id)
      
      expect(store.cards).toHaveLength(0)
      expect(store.cardCount).toBe(0)
    })

    it('should only delete specified card', async () => {
      const store = useCardStore()
      const card1 = await store.createCard({ nickname: 'Card 1', lastFourDigits: '1111' })
      const card2 = await store.createCard({ nickname: 'Card 2', lastFourDigits: '2222' })
      
      await store.deleteCard(card1.id)
      
      expect(store.cards).toHaveLength(1)
      expect(store.cards[0]?.id).toBe(card2.id)
    })

    it('should handle non-existent card', async () => {
      const store = useCardStore()
      
      await expect(store.deleteCard('non-existent')).rejects.toThrow()
      expect(store.error).toBeTruthy()
    })
  })

  describe('getCardById', () => {
    it('should return card by id', async () => {
      const store = useCardStore()
      const card = await store.createCard({
        nickname: 'Test Card',
        lastFourDigits: '1234'
      })
      
      const found = store.getCardById(card.id)
      
      expect(found).toEqual(card)
    })

    it('should return undefined for non-existent card', () => {
      const store = useCardStore()
      
      const found = store.getCardById('non-existent')
      
      expect(found).toBeUndefined()
    })
  })

  describe('error handling', () => {
    it('should set error message on failure', async () => {
      const store = useCardStore()
      
      await expect(store.updateCard('invalid', {})).rejects.toThrow()
      
      expect(store.error).toBeTruthy()
      expect(typeof store.error).toBe('string')
    })

    it('should clear error on successful operation', async () => {
      const store = useCardStore()
      store.error = 'Previous error'
      
      await store.createCard({ nickname: 'Card', lastFourDigits: '1234' })
      
      expect(store.error).toBeNull()
    })
  })
})
