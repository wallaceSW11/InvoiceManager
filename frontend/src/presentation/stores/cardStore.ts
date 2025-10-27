import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Card, CreateCardDTO, UpdateCardDTO } from '@/core/domain/entities'
import { LocalStorageCardRepository } from '@/infrastructure/repositories/localstorage'

const cardRepository = new LocalStorageCardRepository()

export const useCardStore = defineStore('card', () => {
  const cards = ref<Card[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const cardCount = computed(() => cards.value.length)

  async function fetchCards() {
    loading.value = true
    error.value = null
    try {
      cards.value = await cardRepository.findAll()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch cards'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createCard(dto: CreateCardDTO) {
    loading.value = true
    error.value = null
    try {
      const card = await cardRepository.create(dto)
      cards.value.push(card)
      return card
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create card'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateCard(id: string, dto: UpdateCardDTO) {
    loading.value = true
    error.value = null
    try {
      const card = await cardRepository.update(id, dto)
      const index = cards.value.findIndex(c => c.id === id)
      if (index !== -1) {
        cards.value[index] = card
      }
      return card
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update card'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteCard(id: string) {
    loading.value = true
    error.value = null
    try {
      await cardRepository.delete(id)
      cards.value = cards.value.filter(c => c.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete card'
      throw e
    } finally {
      loading.value = false
    }
  }

  function getCardById(id: string) {
    return cards.value.find(c => c.id === id)
  }

  return {
    cards,
    loading,
    error,
    cardCount,
    fetchCards,
    createCard,
    updateCard,
    deleteCard,
    getCardById
  }
})
