import swaggerJsDoc from 'swagger-jsdoc'
import router from '@adonisjs/core/services/router'

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Mini Expense Tracker API', version: '1.0.0' },
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        InvoiceResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            xeroInvoiceId: { type: 'string' },
            invoiceNumber: { type: 'string' },
            contactName: { type: 'string' },
            contactEmail: { type: 'string', nullable: true },
            subTotal: { type: 'number', format: 'decimal' },
            taxAmount: { type: 'number', format: 'decimal' },
            totalAmount: { type: 'number', format: 'decimal' },
            currency: { type: 'string' },
            status: { type: 'string', enum: ['DRAFT', 'SENT', 'PAID', 'VOIDED'] },
            invoiceDate: { type: 'string', format: 'date' },
            dueDate: { type: 'string', format: 'date', nullable: true },
            paidDate: { type: 'string', format: 'date', nullable: true },
            description: { type: 'string', nullable: true },
            reference: { type: 'string', nullable: true },
            type: { type: 'string', enum: ['ACCREC', 'ACCPAY'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            linkedTransactions: {
              type: 'array',
              items: { $ref: '#/components/schemas/TransactionInvoiceResponse' },
            },
          },
        },
        CreateInvoiceData: {
          type: 'object',
          required: [
            'xeroInvoiceId',
            'invoiceNumber',
            'contactName',
            'subTotal',
            'totalAmount',
            'invoiceDate',
          ],
          properties: {
            xeroInvoiceId: { type: 'string' },
            invoiceNumber: { type: 'string' },
            contactName: { type: 'string' },
            contactEmail: { type: 'string' },
            subTotal: { type: 'number', format: 'decimal' },
            taxAmount: { type: 'number', format: 'decimal' },
            totalAmount: { type: 'number', format: 'decimal' },
            currency: { type: 'string', default: 'CAD' },
            status: { type: 'string', enum: ['DRAFT', 'SENT', 'PAID', 'VOIDED'], default: 'DRAFT' },
            invoiceDate: { type: 'string', format: 'date' },
            dueDate: { type: 'string', format: 'date' },
            paidDate: { type: 'string', format: 'date' },
            description: { type: 'string' },
            reference: { type: 'string' },
            type: { type: 'string', enum: ['ACCREC', 'ACCPAY'], default: 'ACCREC' },
          },
        },
        UpdateInvoiceData: {
          type: 'object',
          properties: {
            xeroInvoiceId: { type: 'string' },
            invoiceNumber: { type: 'string' },
            contactName: { type: 'string' },
            contactEmail: { type: 'string' },
            subTotal: { type: 'number', format: 'decimal' },
            taxAmount: { type: 'number', format: 'decimal' },
            totalAmount: { type: 'number', format: 'decimal' },
            currency: { type: 'string' },
            status: { type: 'string', enum: ['DRAFT', 'SENT', 'PAID', 'VOIDED'] },
            invoiceDate: { type: 'string', format: 'date' },
            dueDate: { type: 'string', format: 'date' },
            paidDate: { type: 'string', format: 'date' },
            description: { type: 'string' },
            reference: { type: 'string' },
            type: { type: 'string', enum: ['ACCREC', 'ACCPAY'] },
          },
        },
        LinkTransactionToInvoiceData: {
          type: 'object',
          required: ['transactionId', 'invoiceId'],
          properties: {
            transactionId: { type: 'integer' },
            invoiceId: { type: 'integer' },
            amount: { type: 'number', format: 'decimal' },
            notes: { type: 'string' },
          },
        },
        TransactionInvoiceResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            transactionId: { type: 'integer' },
            invoiceId: { type: 'integer' },
            amount: { type: 'number', format: 'decimal', nullable: true },
            notes: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            transaction: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                amount: { type: 'number', format: 'decimal' },
                description: { type: 'string' },
                date: { type: 'string', format: 'date' },
                currency: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['start/routes.ts'],
}

const swaggerSpec = swaggerJsDoc(options)

router.get('/swagger.json', async ({ response }) => response.send(swaggerSpec))

router.get('/swagger', async ({ response }) => {
  return response.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Swagger UI</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css">
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({ url: '/swagger.json', dom_id: '#swagger-ui' })
      </script>
    </body>
  </html>
  `)
})
