import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Category from './category.js'
import Invoice from './invoice.js'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare amount: number

  @column()
  declare converted_cad: number

  @column()
  declare currency: string

  @column.date()
  declare date: DateTime

  @column()
  declare description: string

  @column()
  declare categoryId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @manyToMany(() => Invoice, {
    pivotTable: 'transaction_invoices',
    pivotForeignKey: 'transaction_id',
    pivotRelatedForeignKey: 'invoice_id',
    pivotColumns: ['amount', 'notes', 'created_at', 'updated_at'],
  })
  declare invoices: ManyToMany<typeof Invoice>
}
