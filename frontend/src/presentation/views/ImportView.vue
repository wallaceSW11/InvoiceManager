<template>
  <div>
    <v-card>
      <v-card-title>
        {{ t('import.title') }}
      </v-card-title>

      <v-card-text>
        <p class="text-body-1 mb-4">{{ t('import.description') }}</p>

        <v-alert type="warning" variant="tonal" class="mb-4">
          {{ t('import.warning') }}
        </v-alert>

        <v-row>
          <v-col cols="12" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-h6">
                <v-icon icon="mdi-credit-card" class="mr-2" />
                {{ t('import.cards') }}
              </v-card-title>
              <v-card-text>
                <v-file-input
                  v-model="files.cards"
                  accept="application/json"
                  :label="t('import.selectFile')"
                  prepend-icon="mdi-file-upload"
                  show-size
                  clearable
                  :loading="loading.cards"
                  :hint="importHints.cards"
                  persistent-hint
                />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-h6">
                <v-icon icon="mdi-account-group" class="mr-2" />
                {{ t('import.participants') }}
              </v-card-title>
              <v-card-text>
                <v-file-input
                  v-model="files.participants"
                  accept="application/json"
                  :label="t('import.selectFile')"
                  prepend-icon="mdi-file-upload"
                  show-size
                  clearable
                  :loading="loading.participants"
                  :hint="importHints.participants"
                  persistent-hint
                />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card variant="outlined">
              <v-card-title class="text-h6">
                <v-icon icon="mdi-file-document-multiple" class="mr-2" />
                {{ t('import.invoices') }}
              </v-card-title>
              <v-card-text>
                <v-file-input
                  v-model="files.invoices"
                  accept="application/json"
                  :label="t('import.selectFile')"
                  prepend-icon="mdi-file-upload"
                  show-size
                  clearable
                  :loading="loading.invoices"
                  :hint="importHints.invoices"
                  persistent-hint
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCardStore } from '@/presentation/stores/cardStore'
import { useParticipantStore } from '@/presentation/stores/participantStore'
import { useInvoiceStore } from '@/presentation/stores/invoiceStore'
import { notify } from '@lib'
import type { Card } from '@/core/domain/entities/Card'
import type { Participant } from '@/core/domain/entities/Participant'
import type { Invoice } from '@/core/domain/entities/Invoice'

const { t } = useI18n()
const cardStore = useCardStore()
const participantStore = useParticipantStore()
const invoiceStore = useInvoiceStore()

const files = ref<{
  cards: File[] | File | undefined | null
  participants: File[] | File | undefined | null
  invoices: File[] | File | undefined | null
}>({
  cards: undefined,
  participants: undefined,
  invoices: undefined
})

const loading = ref({
  cards: false,
  participants: false,
  invoices: false
})

const importHints = ref({
  cards: '',
  participants: '',
  invoices: ''
})

function getFileFromInput(input: File[] | File | undefined | null): File | null {
  if (!input) return null
  if (Array.isArray(input)) return input.length > 0 ? input[0]! : null
  return input
}

function hasFile(input: File[] | File | undefined | null): boolean {
  if (!input) return false
  if (Array.isArray(input)) return input.length > 0
  return true
}

function formatImportTime(): string {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function getSuccessMessage(entity: 'cards' | 'participants' | 'invoices', count: number): string {
  if (entity === 'cards') {
    return count === 1 
      ? t('import.cardSuccess') 
      : t('import.cardsSuccess', { count })
  }
  if (entity === 'participants') {
    return count === 1 
      ? t('import.participantSuccess') 
      : t('import.participantsSuccess', { count })
  }
  return count === 1 
    ? t('import.invoiceSuccess') 
    : t('import.invoicesSuccess', { count })
}

async function readJSONFile<T>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (!Array.isArray(data)) {
          throw new Error('Invalid JSON format: expected an array')
        }
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

async function importCards() {
  const file = getFileFromInput(files.value.cards)
  if (!file) return

  loading.value.cards = true
  try {
    const data = await readJSONFile<Card>(file)
    
    for (const card of data) {
      const exists = cardStore.cards.some(c => c.id === card.id)
      if (exists) {
        await cardStore.updateCard(card.id, card)
      } else {
        await cardStore.createCard(card)
      }
    }

    const time = formatImportTime()
    notify('success', getSuccessMessage('cards', data.length))
    importHints.value.cards = t('import.importedAt', { count: data.length, time })
    files.value.cards = undefined
  } catch (error) {
    console.error('Error importing cards:', error)
    notify('error', t('import.error'))
    files.value.cards = undefined
  } finally {
    loading.value.cards = false
  }
}

async function importParticipants() {
  const file = getFileFromInput(files.value.participants)
  if (!file) return

  loading.value.participants = true
  try {
    const data = await readJSONFile<Participant>(file)
    
    for (const participant of data) {
      const exists = participantStore.participants.some(p => p.id === participant.id)
      if (exists) {
        await participantStore.updateParticipant(participant.id, participant)
      } else {
        await participantStore.createParticipant(participant)
      }
    }

    const time = formatImportTime()
    notify('success', getSuccessMessage('participants', data.length))
    importHints.value.participants = t('import.importedAt', { count: data.length, time })
    files.value.participants = undefined
  } catch (error) {
    console.error('Error importing participants:', error)
    notify('error', t('import.error'))
    files.value.participants = undefined
  } finally {
    loading.value.participants = false
  }
}

async function importInvoices() {
  const file = getFileFromInput(files.value.invoices)
  if (!file) return

  loading.value.invoices = true
  try {
    const data = await readJSONFile<Invoice>(file)
    
    for (const invoice of data) {
      const exists = invoiceStore.invoices.some(i => i.id === invoice.id)
      if (exists) {
        const invoiceData = {
          ...invoice,
          dueDate: new Date(invoice.dueDate),
          createdAt: new Date(invoice.createdAt),
          updatedAt: new Date(invoice.updatedAt),
          transactions: invoice.transactions.map(t => ({
            ...t,
            date: new Date(t.date),
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt)
          }))
        }
        await invoiceStore.updateInvoice(invoice.id, invoiceData)
      } else {
        const invoiceData = {
          ...invoice,
          dueDate: new Date(invoice.dueDate),
          createdAt: new Date(invoice.createdAt),
          updatedAt: new Date(invoice.updatedAt),
          transactions: invoice.transactions.map(t => ({
            ...t,
            date: new Date(t.date),
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt)
          }))
        }
        await invoiceStore.createInvoice(invoiceData)
      }
    }

    const time = formatImportTime()
    notify('success', getSuccessMessage('invoices', data.length))
    importHints.value.invoices = t('import.importedAt', { count: data.length, time })
    files.value.invoices = undefined
  } catch (error) {
    console.error('Error importing invoices:', error)
    notify('error', t('import.error'))
    files.value.invoices = undefined
  } finally {
    loading.value.invoices = false
  }
}

watch(() => files.value.cards, (newValue) => {
  if (hasFile(newValue)) {
    importCards()
  }
})

watch(() => files.value.participants, (newValue) => {
  if (hasFile(newValue)) {
    importParticipants()
  }
})

watch(() => files.value.invoices, (newValue) => {
  if (hasFile(newValue)) {
    importInvoices()
  }
})
</script>
