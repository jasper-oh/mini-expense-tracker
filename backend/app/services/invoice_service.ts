import Invoice from '#models/invoice'
import Transaction from '#models/transaction'
import TransactionInvoice from '#models/transaction_invoice'
import { XeroService } from './xero_service.js'
import {
  CreateInvoiceData,
  UpdateInvoiceData,
  InvoiceResponse,
  LinkTransactionToInvoiceData,
  TransactionInvoiceResponse,
  InvoiceStatus,
  InvoiceType,
} from '#types/invoice'
import { DateTime } from 'luxon'

/**
 * Invoice Service
 * Handles business logic for invoice operations
 */
export class InvoiceService {
  /**
   * Fetch all invoices from Xero and sync to local database
   */
  static async syncInvoicesFromXero(): Promise<InvoiceResponse[]> {
    try {
      // Fetch invoices from mock Xero API
      const xeroInvoices = await XeroService.fetchInvoices()

      const syncedInvoices: InvoiceResponse[] = []

      for (const xeroInvoice of xeroInvoices) {
        // Check if invoice already exists
        let invoice = await Invoice.findBy('xero_invoice_id', xeroInvoice.InvoiceID)

        if (!invoice) {
          // Create new invoice
          const invoiceData = XeroService.convertToInternalFormat(xeroInvoice)
          invoice = await Invoice.create({
            xeroInvoiceId: invoiceData.xeroInvoiceId!,
            invoiceNumber: invoiceData.invoiceNumber!,
            contactName: invoiceData.contactName!,
            contactEmail: invoiceData.contactEmail,
            subTotal: invoiceData.subTotal!,
            taxAmount: invoiceData.taxAmount!,
            totalAmount: invoiceData.totalAmount!,
            currency: invoiceData.currency!,
            status: invoiceData.status!,
            invoiceDate: DateTime.fromISO(invoiceData.invoiceDate!),
            dueDate: invoiceData.dueDate ? DateTime.fromISO(invoiceData.dueDate) : null,
            paidDate: invoiceData.paidDate ? DateTime.fromISO(invoiceData.paidDate) : null,
            description: invoiceData.description,
            reference: invoiceData.reference,
            type: invoiceData.type!,
          })
        } else {
          // Update existing invoice
          const invoiceData = XeroService.convertToInternalFormat(xeroInvoice)
          invoice.merge({
            invoiceNumber: invoiceData.invoiceNumber!,
            contactName: invoiceData.contactName!,
            contactEmail: invoiceData.contactEmail,
            subTotal: invoiceData.subTotal!,
            taxAmount: invoiceData.taxAmount!,
            totalAmount: invoiceData.totalAmount!,
            currency: invoiceData.currency!,
            status: invoiceData.status!,
            invoiceDate: DateTime.fromISO(invoiceData.invoiceDate!),
            dueDate: invoiceData.dueDate ? DateTime.fromISO(invoiceData.dueDate) : null,
            paidDate: invoiceData.paidDate ? DateTime.fromISO(invoiceData.paidDate) : null,
            description: invoiceData.description,
            reference: invoiceData.reference,
            type: invoiceData.type!,
          })
          await invoice.save()
        }

        syncedInvoices.push(await this.formatInvoiceResponse(invoice))
      }

      return syncedInvoices
    } catch (error) {
      throw new Error(`Failed to sync invoices from Xero: ${error.message}`)
    }
  }

  /**
   * Get all invoices from local database
   */
  static async getAllInvoices(): Promise<InvoiceResponse[]> {
    const invoices = await Invoice.query().orderBy('created_at', 'desc')
    return Promise.all(invoices.map((invoice) => this.formatInvoiceResponse(invoice)))
  }

  /**
   * Get invoice by ID
   */
  static async getInvoiceById(id: number): Promise<InvoiceResponse | null> {
    const invoice = await Invoice.find(id)
    if (!invoice) return null

    return this.formatInvoiceResponse(invoice)
  }

  /**
   * Get invoice by Xero invoice ID
   */
  static async getInvoiceByXeroId(xeroInvoiceId: string): Promise<InvoiceResponse | null> {
    const invoice = await Invoice.findBy('xero_invoice_id', xeroInvoiceId)
    if (!invoice) return null

    return this.formatInvoiceResponse(invoice)
  }

  /**
   * Create a new invoice
   */
  static async createInvoice(data: CreateInvoiceData): Promise<InvoiceResponse> {
    const invoice = await Invoice.create({
      xeroInvoiceId: data.xeroInvoiceId,
      invoiceNumber: data.invoiceNumber,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      subTotal: data.subTotal,
      taxAmount: data.taxAmount || 0,
      totalAmount: data.totalAmount,
      currency: data.currency || 'CAD',
      status: data.status || InvoiceStatus.DRAFT,
      invoiceDate: DateTime.fromISO(data.invoiceDate),
      dueDate: data.dueDate ? DateTime.fromISO(data.dueDate) : null,
      paidDate: data.paidDate ? DateTime.fromISO(data.paidDate) : null,
      description: data.description,
      reference: data.reference,
      type: data.type || InvoiceType.ACCREC,
    })

    return this.formatInvoiceResponse(invoice)
  }

  /**
   * Update an invoice
   */
  static async updateInvoice(id: number, data: UpdateInvoiceData): Promise<InvoiceResponse | null> {
    const invoice = await Invoice.find(id)
    if (!invoice) return null

    const updateData: any = {}

    if (data.xeroInvoiceId) updateData.xeroInvoiceId = data.xeroInvoiceId
    if (data.invoiceNumber) updateData.invoiceNumber = data.invoiceNumber
    if (data.contactName) updateData.contactName = data.contactName
    if (data.contactEmail !== undefined) updateData.contactEmail = data.contactEmail
    if (data.subTotal) updateData.subTotal = data.subTotal
    if (data.taxAmount !== undefined) updateData.taxAmount = data.taxAmount
    if (data.totalAmount) updateData.totalAmount = data.totalAmount
    if (data.currency) updateData.currency = data.currency
    if (data.status) updateData.status = data.status
    if (data.invoiceDate) updateData.invoiceDate = DateTime.fromISO(data.invoiceDate)
    if (data.dueDate !== undefined)
      updateData.dueDate = data.dueDate ? DateTime.fromISO(data.dueDate) : null
    if (data.paidDate !== undefined)
      updateData.paidDate = data.paidDate ? DateTime.fromISO(data.paidDate) : null
    if (data.description !== undefined) updateData.description = data.description
    if (data.reference !== undefined) updateData.reference = data.reference
    if (data.type) updateData.type = data.type

    invoice.merge(updateData)
    await invoice.save()

    return this.formatInvoiceResponse(invoice)
  }

  /**
   * Delete an invoice
   */
  static async deleteInvoice(id: number): Promise<boolean> {
    const invoice = await Invoice.find(id)
    if (!invoice) return false

    await invoice.delete()
    return true
  }

  /**
   * Link a transaction to an invoice
   */
  static async linkTransactionToInvoice(
    data: LinkTransactionToInvoiceData
  ): Promise<TransactionInvoiceResponse | null> {
    // Check if both transaction and invoice exist
    const transaction = await Transaction.find(data.transactionId)
    const invoice = await Invoice.find(data.invoiceId)

    if (!transaction || !invoice) {
      throw new Error('Transaction or invoice not found')
    }

    // Check if link already exists
    const existingLink = await TransactionInvoice.query()
      .where('transaction_id', data.transactionId)
      .where('invoice_id', data.invoiceId)
      .first()

    if (existingLink) {
      throw new Error('Transaction is already linked to this invoice')
    }

    // Create the link
    const link = await TransactionInvoice.create({
      transactionId: data.transactionId,
      invoiceId: data.invoiceId,
      amount: data.amount || null,
      notes: data.notes || null,
    })

    // Load relationships
    await link.load('transaction')
    await link.load('invoice')

    return {
      id: link.id,
      transactionId: link.transactionId,
      invoiceId: link.invoiceId,
      amount: link.amount,
      notes: link.notes,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
      transaction: {
        id: link.transaction.id,
        amount: link.transaction.amount,
        description: link.transaction.description,
        date: link.transaction.date.toISODate()!,
        currency: link.transaction.currency,
      },
    }
  }

  /**
   * Unlink a transaction from an invoice
   */
  static async unlinkTransactionFromInvoice(
    transactionId: number,
    invoiceId: number
  ): Promise<boolean> {
    const link = await TransactionInvoice.query()
      .where('transaction_id', transactionId)
      .where('invoice_id', invoiceId)
      .first()

    if (!link) return false

    await link.delete()
    return true
  }

  /**
   * Get transactions linked to an invoice
   */
  static async getInvoiceTransactions(invoiceId: number): Promise<TransactionInvoiceResponse[]> {
    const links = await TransactionInvoice.query()
      .where('invoice_id', invoiceId)
      .preload('transaction')
      .preload('invoice')

    return links.map((link) => ({
      id: link.id,
      transactionId: link.transactionId,
      invoiceId: link.invoiceId,
      amount: link.amount,
      notes: link.notes,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
      transaction: {
        id: link.transaction.id,
        amount: link.transaction.amount,
        description: link.transaction.description,
        date: link.transaction.date.toISODate()!,
        currency: link.transaction.currency,
      },
    }))
  }

  /**
   * Get invoices linked to a transaction
   */
  static async getTransactionInvoices(transactionId: number): Promise<InvoiceResponse[]> {
    const links = await TransactionInvoice.query()
      .where('transaction_id', transactionId)
      .preload('invoice')

    return Promise.all(links.map((link) => this.formatInvoiceResponse(link.invoice)))
  }

  /**
   * Format invoice for API response
   */
  private static async formatInvoiceResponse(invoice: Invoice): Promise<InvoiceResponse> {
    // Get linked transactions using the junction table directly
    const transactionLinks = await TransactionInvoice.query()
      .where('invoice_id', invoice.id)
      .preload('transaction')

    const linkedTransactions = transactionLinks.map((link) => ({
      id: link.id,
      transactionId: link.transactionId,
      invoiceId: link.invoiceId,
      amount: link.amount,
      notes: link.notes,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
      transaction: {
        id: link.transaction.id,
        amount: link.transaction.amount,
        description: link.transaction.description,
        date: link.transaction.date.toISODate()!,
        currency: link.transaction.currency,
      },
    }))

    // Use the model's built-in serialization to ensure serialize functions are called
    const serializedInvoice = invoice.serialize() as any

    return {
      ...serializedInvoice,
      invoiceDate: invoice.invoiceDate.toISODate()!,
      dueDate: invoice.dueDate?.toISODate() || null,
      paidDate: invoice.paidDate?.toISODate() || null,
      linkedTransactions,
    } as InvoiceResponse
  }
}
