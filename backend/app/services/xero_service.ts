import {
  MockXeroInvoiceResponse,
  XeroInvoiceResponse,
  InvoiceResponse,
  InvoiceStatus,
  InvoiceType,
} from '#types/invoice'

/**
 * Mock Xero API Service
 * Simulates Xero API responses for development and testing
 */
export class XeroService {
  /**
   * Mock Xero invoices data
   */
  private static mockInvoices: MockXeroInvoiceResponse[] = [
    {
      InvoiceID: 'xero-inv-001',
      InvoiceNumber: 'INV-2024-001',
      Contact: {
        Name: 'Acme Corporation',
        EmailAddress: 'billing@acme.com',
      },
      SubTotal: 1000.0,
      TotalTax: 130.0,
      Total: 1130.0,
      CurrencyCode: 'CAD',
      Status: 'PAID',
      Date: '2024-01-15',
      DueDate: '2024-02-15',
      PaidDate: '2024-01-20',
      Description: 'Web development services for Q1 2024',
      Reference: 'PO-2024-001',
      Type: 'ACCREC',
    },
    {
      InvoiceID: 'xero-inv-002',
      InvoiceNumber: 'INV-2024-002',
      Contact: {
        Name: 'TechStart Inc',
        EmailAddress: 'accounts@techstart.com',
      },
      SubTotal: 2500.0,
      TotalTax: 325.0,
      Total: 2825.0,
      CurrencyCode: 'CAD',
      Status: 'SENT',
      Date: '2024-01-20',
      DueDate: '2024-02-20',
      Description: 'Mobile app development project',
      Reference: 'PO-2024-002',
      Type: 'ACCREC',
    },
    {
      InvoiceID: 'xero-inv-003',
      InvoiceNumber: 'INV-2024-003',
      Contact: {
        Name: 'Office Supplies Co',
        EmailAddress: 'orders@officesupplies.com',
      },
      SubTotal: 150.0,
      TotalTax: 19.5,
      Total: 169.5,
      CurrencyCode: 'CAD',
      Status: 'DRAFT',
      Date: '2024-01-25',
      Description: 'Office supplies and equipment',
      Type: 'ACCPAY',
    },
    {
      InvoiceID: 'xero-inv-004',
      InvoiceNumber: 'INV-2024-004',
      Contact: {
        Name: 'Cloud Services Ltd',
        EmailAddress: 'billing@cloudservices.com',
      },
      SubTotal: 500.0,
      TotalTax: 65.0,
      Total: 565.0,
      CurrencyCode: 'CAD',
      Status: 'PAID',
      Date: '2024-01-10',
      DueDate: '2024-02-10',
      PaidDate: '2024-01-12',
      Description: 'Monthly cloud hosting services',
      Reference: 'CS-2024-001',
      Type: 'ACCPAY',
    },
    {
      InvoiceID: 'xero-inv-005',
      InvoiceNumber: 'INV-2024-005',
      Contact: {
        Name: 'Marketing Agency',
        EmailAddress: 'billing@marketing.com',
      },
      SubTotal: 3000.0,
      TotalTax: 390.0,
      Total: 3390.0,
      CurrencyCode: 'CAD',
      Status: 'VOIDED',
      Date: '2024-01-05',
      Description: 'Digital marketing campaign (cancelled)',
      Reference: 'MA-2024-001',
      Type: 'ACCREC',
    },
  ]

  /**
   * Fetch all invoices from mock Xero API
   */
  static async fetchInvoices(): Promise<MockXeroInvoiceResponse[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    return [...this.mockInvoices]
  }

  /**
   * Fetch a specific invoice by ID from mock Xero API
   */
  static async fetchInvoiceById(invoiceId: string): Promise<MockXeroInvoiceResponse | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50))

    return this.mockInvoices.find((invoice) => invoice.InvoiceID === invoiceId) || null
  }

  /**
   * Convert Xero invoice status to our internal status
   */
  static convertStatus(xeroStatus: string): InvoiceStatus {
    const statusMap: Record<string, InvoiceStatus> = {
      DRAFT: InvoiceStatus.DRAFT,
      SUBMITTED: InvoiceStatus.SUBMITTED,
      AUTHORISED: InvoiceStatus.AUTHORISED,
      PAID: InvoiceStatus.PAID,
      VOIDED: InvoiceStatus.VOIDED,
      DELETED: InvoiceStatus.DELETED,
    }

    return statusMap[xeroStatus] || InvoiceStatus.DRAFT
  }

  /**
   * Convert Xero invoice type to our internal type
   */
  static convertType(xeroType: string): InvoiceType {
    return xeroType === 'ACCPAY' ? InvoiceType.ACCPAY : InvoiceType.ACCREC
  }

  /**
   * Convert mock Xero invoice to our internal format
   */
  static convertToInternalFormat(xeroInvoice: MockXeroInvoiceResponse): Partial<InvoiceResponse> {
    return {
      xeroInvoiceId: xeroInvoice.InvoiceID,
      invoiceNumber: xeroInvoice.InvoiceNumber,
      contactName: xeroInvoice.Contact.Name,
      contactEmail: xeroInvoice.Contact.EmailAddress || null,
      subTotal: xeroInvoice.SubTotal,
      taxAmount: xeroInvoice.TotalTax,
      totalAmount: xeroInvoice.Total,
      currency: xeroInvoice.CurrencyCode,
      status: this.convertStatus(xeroInvoice.Status),
      invoiceDate: xeroInvoice.Date,
      dueDate: xeroInvoice.DueDate || null,
      paidDate: xeroInvoice.PaidDate || null,
      description: xeroInvoice.Description || null,
      reference: xeroInvoice.Reference || null,
      type: this.convertType(xeroInvoice.Type),
    }
  }

  /**
   * Simulate fetching invoices with pagination
   */
  static async fetchInvoicesPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    invoices: MockXeroInvoiceResponse[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedInvoices = this.mockInvoices.slice(startIndex, endIndex)

    return {
      invoices: paginatedInvoices,
      total: this.mockInvoices.length,
      page,
      limit,
      totalPages: Math.ceil(this.mockInvoices.length / limit),
    }
  }

  /**
   * Simulate filtering invoices by status
   */
  static async fetchInvoicesByStatus(status: string): Promise<MockXeroInvoiceResponse[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50))

    return this.mockInvoices.filter((invoice) => this.convertStatus(invoice.Status) === status)
  }

  /**
   * Simulate filtering invoices by type
   */
  static async fetchInvoicesByType(type: string): Promise<MockXeroInvoiceResponse[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50))

    return this.mockInvoices.filter((invoice) => this.convertType(invoice.Type) === type)
  }

  /**
   * Convert full Xero invoice response to our internal format
   */
  static convertFullXeroToInternalFormat(
    xeroInvoice: XeroInvoiceResponse
  ): Partial<InvoiceResponse> {
    return {
      xeroInvoiceId: xeroInvoice.InvoiceID || '',
      invoiceNumber: xeroInvoice.InvoiceNumber || '',
      contactName: xeroInvoice.Contact?.Name || '',
      contactEmail: xeroInvoice.Contact?.EmailAddress || null,
      subTotal: xeroInvoice.SubTotal || 0,
      taxAmount: xeroInvoice.TotalTax || 0,
      totalAmount: xeroInvoice.Total || 0,
      currency: xeroInvoice.CurrencyCode || 'CAD',
      status: this.convertStatus(xeroInvoice.Status || 'DRAFT'),
      invoiceDate: xeroInvoice.Date || new Date().toISOString().split('T')[0],
      dueDate: xeroInvoice.DueDate || null,
      paidDate: xeroInvoice.FullyPaidOnDate || null,
      description: xeroInvoice.LineItems?.[0]?.Description || null,
      reference: xeroInvoice.Reference || null,
      type: this.convertType(xeroInvoice.Type || 'ACCREC'),
    }
  }

  /**
   * Fetch full Xero invoice with all fields (for future real API integration)
   */
  static async fetchFullInvoiceById(invoiceId: string): Promise<XeroInvoiceResponse | null> {
    // This would be replaced with actual Xero API call
    // For now, return null as we don't have full mock data
    console.log(`Fetching full invoice for ID: ${invoiceId}`)
    return null
  }

  /**
   * Fetch all full Xero invoices (for future real API integration)
   */
  static async fetchAllFullInvoices(): Promise<XeroInvoiceResponse[]> {
    // This would be replaced with actual Xero API call
    // For now, return empty array as we don't have full mock data
    return []
  }
}
