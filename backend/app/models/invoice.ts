import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.js'
import { InvoiceStatus, InvoiceType } from '#types/invoice'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare xeroInvoiceId: string

  @column()
  declare invoiceNumber: string

  @column()
  declare contactName: string

  @column()
  declare contactEmail: string | null

  @column({
    serialize: (value: any) => Number(value),
    prepare: (value: any) => value,
  })
  declare subTotal: number

  @column({
    serialize: (value: any) => Number(value),
    prepare: (value: any) => value,
  })
  declare taxAmount: number

  @column({
    serialize: (value: any) => Number(value),
    prepare: (value: any) => value,
  })
  declare totalAmount: number

  @column()
  declare currency: string

  @column()
  declare status: InvoiceStatus

  @column.date()
  declare invoiceDate: DateTime

  @column.date()
  declare dueDate: DateTime | null

  @column.date()
  declare paidDate: DateTime | null

  @column()
  declare description: string | null

  @column()
  declare reference: string | null

  @column()
  declare type: InvoiceType

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Transaction, {
    pivotTable: 'transaction_invoices',
    pivotForeignKey: 'invoice_id',
    pivotRelatedForeignKey: 'transaction_id',
    pivotColumns: ['amount', 'notes', 'created_at', 'updated_at'],
  })
  declare transactions: ManyToMany<typeof Transaction>
}
