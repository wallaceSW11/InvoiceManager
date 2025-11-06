<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { navigateTo } from '@/presentation/router'
import { useInvoiceStore } from '@/presentation/stores/invoiceStore'
import { useParticipantStore } from '@/presentation/stores/participantStore'
import { useCardStore } from '@/presentation/stores/cardStore'
import { SplitMode, InvoiceStatus } from '@/core/domain/enums'
import type { Transaction, TransactionSplit, Participant } from '@/core/domain/entities'
import { MoneyCalculator } from '@/shared/utils/MoneyCalculator'
import MoneyInput from '@/presentation/components/common/MoneyInput.vue'
import { notify } from '@/lib/utils'


const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const invoiceStore = useInvoiceStore()
const participantStore = useParticipantStore()
const cardStore = useCardStore()

const transactionSplits = ref<Record<string, Record<string, number>>>({})
const manualValues = ref<Record<string, Record<string, boolean>>>({}) // Rastreia valores manuais
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
  if (!manualValues.value[transactionId]) {
    manualValues.value[transactionId] = {}
  }
  
  transactionSplits.value[transactionId][participantId] = Number(value.toFixed(2))
  manualValues.value[transactionId][participantId] = true
}

function isManualValue(transactionId: string, participantId: string): boolean {
  return manualValues.value[transactionId]?.[participantId] || false
}

function autoSplitTransaction(transaction: Transaction) {
  if (participants.value.length === 0) return

  const participantsWithoutValue = participants.value.filter(p => {
    const value = getSplitValue(transaction.id, p.id)
    const isManual = isManualValue(transaction.id, p.id)
    return value === 0 && !isManual
  })
  
  if (participantsWithoutValue.length === 0) return

  const currentTotal = getTransactionTotal(transaction)
  const remaining = MoneyCalculator.subtract(transaction.amount, currentTotal)
  
  if (remaining === 0) return

  if (!transactionSplits.value[transaction.id]) {
    transactionSplits.value[transaction.id] = {}
  }
  if (!manualValues.value[transaction.id]) {
    manualValues.value[transaction.id] = {}
  }

  const splits = transactionSplits.value[transaction.id]
  const manuals = manualValues.value[transaction.id]
  if (splits && manuals) {
    const splitValues = MoneyCalculator.splitEqually(remaining, participantsWithoutValue.length)
    participantsWithoutValue.forEach((participant, index) => {
      splits[participant.id] = splitValues[index] || 0
      manuals[participant.id] = false
    })
  }
}

function removeAllSplits(transaction: Transaction) {
  if (!transactionSplits.value[transaction.id]) return

  const splits = transactionSplits.value[transaction.id]
  const manuals = manualValues.value[transaction.id]
  
  participants.value.forEach(participant => {
    if (!isManualValue(transaction.id, participant.id)) {
      if (splits) {
        splits[participant.id] = 0
      }
      if (manuals) {
        delete manuals[participant.id]
      }
    }
  })
}

function canDivideAll(transaction: Transaction): boolean {
  if (participants.value.length === 0) return false
  
  return participants.value.some(p => {
    const value = getSplitValue(transaction.id, p.id)
    const isManual = isManualValue(transaction.id, p.id)
    return value === 0 && !isManual
  })
}

function canRemoveAll(transaction: Transaction): boolean {
  if (!transactionSplits.value[transaction.id]) return false
  
  return participants.value.some(p => {
    const value = getSplitValue(transaction.id, p.id)
    const isManual = isManualValue(transaction.id, p.id)
    return value !== 0 && !isManual
  })
}

function toggleParticipantSplit(transaction: Transaction, participant: Participant) {
  const currentValue = getSplitValue(transaction.id, participant.id)
  
  if (currentValue !== 0) {
    if (!isManualValue(transaction.id, participant.id)) {
      updateSplitValueProgrammatically(transaction.id, participant.id, 0)
      const manuals = manualValues.value[transaction.id]
      if (manuals) {
        delete manuals[participant.id]
      }
      
      recalculateAutomaticSplits(transaction)
    }
  } else {
    updateSplitValueProgrammatically(transaction.id, participant.id, 1)
    
    recalculateAutomaticSplits(transaction)
  }
}

function recalculateAutomaticSplits(transaction: Transaction) {
  let manualTotal = 0
  participants.value.forEach(p => {
    if (isManualValue(transaction.id, p.id)) {
      manualTotal = MoneyCalculator.add(manualTotal, getSplitValue(transaction.id, p.id))
    }
  })
  
  const remaining = MoneyCalculator.subtract(transaction.amount, manualTotal)
  
  if (remaining === 0) return
  
  const automaticParticipants = participants.value.filter(p => {
    const value = getSplitValue(transaction.id, p.id)
    const isManual = isManualValue(transaction.id, p.id)
    return value !== 0 && !isManual
  })
  
  if (automaticParticipants.length === 0) return
  
  const splitValues = MoneyCalculator.splitEqually(remaining, automaticParticipants.length)
  
  automaticParticipants.forEach((p, index) => {
    updateSplitValueProgrammatically(transaction.id, p.id, splitValues[index] || 0)
  })
}

function updateSplitValueProgrammatically(transactionId: string, participantId: string, value: number) {
  if (!transactionSplits.value[transactionId]) {
    transactionSplits.value[transactionId] = {}
  }
  if (!manualValues.value[transactionId]) {
    manualValues.value[transactionId] = {}
  }
  
  transactionSplits.value[transactionId][participantId] = Number(value.toFixed(2))
  manualValues.value[transactionId][participantId] = false
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
  if (!invoice.value) return

  saving.value = true
  try {
    const updatedTransactions = invoice.value.transactions.map(transaction => ({
      ...transaction,
      splits: participants.value
        .map(participant => {
          const amount = getSplitValue(transaction.id, participant.id)
          if (amount !== 0) {
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
    
    notify('success', t('invoice.saved'))
  } catch (error) {
    console.error('Error saving invoice:', error)
    notify('error', t('invoice.saveError'))
  } finally {
    saving.value = false
  }
}

async function saveAndClose() {
  await saveInvoice()
  await navigateTo(router, '/')
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
      if (splitAmount !== 0) {
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

async function copyAllMessages() {
  if (!invoice.value || !card.value) return

  const cardName = `${card.value.nickname} (*${card.value.lastFourDigits})`
  const dueDate = new Date(invoice.value.dueDate).toLocaleDateString('pt-BR')
  
  let fullMessage = `📄 RESUMO COMPLETO DA FATURA\n`
  fullMessage += `Cartão: ${cardName}\n`
  fullMessage += `Vencimento: ${dueDate}\n`
  fullMessage += `${'='.repeat(50)}\n\n`

  const participantsWithValues = participants.value.filter(p => (totalsByParticipant.value[p.id] || 0) !== 0)
  
  participantsWithValues.forEach((participant, index) => {
    const total = totalsByParticipant.value[participant.id] || 0
    const totalStr = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    
    fullMessage += `👤 ${participant.name.toUpperCase()}\n`
    fullMessage += `${'-'.repeat(50)}\n`
    
    invoice.value!.transactions.forEach(transaction => {
      const splitAmount = getSplitValue(transaction.id, participant.id)
      if (splitAmount !== 0) {
        const dateStr = new Date(transaction.date).toLocaleDateString('pt-BR')
        const amountStr = splitAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        fullMessage += `  • ${dateStr} - ${transaction.description}: ${amountStr}\n`
      }
    })
    
    fullMessage += `\n  💰 TOTAL: ${totalStr}\n`
    
    if (index < participantsWithValues.length - 1) {
      fullMessage += `\n${'='.repeat(50)}\n\n`
    }
  })

  const grandTotalStr = grandTotal.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  fullMessage += `\n${'='.repeat(50)}\n`
  fullMessage += `💵 TOTAL GERAL DA FATURA: ${grandTotalStr}`

  try {
    await navigator.clipboard.writeText(fullMessage)
    copiedParticipantId.value = 'all'
    setTimeout(() => {
      copiedParticipantId.value = null
    }, 2000)
  } catch (error) {
    console.error('Error copying all messages to clipboard:', error)
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
                  <div class="d-flex align-center justify-center gap-1">
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-calculator-variant"
                          size="small"
                          variant="text"
                          :disabled="isCompleted || !canDivideAll(transaction)"
                          @click="autoSplitTransaction(transaction)"
                        />
                      </template>
                      <span>{{ t('invoice.split.divideAll') }}</span>
                    </v-tooltip>
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-eraser-variant"
                          size="small"
                          variant="text"
                          color="error"
                          :disabled="isCompleted || !canRemoveAll(transaction)"
                          @click="removeAllSplits(transaction)"
                        />
                      </template>
                      <span>{{ t('invoice.split.removeAll') }}</span>
                    </v-tooltip>
                  </div>
                </td>
                <td
                  v-for="participant in participants"
                  :key="participant.id"
                  class="pa-1"
                >
                  <div class="d-flex align-center gap-1">
                    <div style="position: relative; width: 130px;">
                      <MoneyInput
                        :model-value="getSplitValue(transaction.id, participant.id)"
                        @update:model-value="(val) => updateSplitValue(transaction.id, participant.id, val)"
                        density="compact"
                        hide-details
                        variant="outlined"
                        :disabled="isCompleted"
                        :color="isManualValue(transaction.id, participant.id) ? 'primary' : undefined"
                      />
                      <v-tooltip location="top" v-if="isManualValue(transaction.id, participant.id) && getSplitValue(transaction.id, participant.id) !== 0">
                        <template #activator="{ props }">
                          <v-icon 
                            v-bind="props"
                            size="x-small" 
                            color="primary" 
                            style="position: absolute; top: 2px; right: 2px;"
                          >
                            mdi-pencil
                          </v-icon>
                        </template>
                        <span>{{ t('invoice.split.manualValue') }}</span>
                      </v-tooltip>
                    </div>
                    <v-tooltip location="top" v-if="!isManualValue(transaction.id, participant.id) || getSplitValue(transaction.id, participant.id) === 0">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          :icon="getSplitValue(transaction.id, participant.id) !== 0 ? 'mdi-minus' : 'mdi-plus'"
                          size="x-small"
                          variant="text"
                          :color="getSplitValue(transaction.id, participant.id) !== 0 ? 'error' : 'success'"
                          :disabled="isCompleted"
                          @click="toggleParticipantSplit(transaction, participant)"
                        />
                      </template>
                      <span>{{ getSplitValue(transaction.id, participant.id) !== 0 ? t('invoice.split.remove') : t('invoice.split.add') }}</span>
                    </v-tooltip>
                    <div v-else style="width: 28px"></div>
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
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ t('invoice.whatsapp.title') }}</span>
          <v-btn
            color="primary"
            variant="tonal"
            prepend-icon="mdi-content-copy"
            @click="copyAllMessages"
            size="small"
          >
            {{ copiedParticipantId === 'all' ? t('invoice.whatsapp.copiedAll') : t('invoice.whatsapp.copyAll') }}
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel
              v-for="participant in participants.filter(p => (totalsByParticipant[p.id] || 0) !== 0)"
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
