import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invoices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('xero_invoice_id').unique().notNullable() // Mock Xero invoice ID
      table.string('invoice_number').notNullable() // Invoice number (e.g., INV-001)
      table.string('contact_name').notNullable() // Customer/Supplier name
      table.string('contact_email').nullable() // Contact email
      table.decimal('sub_total', 10, 2).notNullable() // Subtotal before tax
      table.decimal('tax_amount', 10, 2).defaultTo(0) // Tax amount
      table.decimal('total_amount', 10, 2).notNullable() // Total amount
      table.string('currency', 3).notNullable().defaultTo('CAD') // Currency code
      table.string('status').notNullable().defaultTo('DRAFT') // DRAFT, SENT, PAID, VOIDED
      table.date('invoice_date').notNullable() // Invoice date
      table.date('due_date').nullable() // Due date
      table.date('paid_date').nullable() // Date when invoice was paid
      table.text('description').nullable() // Invoice description/notes
      table.string('reference').nullable() // Reference number
      table.string('type').notNullable().defaultTo('ACCREC') // ACCREC (Accounts Receivable) or ACCPAY (Accounts Payable)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
