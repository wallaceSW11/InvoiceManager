<template>
  <div>
    <v-card>
      <v-card-title>
        {{ t('export.title') }}
      </v-card-title>

      <v-card-text>
        <p class="text-body-1 mb-4">{{ t('export.description') }}</p>

        <v-list>
          <v-list-item>
            <v-checkbox
              v-model="selectedEntities.cards"
              :label="t('export.cards')"
              :disabled="cardStore.cards.length === 0"
              color="primary"
              hide-details
            >
              <template #append>
                <v-chip size="small" color="primary" variant="tonal">
                  {{ cardStore.cards.length }}
                </v-chip>
              </template>
            </v-checkbox>
          </v-list-item>

          <v-list-item>
            <v-checkbox
              v-model="selectedEntities.participants"
              :label="t('export.participants')"
              :disabled="participantStore.participants.length === 0"
              color="primary"
              hide-details
            >
              <template #append>
                <v-chip size="small" color="primary" variant="tonal">
                  {{ participantStore.participants.length }}
                </v-chip>
              </template>
            </v-checkbox>
          </v-list-item>

          <v-list-item>
            <v-checkbox
              v-model="selectedEntities.invoices"
              :label="t('export.invoices')"
              :disabled="invoiceStore.invoices.length === 0"
              color="primary"
              hide-details
            >
              <template #append>
                <v-chip size="small" color="primary" variant="tonal">
                  {{ invoiceStore.invoices.length }}
                </v-chip>
              </template>
            </v-checkbox>
          </v-list-item>
        </v-list>

        <v-alert
          v-if="!hasDataToExport"
          type="info"
          variant="tonal"
          class="mt-4"
        >
          {{ t('export.noData') }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="!hasSelectedEntities"
          @click="exportData"
          prepend-icon="mdi-download"
        >
          {{ t('export.exportButton') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCardStore } from '@/presentation/stores/cardStore'
import { useParticipantStore } from '@/presentation/stores/participantStore'
import { useInvoiceStore } from '@/presentation/stores/invoiceStore'
import { notify } from '@wallacesw11/base-lib'

const { t } = useI18n()
const cardStore = useCardStore()
const participantStore = useParticipantStore()
const invoiceStore = useInvoiceStore()

const selectedEntities = ref({
  cards: false,
  participants: false,
  invoices: false
})

const hasDataToExport = computed(() => {
  return cardStore.cards.length > 0 || 
         participantStore.participants.length > 0 || 
         invoiceStore.invoices.length > 0
})

const hasSelectedEntities = computed(() => {
  return selectedEntities.value.cards || 
         selectedEntities.value.participants || 
         selectedEntities.value.invoices
})

function downloadJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function exportData() {
  try {
    const timestamp = new Date().toISOString().split('T')[0]
    let exportedCount = 0

    if (selectedEntities.value.cards && cardStore.cards.length > 0) {
      downloadJSON(cardStore.cards, `cards_${timestamp}.json`)
      exportedCount++
    }

    if (selectedEntities.value.participants && participantStore.participants.length > 0) {
      downloadJSON(participantStore.participants, `participants_${timestamp}.json`)
      exportedCount++
    }

    if (selectedEntities.value.invoices && invoiceStore.invoices.length > 0) {
      downloadJSON(invoiceStore.invoices, `invoices_${timestamp}.json`)
      exportedCount++
    }

    if (exportedCount > 0) {
      notify.success(t('export.success', { count: exportedCount }))
      
      selectedEntities.value = {
        cards: false,
        participants: false,
        invoices: false
      }
    }
  } catch (error) {
    console.error('Error exporting data:', error)
    notify.error(t('export.error'))
  }
}
</script>
