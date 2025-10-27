import type { InvoiceStatus } from '../enums'
import type { Transaction } from './Transaction'

export interface Invoice {
  id: string
  cardId: string
  dueDate: Date
  totalAmount: number
  status: InvoiceStatus
  transactions: Transaction[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateInvoiceDTO {
  cardId: string
  dueDate: Date
  transactions: Transaction[]
}

export interface UpdateInvoiceDTO {
  dueDate?: Date
  status?: InvoiceStatus
  transactions?: Transaction[]
}
