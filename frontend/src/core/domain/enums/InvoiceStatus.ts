export const InvoiceStatus = {
  DRAFT: 'DRAFT',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
} as const

export type InvoiceStatus = typeof InvoiceStatus[keyof typeof InvoiceStatus]
