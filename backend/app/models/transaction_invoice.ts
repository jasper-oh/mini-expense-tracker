import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.js'
import Invoice from './invoice.js'

export default class TransactionInvoice extends BaseModel {
  static table = 'transaction_invoices'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare transactionId: number

  @column()
  declare invoiceId: number

  @column()
  declare amount: number | null

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Transaction)
  declare transaction: BelongsTo<typeof Transaction>

  @belongsTo(() => Invoice)
  declare invoice: BelongsTo<typeof Invoice>
}
