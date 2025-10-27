<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useInvoiceStore } from '@/presentation/stores/invoiceStore'
import { useParticipantStore } from '@/presentation/stores/participantStore'
import { useCardStore } from '@/presentation/stores/cardStore'
import { SplitMode } from '@/core/domain/enums'
import type { Transaction, TransactionSplit, Participant } from '@/core/domain/entities'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const invoiceStore = useInvoiceStore()
const participantStore = useParticipantStore()
const cardStore = useCardStore()

const transactionSplits = ref<Record<string, Record<string, number>>>({})
const saving = ref(false)
const showWhatsAppDialog = ref(false)
const generatedMessages = ref<Record<string, string>>({})
const copiedParticipantId = ref<string | null>(null)
const searchQuery = ref('')

const invoice = computed(() => invoiceStore.currentInvoice)
const participants = computed(() => participantStore.participants)
const card = computed(() => {
  if (!invoice.value) return null
  return cardStore.getCardById(invoice.value.cardId)
})

const filteredTransactions = computed(() => {
  if (!invoice.value || !searchQuery.value) return invoice.value?.transactions || []
  
  const query = searchQuery.value.toLowerCase()
  return invoice.value.transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(query) ||
    new Date(transaction.date).toLocaleDateString('pt-BR').includes(query)
  )
})

const totalsByParticipant = computed(() => {
  const totals: Record<string, number> = {}
  participants.value.forEach(participant => {
    totals[participant.id] = 0
  })

  if (invoice.value) {
    invoice.value.transactions.forEach(transaction => {
      const splits = transactionSplits.value[transaction.id]
      if (splits) {
        participants.value.forEach(participant => {
          totals[participant.id] = (totals[participant.id] || 0) + (splits[participant.id] || 0)
        })
      }
    })
  }

  return totals
})

const grandTotal = computed(() => {
  if (!invoice.value) return 0
  return invoice.value.transactions.reduce((sum, t) => sum + t.amount, 0)
})

function initializeTransactionSplits() {
  if (!invoice.value) return

  invoice.value.transactions.forEach(transaction => {
    if (!transactionSplits.value[transaction.id]) {
      transactionSplits.value[transaction.id] = {}
    }

    const splits = transactionSplits.value[transaction.id]
    if (splits) {
      transaction.splits.forEach(split => {
        splits[split.participantId] = split.amount
      })
    }
  })
}

function getSplitValue(transactionId: string, participantId: string): number {
  return transactionSplits.value[transactionId]?.[participantId] || 0
}

function updateSplitValue(transactionId: string, participantId: string, value: number) {
  if (!transactionSplits.value[transactionId]) {
    transactionSplits.value[transactionId] = {}
  }
  transactionSplits.value[transactionId][participantId] = value
}

function autoSplitTransaction(transaction: Transaction) {
  if (participants.value.length === 0) return

  // Verifica se já está dividido (todos os participantes têm valor)
  const allHaveValues = participants.value.every(p => getSplitValue(transaction.id, p.id) > 0)
  
  if (allHaveValues) {
    // Se já está dividido, remove tudo (zera todos)
    participants.value.forEach(participant => {
      updateSplitValue(transaction.id, participant.id, 0)
    })
  } else {
    // Se não está dividido, divide igualmente
    const splitAmount = transaction.amount / participants.value.length
    const roundedAmount = Math.round(splitAmount * 100) / 100

    if (!transactionSplits.value[transaction.id]) {
      transactionSplits.value[transaction.id] = {}
    }

    const splits = transactionSplits.value[transaction.id]
    if (splits) {
      participants.value.forEach((participant, index) => {
        if (index === participants.value.length - 1) {
          const sumOthers = participants.value
            .slice(0, -1)
            .reduce((sum) => sum + roundedAmount, 0)
          splits[participant.id] = Math.round((transaction.amount - sumOthers) * 100) / 100
        } else {
          splits[participant.id] = roundedAmount
        }
      })
    }
  }
}

function autoSplitForParticipant(transaction: Transaction, participant: Participant) {
  const currentValue = getSplitValue(transaction.id, participant.id)
  
  if (currentValue > 0) {
    // Se já tem valor, remove (zera) e recalcula para os outros
    updateSplitValue(transaction.id, participant.id, 0)
    
    // Recalcula dividindo igualmente entre os que ainda têm valor
    const participantsWithValue = participants.value.filter(p => {
      const value = getSplitValue(transaction.id, p.id)
      return value > 0 && p.id !== participant.id
    })
    
    if (participantsWithValue.length > 0) {
      const difference = getTransactionDifference(transaction)
      const splitAmount = difference / participantsWithValue.length
      const roundedAmount = Math.round(splitAmount * 100) / 100
      
      participantsWithValue.forEach((p, index) => {
        if (index === participantsWithValue.length - 1) {
          // Último participante recebe o resto para evitar diferença por arredondamento
          const sumOthers = participantsWithValue
            .slice(0, -1)
            .reduce((sum) => sum + roundedAmount, 0)
          const lastAmount = Math.round((difference - sumOthers) * 100) / 100
          updateSplitValue(transaction.id, p.id, lastAmount)
        } else {
          updateSplitValue(transaction.id, p.id, roundedAmount)
        }
      })
    }
  } else {
    // Se não tem valor, adiciona dividindo a diferença entre os selecionados
    const participantsWithValue = participants.value.filter(p => 
      getSplitValue(transaction.id, p.id) > 0
    )
    
    // Inclui o participante atual na divisão
    const participantsToSplit = [...participantsWithValue, participant]
    const difference = getTransactionDifference(transaction)
    const splitAmount = (difference + participantsWithValue.reduce((sum, p) => 
      sum + getSplitValue(transaction.id, p.id), 0)) / participantsToSplit.length
    const roundedAmount = Math.round(splitAmount * 100) / 100
    
    participantsToSplit.forEach((p, index) => {
      if (index === participantsToSplit.length - 1) {
        // Último participante recebe o resto
        const sumOthers = participantsToSplit
          .slice(0, -1)
          .reduce((sum) => sum + roundedAmount, 0)
        const lastAmount = Math.round((transaction.amount - sumOthers) * 100) / 100
        updateSplitValue(transaction.id, p.id, lastAmount)
      } else {
        updateSplitValue(transaction.id, p.id, roundedAmount)
      }
    })
  }
}

function getTransactionDifference(transaction: Transaction): number {
  const total = getTransactionTotal(transaction)
  return Math.round((transaction.amount - total) * 100) / 100
}

function getTransactionTotal(transaction: Transaction): number {
  const splits = transactionSplits.value[transaction.id] || {}
  return Object.values(splits).reduce((sum, amount) => sum + amount, 0)
}

function isTransactionValid(transaction: Transaction): boolean {
  const total = getTransactionTotal(transaction)
  return Math.abs(total - transaction.amount) < 0.01
}

function areAllTransactionsValid(): boolean {
  if (!invoice.value) return false
  return invoice.value.transactions.every(t => isTransactionValid(t))
}

async function saveInvoice() {
  if (!invoice.value || !areAllTransactionsValid()) return

  saving.value = true
  try {
    const updatedTransactions = invoice.value.transactions.map(transaction => ({
      ...transaction,
      splits: participants.value
        .map(participant => {
          const amount = getSplitValue(transaction.id, participant.id)
          if (amount > 0) {
            return {
              participantId: participant.id,
              amount,
              mode: SplitMode.MANUAL
            } as TransactionSplit
          }
          return null
        })
        .filter((split): split is TransactionSplit => split !== null)
    }))

    await invoiceStore.updateInvoice(invoice.value.id, {
      transactions: updatedTransactions
    })
  } catch (error) {
    console.error('Error saving invoice:', error)
  } finally {
    saving.value = false
  }
}

async function saveAndClose() {
  await saveInvoice()
  if (areAllTransactionsValid()) {
    router.push('/')
  }
}

function generateWhatsAppMessages() {
  if (!invoice.value || !card.value) return

  generatedMessages.value = {}

  participants.value.forEach(participant => {
    const total = totalsByParticipant.value[participant.id] || 0
    if (total === 0) return

    const cardName = `${card.value?.nickname} (*${card.value?.lastFourDigits})`
    const dueDate = new Date(invoice.value!.dueDate).toLocaleDateString('pt-BR')
    
    let message = `Olá ${participant.name}! 👋\n\n`
    message += `Segue sua parte da fatura do cartão ${cardName}:\n`
    message += `Vencimento: ${dueDate}\n\n`
    message += `📋 *Suas compras:*\n`

    invoice.value!.transactions.forEach(transaction => {
      const splitAmount = getSplitValue(transaction.id, participant.id)
      if (splitAmount > 0) {
        const dateStr = new Date(transaction.date).toLocaleDateString('pt-BR')
        const amountStr = splitAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        message += `• ${dateStr} - ${transaction.description}: ${amountStr}\n`
      }
    })

    const totalStr = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    message += `\n💰 *Total: ${totalStr}*`

    generatedMessages.value[participant.id] = message
  })

  showWhatsAppDialog.value = true
}

async function copyToClipboard(participantId: string) {
  const message = generatedMessages.value[participantId]
  if (!message) return

  try {
    await navigator.clipboard.writeText(message)
    copiedParticipantId.value = participantId
    setTimeout(() => {
      copiedParticipantId.value = null
    }, 2000)
  } catch (error) {
    console.error('Error copying to clipboard:', error)
  }
}

function openWhatsApp(participantId: string) {
  const participant = participants.value.find(p => p.id === participantId)
  const message = generatedMessages.value[participantId]
  
  if (!participant || !message) return

  const phone = participant.phoneNumber.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  const url = `https://wa.me/${phone}?text=${encodedMessage}`
  
  window.open(url, '_blank')
}

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await Promise.all([
      invoiceStore.fetchInvoiceById(id),
      participantStore.fetchParticipants(),
      cardStore.fetchCards()
    ])
    initializeTransactionSplits()
  }
})
</script>

<template>
  <div v-if="invoice" style="display: flex; flex-direction: column; padding: 16px;">
    <!-- Header Card -->
    <v-card class="mb-2">
      <v-card-text class="py-3">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="2">
            <div class="text-caption text-medium-emphasis">{{ t('invoice.card') }}</div>
            <div class="text-body-2 font-weight-medium">
              {{ card?.nickname }} (*{{ card?.lastFourDigits }})
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <div class="text-caption text-medium-emphasis">{{ t('invoice.dueDate') }}</div>
            <div class="text-body-2 font-weight-medium">
              {{ new Date(invoice.dueDate).toLocaleDateString('pt-BR') }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <div class="text-caption text-medium-emphasis">{{ t('invoice.total') }}</div>
            <div class="text-h6 font-weight-bold">
              {{ grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </div>
          </v-col>
          <v-col cols="12" sm="12" md="6" class="d-flex justify-end flex-wrap gap-2">
            <v-btn
              color="success"
              prepend-icon="mdi-whatsapp"
              @click="generateWhatsAppMessages"
              :disabled="!areAllTransactionsValid()"
              size="small"
            >
              WhatsApp
            </v-btn>
            <v-btn
              color="primary"
              prepend-icon="mdi-content-save"
              :loading="saving"
              @click="saveInvoice"
              size="small"
            >
              {{ t('common.save') }}
            </v-btn>
            <v-btn
              color="secondary"
              prepend-icon="mdi-close"
              @click="saveAndClose"
              size="small"
            >
              {{ t('common.close') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Search Field -->
    <v-card class="mb-2">
      <v-card-text class="py-2">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          :label="t('invoice.split.search')"
          clearable
          hide-details
          density="compact"
        />
      </v-card-text>
    </v-card>

    <!-- Table Card -->
    <v-card class="mb-2">
      <v-card-text class="pa-0">
        <v-table density="compact" fixed-header height="calc(100dvh - 400px)">
            <thead>
              <tr>
                <th class="text-left" style="min-width: 100px">{{ t('invoice.date') }}</th>
                <th class="text-left" style="min-width: 200px">{{ t('invoice.description') }}</th>
                <th class="text-right" style="min-width: 120px">{{ t('invoice.total') }}</th>
                <th class="text-right" style="min-width: 120px">{{ t('invoice.split.difference') }}</th>
                <th class="text-center" style="width: 60px"></th>
                <th
                  v-for="participant in participants"
                  :key="participant.id"
                  class="text-left"
                  style="min-width: 200px"
                >
                  {{ participant.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in filteredTransactions"
                :key="transaction.id"
                :class="{ 'bg-error-lighten-4': !isTransactionValid(transaction) }"
              >
                <td class="text-no-wrap">{{ new Date(transaction.date).toLocaleDateString('pt-BR') }}</td>
                <td class="text-truncate" style="max-width: 200px">
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <span v-bind="props">{{ transaction.description }}</span>
                    </template>
                    <span>{{ transaction.description }}</span>
                  </v-tooltip>
                </td>
                <td class="text-right font-weight-bold text-no-wrap">
                  {{ transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                </td>
                <td class="text-right font-weight-bold text-no-wrap" :class="getTransactionDifference(transaction) === 0 ? 'text-success' : 'text-error'">
                  {{ getTransactionDifference(transaction).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                </td>
                <td class="text-center">
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi-calculator"
                        size="small"
                        variant="text"
                        @click="autoSplitTransaction(transaction)"
                      />
                    </template>
                    <span>{{ t('invoice.split.divideAll') }}</span>
                  </v-tooltip>
                </td>
                <td
                  v-for="participant in participants"
                  :key="participant.id"
                  class="pa-1"
                >
                  <div class="d-flex align-center gap-1">
                    <v-text-field
                      :model-value="getSplitValue(transaction.id, participant.id)"
                      @update:model-value="(val) => updateSplitValue(transaction.id, participant.id, Number(val) || 0)"
                      type="number"
                      density="compact"
                      hide-details
                      variant="outlined"
                      step="0.01"
                      min="0"
                      class="text-right"
                      style="max-width: 130px"
                    />
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-calculator"
                          size="x-small"
                          variant="text"
                          @click="autoSplitForParticipant(transaction, participant)"
                        />
                      </template>
                      <span>{{ t('invoice.split.divideAll') }}</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
      </v-card-text>
    </v-card>

    <!-- Totals Card -->
    <v-card class="mt-2">
      <v-card-text class="pa-0">
        <v-table density="compact">
          <tbody>
            <tr class="bg-grey-lighten-4">
              <td class="text-left font-weight-bold" style="min-width: 100px">{{ t('invoice.split.totals') }}</td>
              <td class="text-left" style="min-width: 200px"></td>
              <td class="text-right font-weight-bold text-h6" style="min-width: 120px">
                {{ grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
              </td>
              <td class="text-right" style="min-width: 120px"></td>
              <td class="text-center" style="width: 60px"></td>
              <td
                v-for="participant in participants"
                :key="participant.id"
                class="pa-1"
                style="min-width: 200px"
              >
                <div class="text-caption text-medium-emphasis">{{ participant.name }}</div>
                <div class="text-body-1 font-weight-bold">
                  {{ (totalsByParticipant[participant.id] || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- WhatsApp Dialog -->
    <v-dialog v-model="showWhatsAppDialog" max-width="800">
      <v-card>
        <v-card-title>{{ t('invoice.whatsapp.title') }}</v-card-title>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel
              v-for="participant in participants.filter(p => (totalsByParticipant[p.id] || 0) > 0)"
              :key="participant.id"
            >
              <v-expansion-panel-title>
                <div class="d-flex align-center justify-space-between w-100 pr-4">
                  <span class="font-weight-medium">
                    {{ participant.name }}
                  </span>
                  <span class="text-success font-weight-bold">
                    {{ (totalsByParticipant[participant.id] || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                  </span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-textarea
                  :model-value="generatedMessages[participant.id]"
                  readonly
                  variant="outlined"
                  rows="10"
                  class="mb-4"
                />
                <div class="d-flex gap-2">
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-content-copy"
                    @click="copyToClipboard(participant.id)"
                  >
                    {{ copiedParticipantId === participant.id ? t('invoice.whatsapp.copied') : t('invoice.whatsapp.copy') }}
                  </v-btn>
                  <v-btn
                    color="success"
                    prepend-icon="mdi-whatsapp"
                    @click="openWhatsApp(participant.id)"
                  >
                    {{ t('invoice.whatsapp.send') }}
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showWhatsAppDialog = false">
            {{ t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else class="d-flex justify-center align-center" style="height: 400px">
    <v-progress-circular indeterminate color="primary" />
  </div>
</template>

<style scoped>
/* Remove setas do input number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
  text-align: right;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-1 {
  gap: 0.25rem;
}
</style>
