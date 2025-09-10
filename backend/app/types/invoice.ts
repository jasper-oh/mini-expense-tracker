import { DateTime } from 'luxon'

/**
 * Invoice status enum
 */
export enum InvoiceStatus {
  DRAFT = 'DRAFT', // A Draft Invoice ( default)
  SUBMITTED = 'SUBMITTED', // An Awaiting Approval Invoice
  DELETED = 'DELETED', // A Deleted Invoice
  AUTHORISED = 'AUTHORISED', // An Invoice that is Approved and Awaiting Payment OR partially paid
  PAID = 'PAID', // An Invoice that is completely Paid
  VOIDED = 'VOIDED', // A Voided Invoice
}

/**
 * Invoice type enum
 */
export enum InvoiceType {
  ACCREC = 'ACCREC', // Accounts Receivable (money owed to us) - A bill – commonly known as an Accounts Payable or supplier invoice
  ACCPAY = 'ACCPAY', // Accounts Payable (money we owe) - A sales invoice – commonly known as an Accounts Receivable or customer invoice
}

/**
 * Base Invoice interface representing the database model
 */
export interface InvoiceAttributes {
  id: number
  xeroInvoiceId: string
  invoiceNumber: string
  contactName: string
  contactEmail: string | null
  subTotal: number
  taxAmount: number
  totalAmount: number
  currency: string
  status: InvoiceStatus
  invoiceDate: DateTime
  dueDate: DateTime | null
  paidDate: DateTime | null
  description: string | null
  reference: string | null
  type: InvoiceType
  createdAt: DateTime
  updatedAt: DateTime
}

/**
 * Invoice interface for API responses (camelCase)
 */
export interface InvoiceResponse {
  id: number
  xeroInvoiceId: string
  invoiceNumber: string
  contactName: string
  contactEmail: string | null
  subTotal: number
  taxAmount: number
  totalAmount: number
  currency: string
  status: InvoiceStatus
  invoiceDate: string
  dueDate: string | null
  paidDate: string | null
  description: string | null
  reference: string | null
  type: InvoiceType
  createdAt: DateTime
  updatedAt: DateTime
  linkedTransactions?: TransactionInvoiceResponse[]
}

/**
 * Interface for creating a new invoice
 */
export interface CreateInvoiceData {
  xeroInvoiceId: string
  invoiceNumber: string
  contactName: string
  contactEmail?: string
  subTotal: number
  taxAmount?: number
  totalAmount: number
  currency?: string
  status?: InvoiceStatus
  invoiceDate: string
  dueDate?: string
  paidDate?: string
  description?: string
  reference?: string
  type?: InvoiceType
}

/**
 * Interface for updating an invoice
 */
export interface UpdateInvoiceData {
  xeroInvoiceId?: string
  invoiceNumber?: string
  contactName?: string
  contactEmail?: string
  subTotal?: number
  taxAmount?: number
  totalAmount?: number
  currency?: string
  status?: InvoiceStatus
  invoiceDate?: string
  dueDate?: string
  paidDate?: string
  description?: string
  reference?: string
  type?: InvoiceType
}

/**
 * Interface for transaction-invoice relationship
 */
export interface TransactionInvoiceResponse {
  id: number
  transactionId: number
  invoiceId: number
  amount: number | null
  notes: string | null
  createdAt: DateTime
  updatedAt: DateTime
  transaction?: {
    id: number
    amount: number
    description: string
    date: string
    currency: string
  }
}

/**
 * Interface for linking transactions to invoices
 */
export interface LinkTransactionToInvoiceData {
  transactionId: number
  invoiceId: number
  amount?: number
  notes?: string
}

/**
 * Xero Contact structure
 */
export interface XeroContact {
  ContactID?: string
  Name: string
  EmailAddress?: string
  FirstName?: string
  LastName?: string
  CompanyNumber?: string
  BankAccountDetails?: string
  TaxNumber?: string
  AccountsReceivableTaxType?: string
  AccountsPayableTaxType?: string
  Addresses?: XeroAddress[]
  Phones?: XeroPhone[]
  IsSupplier?: boolean
  IsCustomer?: boolean
  DefaultCurrency?: string
  Website?: string
  BrandingTheme?: XeroBrandingTheme
  BatchPayments?: XeroBatchPayment
  Discount?: number
  HasAttachments?: boolean
  HasErrors?: boolean
  ValidationErrors?: XeroValidationError[]
  Warnings?: XeroWarning[]
  StatusAttributeString?: string
}

/**
 * Xero Address structure
 */
export interface XeroAddress {
  AddressType?: string
  AddressLine1?: string
  AddressLine2?: string
  AddressLine3?: string
  AddressLine4?: string
  City?: string
  Region?: string
  PostalCode?: string
  Country?: string
  AttentionTo?: string
}

/**
 * Xero Phone structure
 */
export interface XeroPhone {
  PhoneType?: string
  PhoneNumber?: string
  PhoneAreaCode?: string
  PhoneCountryCode?: string
}

/**
 * Xero Branding Theme structure
 */
export interface XeroBrandingTheme {
  BrandingThemeID?: string
  Name?: string
  LogoUrl?: string
  SortOrder?: number
  CreatedDateUTC?: string
}

/**
 * Xero Batch Payment structure
 */
export interface XeroBatchPayment {
  Account?: XeroAccount
  Details?: string
  BatchPaymentID?: string
  Date?: string
  IsReconciled?: boolean
  Status?: string
  Total?: number
  Type?: string
  Reference?: string
  BankTransactionID?: string
  BatchPaymentType?: string
  StatusAttributeString?: string
  HasAttachments?: boolean
}

/**
 * Xero Account structure
 */
export interface XeroAccount {
  Code?: string
  Name?: string
  AccountID?: string
  Type?: string
  BankAccountNumber?: string
  Status?: string
  Description?: string
  BankAccountType?: string
  CurrencyCode?: string
  TaxType?: string
  EnablePaymentsToAccount?: boolean
  ShowInExpenseClaims?: boolean
  Class?: string
  SystemAccount?: string
  ReportingCode?: string
  ReportingCodeName?: string
  HasAttachments?: boolean
}

/**
 * Xero Validation Error structure
 */
export interface XeroValidationError {
  Message?: string
}

/**
 * Xero Warning structure
 */
export interface XeroWarning {
  Message?: string
}

/**
 * Xero Line Item structure
 */
export interface XeroLineItem {
  LineItemID?: string
  Description?: string
  Quantity?: number
  UnitAmount?: number
  AccountCode?: string
  ItemCode?: string
  TaxType?: string
  TaxAmount?: number
  LineAmount?: number
  DiscountRate?: number
  DiscountAmount?: number
  RepeatingInvoiceID?: string
}

/**
 * Xero Payment structure
 */
export interface XeroPayment {
  PaymentID?: string
  Invoice?: XeroInvoiceResponse
  Account?: XeroAccount
  Date?: string
  Amount?: number
  CurrencyRate?: number
  PaymentType?: string
  Status?: string
  IsReconciled?: boolean
  Reference?: string
  UpdatedDateUTC?: string
  PaymentTypeID?: string
}

/**
 * Xero Credit Note structure
 */
export interface XeroCreditNote {
  CreditNoteID?: string
  CreditNoteNumber?: string
  Type?: string
  Status?: string
  LineAmountTypes?: string
  Date?: string
  DueDate?: string
  Reference?: string
  CurrencyCode?: string
  CurrencyRate?: number
  SubTotal?: number
  TotalTax?: number
  Total?: number
  AmountDue?: number
  AmountPaid?: number
  AmountCredited?: number
  UpdatedDateUTC?: string
  BrandingThemeID?: string
  HasAttachments?: boolean
  HasErrors?: boolean
  ValidationErrors?: XeroValidationError[]
  Warnings?: XeroWarning[]
  StatusAttributeString?: string
}

/**
 * Xero Prepayment structure
 */
export interface XeroPrepayment {
  PrepaymentID?: string
  Type?: string
  Contact?: XeroContact
  Date?: string
  Status?: string
  LineAmountTypes?: string
  SubTotal?: number
  TotalTax?: number
  Total?: number
  CurrencyCode?: string
  CurrencyRate?: number
  Reference?: string
  UpdatedDateUTC?: string
  BrandingThemeID?: string
  HasAttachments?: boolean
  HasErrors?: boolean
  ValidationErrors?: XeroValidationError[]
  Warnings?: XeroWarning[]
  StatusAttributeString?: string
}

/**
 * Xero Overpayment structure
 */
export interface XeroOverpayment {
  OverpaymentID?: string
  Type?: string
  Contact?: XeroContact
  Date?: string
  Status?: string
  LineAmountTypes?: string
  SubTotal?: number
  TotalTax?: number
  Total?: number
  CurrencyCode?: string
  CurrencyRate?: number
  Reference?: string
  UpdatedDateUTC?: string
  BrandingThemeID?: string
  HasAttachments?: boolean
  HasErrors?: boolean
  ValidationErrors?: XeroValidationError[]
  Warnings?: XeroWarning[]
  StatusAttributeString?: string
}

/**
 * Xero CIS Deduction structure
 */
export interface XeroCISDeduction {
  CISDeductionID?: string
  Contact?: XeroContact
  DeductionDate?: string
  Total?: number
  Status?: string
  HasAttachments?: boolean
  HasErrors?: boolean
  ValidationErrors?: XeroValidationError[]
  Warnings?: XeroWarning[]
  StatusAttributeString?: string
}

/**
 * Xero Invoice Address structure
 */
export interface XeroInvoiceAddress {
  AddressType?: string
  AddressLine1?: string
  AddressLine2?: string
  AddressLine3?: string
  AddressLine4?: string
  City?: string
  Region?: string
  PostalCode?: string
  Country?: string
  AttentionTo?: string
}

/**
 * Complete Xero Invoice API response structure
 */
export interface XeroInvoiceResponse {
  Type?: string
  Contact?: XeroContact
  Date?: string
  DueDate?: string
  Status?: string
  LineAmountTypes?: string
  LineItems?: XeroLineItem[]
  SubTotal?: number
  TotalTax?: number
  Total?: number
  TotalDiscount?: number
  UpdatedDateUTC?: string
  CurrencyCode?: string
  CurrencyRate?: number
  InvoiceID?: string
  InvoiceNumber?: string
  Reference?: string
  BrandingThemeID?: string
  Url?: string
  SentToContact?: boolean
  ExpectedPaymentDate?: string
  PlannedPaymentDate?: string
  HasAttachments?: boolean
  RepeatingInvoiceID?: string
  Payments?: XeroPayment[]
  CreditNotes?: XeroCreditNote[]
  Prepayments?: XeroPrepayment[]
  Overpayments?: XeroOverpayment[]
  AmountDue?: number
  AmountPaid?: number
  CISDeduction?: XeroCISDeduction
  FullyPaidOnDate?: string
  AmountCredited?: number
  SalesTaxCalculationTypeCode?: string
  InvoiceAddresses?: XeroInvoiceAddress[]
  HasErrors?: boolean
  ValidationErrors?: XeroValidationError[]
  Warnings?: XeroWarning[]
  StatusAttributeString?: string
}

/**
 * Mock Xero API response structure (simplified for testing)
 */
export interface MockXeroInvoiceResponse {
  InvoiceID: string
  InvoiceNumber: string
  Contact: {
    Name: string
    EmailAddress?: string
  }
  SubTotal: number
  TotalTax: number
  Total: number
  CurrencyCode: string
  Status: string
  Date: string
  DueDate?: string
  PaidDate?: string
  Description?: string
  Reference?: string
  Type: string
}
