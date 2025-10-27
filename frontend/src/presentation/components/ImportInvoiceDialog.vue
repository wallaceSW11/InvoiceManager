<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCardStore } from '@/presentation/stores/cardStore'
import { useInvoiceStore } from '@/presentation/stores/invoiceStore'
import { CSVParser } from '@/infrastructure/parsers'

const { t } = useI18n()
const cardStore = useCardStore()
const invoiceStore = useInvoiceStore()

const emit = defineEmits<{
  close: []
  imported: [invoiceId: string]
}>()

const dialog = defineModel<boolean>({ required: true })
const selectedCardId = ref('')
const dueDate = ref('')
const file = ref<File | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const cards = computed(() => cardStore.cards)

const isValid = computed(() => {
  return selectedCardId.value !== '' && dueDate.value !== '' && file.value !== null
})

async function handleFileChange(files: File | File[]) {
  const fileArray = Array.isArray(files) ? files : [files]
  
  if (fileArray.length === 0 || !fileArray[0]) {
    file.value = null
    error.value = null
    return
  }

  file.value = fileArray[0]
  error.value = null
}

async function importInvoice() {
  if (!isValid.value || !selectedCardId.value || !dueDate.value || !file.value) return

  loading.value = true
  error.value = null

  try {
    const parser = new CSVParser()
    const content = await parser.readFile(file.value)
    const result = parser.parse(content)

    if (result.errors.length > 0) {
      error.value = result.errors.join('\n')
      loading.value = false
      return
    }

    if (result.transactions.length === 0) {
      error.value = t('invoice.import.noTransactions')
      loading.value = false
      return
    }

    const now = new Date()
    const newInvoice = await invoiceStore.createInvoice({
      cardId: selectedCardId.value,
      dueDate: new Date(dueDate.value),
      transactions: result.transactions.map(t => ({
        id: crypto.randomUUID(),
        date: new Date(t.date),
        description: t.description,
        amount: t.amount,
        splits: [],
        createdAt: now,
        updatedAt: now
      }))
    })

    emit('imported', newInvoice.id)
    
    setTimeout(() => {
      resetDialog()
    }, 100)
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
    loading.value = false
  }
}

function resetDialog() {
  selectedCardId.value = ''
  dueDate.value = ''
  file.value = null
  error.value = null
  loading.value = false
  dialog.value = false
  emit('close')
}

cardStore.fetchCards()
</script>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ t('invoice.import.title') }}</span>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="importInvoice">
          <v-select
            v-model="selectedCardId"
            :items="cards"
            item-title="nickname"
            item-value="id"
            :label="t('invoice.import.selectCard')"
            :rules="[v => !!v || t('invoice.import.validation.cardRequired')]"
            required
            class="mb-4"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #append>
                  <span class="text-caption text-medium-emphasis">****{{ item.raw.lastFourDigits }}</span>
                </template>
              </v-list-item>
            </template>
          </v-select>

          <v-text-field
            v-model="dueDate"
            type="date"
            :label="t('invoice.import.dueDate')"
            :rules="[v => !!v || t('invoice.import.validation.dueDateRequired')]"
            required
            class="mb-4"
          />

          <v-file-input
            :model-value="file ? [file] : []"
            @update:model-value="handleFileChange"
            :label="t('invoice.import.selectFile')"
            accept=".txt,text/plain"
            prepend-icon="mdi-file-document-outline"
            :rules="[v => !!v || t('invoice.import.validation.fileRequired')]"
            required
            show-size
            class="mb-4"
          />

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            closable
            @click:close="error = null"
          >
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="resetDialog" :disabled="loading">
          {{ t('common.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          @click="importInvoice"
          :disabled="!isValid"
          :loading="loading"
          color="primary"
        >
          {{ t('invoice.import.import') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
