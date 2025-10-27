import type { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '../../domain/entities'
import type { InvoiceStatus } from '../../domain/enums'
import type { IRepository } from './IRepository'

export interface IInvoiceRepository extends IRepository<Invoice> {
  create(dto: CreateInvoiceDTO): Promise<Invoice>
  update(id: string, dto: UpdateInvoiceDTO): Promise<Invoice>
  findByCardId(cardId: string): Promise<Invoice[]>
  findByStatus(status: InvoiceStatus): Promise<Invoice[]>
  findOpenInvoice(): Promise<Invoice | null>
}
