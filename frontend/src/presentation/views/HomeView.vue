<template>
  <div>
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>{{ t('home.stats.cards') }}</v-card-title>
          <v-card-text class="text-h4">{{ cardStore.cardCount }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>{{ t('home.stats.participants') }}</v-card-title>
          <v-card-text class="text-h4">{{ participantStore.participantCount }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card @click="showInvoicesDialog = true" style="cursor: pointer">
          <v-card-title>{{ t('home.stats.invoices') }}</v-card-title>
          <v-card-text class="text-h4">{{ invoiceStore.invoiceCount }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-card-title>{{ t('home.quickActions.title') }}</v-card-title>
      <v-card-actions>
        <v-btn color="primary" prepend-icon="mdi-file-upload" @click="showImportDialog = true">
          {{ t('invoice.import.title') }}
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-credit-card" to="/cards">
          {{ t('home.quickActions.manageCards') }}
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-account-group" to="/participants">
          {{ t('home.quickActions.manageParticipants') }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <ImportInvoiceDialog v-model="showImportDialog" @imported="handleInvoiceImported" />

    <!-- Invoice List Dialog -->
    <v-dialog v-model="showInvoicesDialog" max-width="800">
      <v-card>
        <v-card-title>{{ t('home.invoices.title') }}</v-card-title>
        <v-card-text>
          <v-list v-if="invoiceStore.invoices.length > 0">
            <v-list-item
              v-for="invoice in invoiceStore.invoices"
              :key="invoice.id"
              @click="goToInvoice(invoice.id)"
              :title="getCardName(invoice.cardId)"
              :subtitle="`${t('invoice.dueDate')}: ${formatDate(invoice.dueDate)} - ${formatCurrency(invoice.totalAmount)}`"
            >
              <template #prepend>
                <v-icon color="primary">mdi-file-document-outline</v-icon>
              </template>
              <template #append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
          </v-list>
          <v-alert v-else type="info" variant="tonal">
            {{ t('home.invoices.noInvoices') }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showInvoicesDialog = false">
            {{ t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useCardStore } from '@/presentation/stores/cardStore'
import { useParticipantStore } from '@/presentation/stores/participantStore'
import { useInvoiceStore } from '@/presentation/stores/invoiceStore'
import ImportInvoiceDialog from '@/presentation/components/ImportInvoiceDialog.vue'

const { t } = useI18n()
const router = useRouter()
const cardStore = useCardStore()
const participantStore = useParticipantStore()
const invoiceStore = useInvoiceStore()

const showImportDialog = ref(false)
const showInvoicesDialog = ref(false)

onMounted(async () => {
  await Promise.all([
    cardStore.fetchCards(),
    participantStore.fetchParticipants(),
    invoiceStore.fetchInvoices()
  ])
})

async function handleInvoiceImported(invoiceId: string) {
  showImportDialog.value = false
  await router.push(`/invoice/${invoiceId}`)
}

function goToInvoice(invoiceId: string) {
  showInvoicesDialog.value = false
  router.push(`/invoice/${invoiceId}`)
}

function getCardName(cardId: string): string {
  const card = cardStore.getCardById(cardId)
  return card ? `${card.nickname} (*${card.lastFourDigits})` : 'Unknown'
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>
