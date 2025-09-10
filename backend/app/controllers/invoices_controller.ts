import type { HttpContext } from '@adonisjs/core/http'
import { InvoiceService } from '#services/invoice_service'
import { CreateInvoiceData, UpdateInvoiceData, LinkTransactionToInvoiceData } from '#types/invoice'
import { inject } from '@adonisjs/core'

@inject()
export default class InvoicesController {
  /**
   * @swagger
   * /api/invoices/sync:
   *   post:
   *     summary: Sync invoices from Xero API
   *     tags:
   *       - Invoices
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Invoices synced successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/InvoiceResponse'
   *       401:
   *         description: Unauthorized - Missing or invalid token
   *       500:
   *         description: Internal server error
   */
  async syncFromXero({ response }: HttpContext) {
    try {
      const invoices = await InvoiceService.syncInvoicesFromXero()

      return response.ok({
        success: true,
        message: `Successfully synced ${invoices.length} invoices from Xero`,
        data: invoices,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to sync invoices from Xero',
        error: error.message,
      })
    }
  }

  /**
   * @swagger
   * /api/invoices:
   *   get:
   *     summary: Get all invoices
   *     tags:
   *       - Invoices
   *     responses:
   *       200:
   *         description: List of invoices
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/InvoiceResponse'
   *       500:
   *         description: Internal server error
   */
  async index({ response }: HttpContext) {
    try {
      const invoices = await InvoiceService.getAllInvoices()

      return response.ok({
        success: true,
        data: invoices,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch invoices',
        error: error.message,
      })
    }
  }

  /**
   * @swagger
   * /api/invoices/{id}:
   *   get:
   *     summary: Get invoice by ID
   *     tags:
   *       - Invoices
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Invoice ID
   *     responses:
   *       200:
   *         description: Invoice details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/InvoiceResponse'
   *       404:
   *         description: Invoice not found
   *       500:
   *         description: Internal server error
   */
  async show({ params, response }: HttpContext) {
    try {
      const invoice = await InvoiceService.getInvoiceById(params.id)

      if (!invoice) {
        return response.notFound({
          success: false,
          message: 'Invoice not found',
        })
      }

      return response.ok({
        success: true,
        data: invoice,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch invoice',
        error: error.message,
      })
    }
  }

  /**
   * @swagger
   * /api/invoices:
   *   post:
   *     summary: Create a new invoice
   *     tags:
   *       - Invoices
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateInvoiceData'
   *     responses:
   *       201:
   *         description: Invoice created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/InvoiceResponse'
   *       400:
   *         description: Bad request - Invalid data
   *       401:
   *         description: Unauthorized - Missing or invalid token
   *       500:
   *         description: Internal server error
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'xeroInvoiceId',
        'invoiceNumber',
        'contactName',
        'contactEmail',
        'subTotal',
        'taxAmount',
        'totalAmount',
        'currency',
        'status',
        'invoiceDate',
        'dueDate',
        'paidDate',
        'description',
        'reference',
        'type',
      ]) as CreateInvoiceData

      const invoice = await InvoiceService.createInvoice(data)

      return response.created({
        success: true,
        message: 'Invoice created successfully',
        data: invoice,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to create invoice',
        error: error.message,
      })
    }
  }

  /**
   * @swagger
   * /api/invoices/{id}:
   *   put:
   *     summary: Update an invoice
   *     tags:
   *       - Invoices
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Invoice ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateInvoiceData'
   *     responses:
   *       200:
   *         description: Invoice updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/InvoiceResponse'
   *       404:
   *         description: Invoice not found
   *       401:
   *         description: Unauthorized - Missing or invalid token
   *       500:
   *         description: Internal server error
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only([
        'xeroInvoiceId',
        'invoiceNumber',
        'contactName',
        'contactEmail',
        'subTotal',
        'taxAmount',
        'totalAmount',
        'currency',
        'status',
        'invoiceDate',
        'dueDate',
        'paidDate',
        'description',
        'reference',
        'type',
      ]) as UpdateInvoiceData

      const invoice = await InvoiceService.updateInvoice(params.id, data)

      if (!invoice) {
        return response.notFound({
          success: false,
          message: 'Invoice not found',
        })
      }

      return response.ok({
        success: true,
        message: 'Invoice updated successfully',
        data: invoice,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to update invoice',
        error: error.message,
      })
    }
  }

  /**
   * @swagger
   * /api/invoices/{id}:
   *   delete:
   *     summary: Delete an invoice
   *     tags:
   *       - Invoices
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Invoice ID
   *     responses:
   *       200:
   *         description: Invoice deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       404:
   *         description: Invoice not found
   *       401:
   *         description: Unauthorized - Missing or invalid token
   *       500:
   *         description: Internal server error
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await InvoiceService.deleteInvoice(params.id)

      if (!deleted) {
        return response.notFound({
          success: false,
          message: 'Invoice not found',
        })
      }

      return response.ok({
        success: true,
        message: 'Invoice deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete invoice',
        error: error.message,
      })
    }
  }

  /**
   * @swagger
   * /api/invoices/{id}/transactions:
   *   get:
   *     summary: Get transactions linked to an invoice
   *     tags:
   *       - Invoices
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Invoice ID
   *     responses:
   *       200:
   *         description: List of linked transactions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/TransactionInvoiceResponse'
   *       404:
   *         description: Invoice not found
   *       500:
   *         description: Internal server error
   */
  async getTransactions({ params, response }: HttpContext) {
    try {
      const transactions = await InvoiceService.getInvoiceTransactions(params.id)

      return response.ok({
        success: true,
        data: transactions,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch invoice transactions',
        error: error.message,
      })
    }
  }

  /**
   * @swagger
   * /api/invoices/link-transaction:
   *   post:
   *     summary: Link a transaction to an invoice
   *     tags:
   *       - Invoices
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LinkTransactionToInvoiceData'
   *     responses:
   *       201:
   *         description: Transaction linked to invoice successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/TransactionInvoiceResponse'
   *       400:
   *         description: Bad request - Invalid data or already linked
   *       401:
   *         description: Unauthorized - Missing or invalid token
   *       500:
   *         description: Internal server error
   */
  async linkTransaction({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'transactionId',
        'invoiceId',
        'amount',
        'notes',
      ]) as LinkTransactionToInvoiceData

      const link = await InvoiceService.linkTransactionToInvoice(data)

      return response.created({
        success: true,
        message: 'Transaction linked to invoice successfully',
        data: link,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Failed to link transaction to invoice',
        error: error.message,
      })
    }
  }

  /**
   * @swagger
   * /api/invoices/unlink-transaction:
   *   delete:
   *     summary: Unlink a transaction from an invoice
   *     tags:
   *       - Invoices
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               transactionId:
   *                 type: integer
   *               invoiceId:
   *                 type: integer
   *             required:
   *               - transactionId
   *               - invoiceId
   *     responses:
   *       200:
   *         description: Transaction unlinked from invoice successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       400:
   *         description: Bad request - Invalid data
   *       401:
   *         description: Unauthorized - Missing or invalid token
   *       500:
   *         description: Internal server error
   */
  async unlinkTransaction({ request, response }: HttpContext) {
    try {
      const { transactionId, invoiceId } = request.only(['transactionId', 'invoiceId'])

      if (!transactionId || !invoiceId) {
        return response.badRequest({
          success: false,
          message: 'Transaction ID and Invoice ID are required',
        })
      }

      const unlinked = await InvoiceService.unlinkTransactionFromInvoice(transactionId, invoiceId)

      if (!unlinked) {
        return response.notFound({
          success: false,
          message: 'Transaction-invoice link not found',
        })
      }

      return response.ok({
        success: true,
        message: 'Transaction unlinked from invoice successfully',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to unlink transaction from invoice',
        error: error.message,
      })
    }
  }

  /**
   * @swagger
   * /api/transactions/{id}/invoices:
   *   get:
   *     summary: Get invoices linked to a transaction
   *     tags:
   *       - Invoices
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the transaction
   *     responses:
   *       200:
   *         description: List of linked invoices
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean }
   *                 data:
   *                   type: array
   *                   items: { $ref: '#/components/schemas/InvoiceResponse' }
   */
  async getTransactionInvoices({ params, response }: HttpContext) {
    try {
      const invoices = await InvoiceService.getTransactionInvoices(params.id)

      return response.ok({
        success: true,
        data: invoices,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to fetch transaction invoices',
        error: error.message,
      })
    }
  }
}
