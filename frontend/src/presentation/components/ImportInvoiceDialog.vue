<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useCardStore } from "@/presentation/stores/cardStore";
import { useInvoiceStore } from "@/presentation/stores/invoiceStore";
import { CSVParser } from "@/infrastructure/parsers";
import { ModalBase, useGlobals } from "@wallacesw11/base-lib";
import type { ModalAction } from "@wallacesw11/base-lib";

const { t } = useI18n();
const cardStore = useCardStore();
const invoiceStore = useInvoiceStore();
const { notify } = useGlobals();

const emit = defineEmits<{
  close: [];
  imported: [invoiceId: string];
}>();

const dialog = defineModel<boolean>({ required: true });
const selectedCardId = ref("");
const dueDate = ref("");
const file = ref<File | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const cards = computed(() => cardStore.cards);

const isValid = computed(() => {
  return (
    selectedCardId.value !== "" && dueDate.value !== "" && file.value !== null
  );
});

const modalActions = computed((): ModalAction[] => [
  {
    text: t('invoice.import.import'),
    color: 'primary',
    variant: 'elevated',
    icon: 'mdi-file-upload',
    handler: importInvoice
  },
  {
    text: t('common.cancel'),
    color: 'grey',
    variant: 'text',
    handler: () => { dialog.value = false }
  }
]);

async function handleFileChange(files: File | File[]) {
  const fileArray = Array.isArray(files) ? files : [files];

  if (fileArray.length === 0 || !fileArray[0]) {
    file.value = null;
    error.value = null;
    return;
  }

  file.value = fileArray[0];
  error.value = null;
}

async function importInvoice() {
  if (!isValid.value || !selectedCardId.value || !dueDate.value || !file.value)
    return;

  loading.value = true;
  error.value = null;

  try {
    const selectedDate = new Date(dueDate.value);
    const existingInvoice = invoiceStore.invoices.find((invoice) => {
      const invoiceDueDate = new Date(invoice.dueDate);
      return (
        invoice.cardId === selectedCardId.value &&
        invoiceDueDate.toDateString() === selectedDate.toDateString()
      );
    });

    if (existingInvoice) {
      emit("imported", existingInvoice.id);
      setTimeout(() => {
        resetDialog();
      }, 100);
      notify.info(t("invoice.import.alreadyExists"));
      
      return;
    }

    const parser = new CSVParser();
    const content = await parser.readFile(file.value);
    const result = parser.parse(content);

    if (result.errors.length > 0) {
      error.value = result.errors.join("\n");
      loading.value = false;
      return;
    }

    if (result.transactions.length === 0) {
      error.value = t("invoice.import.noTransactions");
      loading.value = false;
      return;
    }

    const now = new Date();
    const newInvoice = await invoiceStore.createInvoice({
      cardId: selectedCardId.value,
      dueDate: new Date(dueDate.value),
      transactions: result.transactions
        .map((t) => ({
          id: crypto.randomUUID(),
          date: new Date(t.date),
          description: t.description,
          amount: t.amount,
          splits: [],
          createdAt: now,
          updatedAt: now,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    });

    notify.success(t("invoice.import.messages.success"));
    emit("imported", newInvoice.id);

    setTimeout(() => {
      resetDialog();
    }, 100);
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
    notify.error(t("invoice.import.messages.error"));
    loading.value = false;
  }
}

function resetDialog() {
  selectedCardId.value = "";
  dueDate.value = "";
  file.value = null;
  error.value = null;
  loading.value = false;
  dialog.value = false;
  emit("close");
}

cardStore.fetchCards();
</script>

<template>
  <ModalBase
    v-model="dialog"
    :title="t('invoice.import.title')"
    :actions="modalActions"
    max-width="600"
  >
    <v-form @submit.prevent="importInvoice">
      <v-select
        v-model="selectedCardId"
        :items="cards"
        item-title="nickname"
        item-value="id"
        :label="t('invoice.import.selectCard')"
        :rules="[(v) => !!v || t('invoice.import.validation.cardRequired')]"
        required
        class="mb-4"
      >
        <template #item="{ props, item }">
          <v-list-item v-bind="props">
            <template #append>
              <span class="text-caption text-medium-emphasis"
                >****{{ item.raw.lastFourDigits }}</span
              >
            </template>
          </v-list-item>
        </template>
      </v-select>

      <v-text-field
        v-model="dueDate"
        type="date"
        :label="t('invoice.import.dueDate')"
        :rules="[(v) => !!v || t('invoice.import.validation.dueDateRequired')]"
        required
        class="mb-4"
      />

      <v-file-input
        :model-value="file ? [file] : []"
        @update:model-value="handleFileChange"
        :label="t('invoice.import.selectFile')"
        accept=".txt,text/plain"
        prepend-icon="mdi-file-document-outline"
        :rules="[(v) => !!v || t('invoice.import.validation.fileRequired')]"
        required
        show-size
        class="mb-4"
      />

      <v-alert type="info" variant="tonal" density="compact" class="mb-4">
        <div class="text-body-2">
          <strong>{{ t("invoice.import.formatInfo.title") }}</strong>
          <div class="mt-1">
            {{ t("invoice.import.formatInfo.description") }}
          </div>
          <div class="mt-2 text-caption font-mono bg-surface pa-2 rounded">
            Data;Descrição;Valor<br />
            11/09/2025;Teresopolis Shopping Center;121,89
          </div>
        </div>
      </v-alert>

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
  </ModalBase>
</template>
