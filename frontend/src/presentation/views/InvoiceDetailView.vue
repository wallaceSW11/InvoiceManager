<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useInvoiceStore } from '@/presentation/stores/invoiceStore'
import { useParticipantStore } from '@/presentation/stores/participantStore'
import { useCardStore } from '@/presentation/stores/cardStore'
import { SplitMode, InvoiceStatus } from '@/core/domain/enums'
import type { Transaction, TransactionSplit, Participant } from '@/core/domain/entities'
import { MoneyCalculator } from '@/shared/utils/MoneyCalculator'
import MoneyInput from '@/presentation/components/common/MoneyInput.vue'


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

const isCompleted = computed(() => invoice.value?.status === InvoiceStatus.COMPLETED)

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
          const currentTotal = totals[participant.id] || 0
          const splitValue = splits[participant.id] || 0
          totals[participant.id] = MoneyCalculator.add(currentTotal, splitValue)
        })
      }
    })
  }

  return totals
})

const grandTotal = computed(() => {
  if (!invoice.value) return 0
  const amounts = invoice.value.transactions.map(t => t.amount)
  return MoneyCalculator.add(...amounts)
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
    // Se não está dividido, divide igualmente usando MoneyCalculator
    if (!transactionSplits.value[transaction.id]) {
      transactionSplits.value[transaction.id] = {}
    }

    const splits = transactionSplits.value[transaction.id]
    if (splits) {
      const splitValues = MoneyCalculator.splitEqually(transaction.amount, participants.value.length)
      participants.value.forEach((participant, index) => {
        splits[participant.id] = splitValues[index] || 0
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
      const splitValues = MoneyCalculator.splitEqually(difference, participantsWithValue.length)
      
      participantsWithValue.forEach((p, index) => {
        updateSplitValue(transaction.id, p.id, splitValues[index] || 0)
      })
    }
  } else {
    // Se não tem valor, adiciona dividindo a diferença entre os selecionados
    const participantsWithValue = participants.value.filter(p => 
      getSplitValue(transaction.id, p.id) > 0
    )
    
    // Inclui o participante atual na divisão
    const participantsToSplit = [...participantsWithValue, participant]
    const splitValues = MoneyCalculator.splitEqually(transaction.amount, participantsToSplit.length)
    
    participantsToSplit.forEach((p, index) => {
      updateSplitValue(transaction.id, p.id, splitValues[index] || 0)
    })
  }
}

function getTransactionDifference(transaction: Transaction): number {
  const total = getTransactionTotal(transaction)
  return MoneyCalculator.subtract(transaction.amount, total)
}

function getTransactionTotal(transaction: Transaction): number {
  const splits = transactionSplits.value[transaction.id] || {}
  return MoneyCalculator.add(...Object.values(splits))
}

function isTransactionValid(transaction: Transaction): boolean {
  const total = getTransactionTotal(transaction)
  const difference = MoneyCalculator.subtract(transaction.amount, total)
  return MoneyCalculator.isNegligible(difference)
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

async function completeInvoice() {
  if (!invoice.value || !areAllTransactionsValid()) return

  try {
    await saveInvoice()
    await invoiceStore.completeInvoice(invoice.value.id)
  } catch (error) {
    console.error('Error completing invoice:', error)
  }
}

async function reopenInvoice() {
  if (!invoice.value) return

  try {
    await invoiceStore.reopenInvoice(invoice.value.id)
  } catch (error) {
    console.error('Error reopening invoice:', error)
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

  const phone = '+55' + participant.phoneNumber.replace(/\D/g, '')
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
          <v-col cols="12" sm="6" md="3" lg="2">
            <div class="text-caption text-medium-emphasis">{{ t('invoice.card') }}</div>
            <div class="text-body-2 font-weight-medium">
              {{ card?.nickname }} (*{{ card?.lastFourDigits }})
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="3" lg="2">
            <div class="text-caption text-medium-emphasis">{{ t('invoice.dueDate') }}</div>
            <div class="text-body-2 font-weight-medium">
              {{ new Date(invoice.dueDate).toLocaleDateString('pt-BR') }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="3" lg="2">
            <div class="text-caption text-medium-emphasis">{{ t('invoice.total') }}</div>
            <div class="text-h6 font-weight-bold">
              {{ grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="3" lg="2">
            <div class="text-caption text-medium-emphasis">{{ t('invoice.status') }}</div>
            <v-chip
              :color="isCompleted ? 'success' : 'warning'"
              size="small"
            >
              {{ t(`invoice.statuses.${invoice.status.toLowerCase()}`) }}
            </v-chip>
          </v-col>
          <v-col cols="12" md="12" lg="4" class="d-flex justify-end flex-wrap gap-2">
            <v-btn
              v-if="isCompleted"
              color="warning"
              prepend-icon="mdi-lock-open"
              @click="reopenInvoice"
              size="small"
            >
              {{ t('invoice.actions.reopen') }}
            </v-btn>
            <v-btn
              v-else
              color="success"
              prepend-icon="mdi-check"
              @click="completeInvoice"
              :disabled="!areAllTransactionsValid()"
              size="small"
            >
              {{ t('invoice.actions.complete') }}
            </v-btn>
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
              :disabled="isCompleted"
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
                        :disabled="isCompleted"
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
                    <MoneyInput
                      :model-value="getSplitValue(transaction.id, participant.id)"
                      @update:model-value="(val) => updateSplitValue(transaction.id, participant.id, val)"
                      density="compact"
                      hide-details
                      variant="outlined"
                      :disabled="isCompleted"
                      style="max-width: 130px"
                    />
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-calculator"
                          size="x-small"
                          variant="text"
                          :disabled="isCompleted"
                          @click="autoSplitForParticipant(transaction, participant)"
                        />
                      </template>
                      <span>{{ t('invoice.split.select') }}</span>
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
