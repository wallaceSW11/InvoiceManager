import type {
  Invoice,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
  Transaction
} from '@/core/domain/entities';
import type { IInvoiceRepository } from '@/core/repositories/interfaces';
import { InvoiceStatus, SplitMode } from '@/core/domain/enums';
import { BaseLocalStorageRepository } from './BaseLocalStorageRepository';

interface SerializedTransactionSplit {
  participantId: string;
  amount: number;
  mode: SplitMode;
}

interface SerializedTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  splits: SerializedTransactionSplit[];
  createdAt: string;
  updatedAt: string;
}

interface SerializedInvoice {
  id: string;
  cardId: string;
  dueDate: string;
  totalAmount: number;
  status: InvoiceStatus;
  transactions: SerializedTransaction[];
  createdAt: string;
  updatedAt: string;
}

export class LocalStorageInvoiceRepository
  extends BaseLocalStorageRepository<Invoice>
  implements IInvoiceRepository
{
  constructor() {
    super('invoicemanager:invoices');
  }

  protected serialize(invoice: Invoice): SerializedInvoice {
    return {
      id: invoice.id,
      cardId: invoice.cardId,
      dueDate: invoice.dueDate.toISOString(),
      totalAmount: invoice.totalAmount,
      status: invoice.status,
      transactions: invoice.transactions.map((t) => this.serializeTransaction(t)),
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString()
    };
  }

  protected deserialize(data: unknown): Invoice {
    const serialized = data as SerializedInvoice;
    return {
      id: serialized.id,
      cardId: serialized.cardId,
      dueDate: new Date(serialized.dueDate),
      totalAmount: serialized.totalAmount,
      status: serialized.status,
      transactions: serialized.transactions.map((t) => this.deserializeTransaction(t)),
      createdAt: new Date(serialized.createdAt),
      updatedAt: new Date(serialized.updatedAt)
    };
  }

  private serializeTransaction(transaction: Transaction): SerializedTransaction {
    return {
      id: transaction.id,
      date: transaction.date.toISOString(),
      description: transaction.description,
      amount: transaction.amount,
      splits: transaction.splits,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString()
    };
  }

  private deserializeTransaction(data: SerializedTransaction): Transaction {
    return {
      id: data.id,
      date: new Date(data.date),
      description: data.description,
      amount: data.amount,
      splits: data.splits,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  async create(dto: CreateInvoiceDTO): Promise<Invoice> {
    const totalAmount = Number(dto.transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2));
    return super.create({
      ...dto,
      totalAmount,
      status: InvoiceStatus.PENDING
    });
  }

  async update(id: string, dto: UpdateInvoiceDTO): Promise<Invoice> {
    if (dto.transactions) {
      const totalAmount = Number(dto.transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2));
      return super.update(id, { ...dto, totalAmount });
    }
    return super.update(id, dto);
  }

  async findByCardId(cardId: string): Promise<Invoice[]> {
    const invoices = await this.findAll();
    return invoices.filter((invoice) => invoice.cardId === cardId);
  }

  async findByStatus(status: InvoiceStatus): Promise<Invoice[]> {
    const invoices = await this.findAll();
    return invoices.filter((invoice) => invoice.status === status);
  }

  async findOpenInvoice(): Promise<Invoice | null> {
    const invoices = await this.findAll();
    return invoices.find((invoice) => invoice.status === InvoiceStatus.PENDING) || null;
  }
}
