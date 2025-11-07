<template>
  <div>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4">{{ t('invoice.list.title') }}</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-row align="center">
          <v-col>
            {{ t('invoice.list.subtitle') }}
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="invoiceStore.invoices"
          :loading="invoiceStore.loading"
          item-value="id"
        >
          <template #item.cardId="{ item }">
            {{ getCardName(item.cardId) }}
          </template>

          <template #item.dueDate="{ item }">
            {{ formatDate(item.dueDate) }}
          </template>

          <template #item.totalAmount="{ item }">
            {{ formatCurrency(item.totalAmount) }}
          </template>

          <template #item.status="{ item }">
            <v-chip
              :color="item.status === InvoiceStatus.COMPLETED ? 'success' : 'warning'"
              size="small"
            >
              {{ t(`invoice.statuses.${item.status.toLowerCase()}`) }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              :icon="item.status === InvoiceStatus.COMPLETED ? 'mdi-eye' : 'mdi-pencil'"
              size="small"
              variant="text"
              @click="viewInvoice(item.id)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="confirmDelete(item)"
            />
          </template>

          <template #no-data>
            <v-alert type="info" variant="tonal">
              {{ t('invoice.list.noInvoices') }}
            </v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { navigateTo } from '@/presentation/router'
import { useInvoiceStore } from '@/presentation/stores/invoiceStore'
import { useCardStore } from '@/presentation/stores/cardStore'
import { InvoiceStatus } from '@/core/domain/enums'
import type { Invoice } from '@/core/domain/entities'
import { useGlobals } from '@wallacesw11/base-lib'

const { t } = useI18n()
const router = useRouter()
const invoiceStore = useInvoiceStore()
const cardStore = useCardStore()
const { confirm, notify } = useGlobals()

const headers = computed(() => [
  { title: t('invoice.card'), key: 'cardId', sortable: true },
  { title: t('invoice.dueDate'), key: 'dueDate', sortable: true },
  { title: t('invoice.total'), key: 'totalAmount', sortable: true },
  { title: t('invoice.status'), key: 'status', sortable: true },
  { title: t('common.actions'), key: 'actions', sortable: false, align: 'end' as const }
])

onMounted(async () => {
  await Promise.all([
    invoiceStore.fetchInvoices(),
    cardStore.fetchCards()
  ])
})

function getCardName(cardId: string): string {
  const card = cardStore.getCardById(cardId)
  return card ? `${card.nickname} (*${card.lastFourDigits})` : t('common.unknown')
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString()
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function viewInvoice(id: string) {
  navigateTo(router, `/invoice/${id}`)
}

async function confirmDelete(invoice: Invoice) {
  const confirmed = await confirm.show(
    t('invoice.list.deleteConfirm'),
    t('invoice.list.deleteMessage', { 
      card: getCardName(invoice.cardId),
      date: formatDate(invoice.dueDate)
    })
  )

  if (confirmed) {
    try {
      await invoiceStore.deleteInvoice(invoice.id)
      notify.success(t('invoice.messages.deleted'))
    } catch (error) {
      console.error('Failed to delete invoice:', error)
      notify.error(t('invoice.messages.error'))
    }
  }
}
</script>
