export const InvoiceStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED'
} as const

export type InvoiceStatus = typeof InvoiceStatus[keyof typeof InvoiceStatus]
