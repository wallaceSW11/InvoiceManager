import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Participant, CreateParticipantDTO, UpdateParticipantDTO } from '@/core/domain/entities'
import { LocalStorageParticipantRepository } from '@/infrastructure/repositories/localstorage'

const participantRepository = new LocalStorageParticipantRepository()

export const useParticipantStore = defineStore('participant', () => {
  const participants = ref<Participant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const participantCount = computed(() => participants.value.length)

  async function fetchParticipants() {
    loading.value = true
    error.value = null
    try {
      participants.value = await participantRepository.findAll()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch participants'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createParticipant(dto: CreateParticipantDTO) {
    loading.value = true
    error.value = null
    try {
      const participant = await participantRepository.create(dto)
      participants.value.push(participant)
      return participant
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create participant'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateParticipant(id: string, dto: UpdateParticipantDTO) {
    loading.value = true
    error.value = null
    try {
      const participant = await participantRepository.update(id, dto)
      const index = participants.value.findIndex(p => p.id === id)
      if (index !== -1) {
        participants.value[index] = participant
      }
      return participant
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update participant'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteParticipant(id: string) {
    loading.value = true
    error.value = null
    try {
      await participantRepository.delete(id)
      participants.value = participants.value.filter(p => p.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete participant'
      throw e
    } finally {
      loading.value = false
    }
  }

  function getParticipantById(id: string) {
    return participants.value.find(p => p.id === id)
  }

  return {
    participants,
    loading,
    error,
    participantCount,
    fetchParticipants,
    createParticipant,
    updateParticipant,
    deleteParticipant,
    getParticipantById
  }
})
