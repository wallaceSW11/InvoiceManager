import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '@/core/domain/entities';
import { InvoiceStatus } from '@/core/domain/enums';
import { LocalStorageInvoiceRepository } from '@/infrastructure/repositories/localstorage';

const invoiceRepository = new LocalStorageInvoiceRepository();

export const useInvoiceStore = defineStore('invoice', () => {
  const invoices = ref<Invoice[]>([]);
  const currentInvoice = ref<Invoice | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const invoiceCount = computed(() => invoices.value.length);
  const openInvoice = computed(() =>
    invoices.value.find((inv) => inv.status === InvoiceStatus.PENDING)
  );

  async function fetchInvoices() {
    loading.value = true;
    error.value = null;
    try {
      invoices.value = await invoiceRepository.findAll();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch invoices';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchInvoiceById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const invoice = await invoiceRepository.findById(id);
      if (invoice) {
        currentInvoice.value = invoice;
      }
      return invoice;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch invoice';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function createInvoice(dto: CreateInvoiceDTO) {
    loading.value = true;
    error.value = null;
    try {
      const invoice = await invoiceRepository.create(dto);
      invoices.value.push(invoice);
      currentInvoice.value = invoice;
      return invoice;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create invoice';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateInvoice(id: string, dto: UpdateInvoiceDTO) {
    loading.value = true;
    error.value = null;
    try {
      const invoice = await invoiceRepository.update(id, dto);
      const index = invoices.value.findIndex((inv) => inv.id === id);
      if (index !== -1) {
        invoices.value[index] = invoice;
      }
      if (currentInvoice.value?.id === id) {
        currentInvoice.value = invoice;
      }
      return invoice;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update invoice';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteInvoice(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await invoiceRepository.delete(id);
      invoices.value = invoices.value.filter((inv) => inv.id !== id);
      if (currentInvoice.value?.id === id) {
        currentInvoice.value = null;
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete invoice';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function setCurrentInvoice(invoice: Invoice | null) {
    currentInvoice.value = invoice;
  }

  async function completeInvoice(id: string) {
    return updateInvoice(id, { status: InvoiceStatus.COMPLETED });
  }

  async function reopenInvoice(id: string) {
    return updateInvoice(id, { status: InvoiceStatus.PENDING });
  }

  function getInvoiceById(id: string): Invoice | undefined {
    return invoices.value.find((inv) => inv.id === id);
  }

  return {
    invoices,
    currentInvoice,
    loading,
    error,
    invoiceCount,
    openInvoice,
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    setCurrentInvoice,
    completeInvoice,
    reopenInvoice,
    getInvoiceById
  };
});
