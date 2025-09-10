import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_invoices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('transaction_id')
        .notNullable()
        .references('id')
        .inTable('transactions')
        .onDelete('CASCADE')
      table
        .integer('invoice_id')
        .notNullable()
        .references('id')
        .inTable('invoices')
        .onDelete('CASCADE')
      table.decimal('amount', 10, 2).nullable() // Amount linked from this transaction to this invoice
      table.text('notes').nullable() // Additional notes about the relationship
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Ensure unique combination of transaction and invoice
      table.unique(['transaction_id', 'invoice_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
