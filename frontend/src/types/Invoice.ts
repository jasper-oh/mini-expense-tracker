export const InvoiceStatus = {
    DRAFT: 'DRAFT',
    SENT: 'SENT',
    PAID: 'PAID',
    VOIDED: 'VOIDED',
} as const;
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export type InvoiceType = 'ACCREC' | 'ACCPAY';

export interface Invoice {
    id: number;
    xeroInvoiceId: string;
    invoiceNumber: string;
    contactName: string;
    contactEmail: string | null;
    subTotal: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;
    status: InvoiceStatus;
    invoiceDate: string;
    dueDate: string | null;
    paidDate: string | null;
    description: string | null;
    reference: string | null;
    type: InvoiceType;
    createdAt: string;
    updatedAt: string;
    linkedTransactions?: TransactionInvoiceLink[];
}

export interface CreateInvoiceData {
    xeroInvoiceId: string;
    invoiceNumber: string;
    contactName: string;
    contactEmail?: string;
    subTotal: number;
    taxAmount?: number;
    totalAmount: number;
    currency?: string;
    status?: InvoiceStatus;
    invoiceDate: string;
    dueDate?: string;
    paidDate?: string;
    description?: string;
    reference?: string;
    type?: InvoiceType;
}

export interface UpdateInvoiceData {
    xeroInvoiceId?: string;
    invoiceNumber?: string;
    contactName?: string;
    contactEmail?: string;
    subTotal?: number;
    taxAmount?: number;
    totalAmount?: number;
    currency?: string;
    status?: InvoiceStatus;
    invoiceDate?: string;
    dueDate?: string;
    paidDate?: string;
    description?: string;
    reference?: string;
    type?: InvoiceType;
}

export interface TransactionInvoiceLink {
    id: number;
    transactionId: number;
    invoiceId: number;
    amount: number | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    transaction?: {
        id: number;
        amount: number;
        description: string;
        date: string;
        currency: string;
    };
}

export interface LinkTransactionToInvoiceData {
    transactionId: number;
    invoiceId: number;
    amount?: number;
    notes?: string;
}

// Xero API Types
export interface XeroContact {
    ContactID?: string;
    Name: string;
    EmailAddress?: string;
    FirstName?: string;
    LastName?: string;
    CompanyNumber?: string;
    BankAccountDetails?: string;
    TaxNumber?: string;
    AccountsReceivableTaxType?: string;
    AccountsPayableTaxType?: string;
    Addresses?: XeroAddress[];
    Phones?: XeroPhone[];
    IsSupplier?: boolean;
    IsCustomer?: boolean;
    DefaultCurrency?: string;
    Website?: string;
    BrandingTheme?: XeroBrandingTheme;
    BatchPayments?: XeroBatchPayment;
    Discount?: number;
    HasAttachments?: boolean;
    HasErrors?: boolean;
    ValidationErrors?: XeroValidationError[];
    Warnings?: XeroWarning[];
    StatusAttributeString?: string;
}

export interface XeroAddress {
    AddressType?: string;
    AddressLine1?: string;
    AddressLine2?: string;
    AddressLine3?: string;
    AddressLine4?: string;
    City?: string;
    Region?: string;
    PostalCode?: string;
    Country?: string;
    AttentionTo?: string;
}

export interface XeroPhone {
    PhoneType?: string;
    PhoneNumber?: string;
    PhoneAreaCode?: string;
    PhoneCountryCode?: string;
}

export interface XeroBrandingTheme {
    BrandingThemeID?: string;
    Name?: string;
    LogoUrl?: string;
    SortOrder?: number;
    CreatedDateUTC?: string;
}

export interface XeroBatchPayment {
    Account?: XeroAccount;
    Details?: string;
    BatchPaymentID?: string;
    Date?: string;
    IsReconciled?: boolean;
    Status?: string;
    Total?: number;
    Type?: string;
    Reference?: string;
    BankTransactionID?: string;
    BatchPaymentType?: string;
    StatusAttributeString?: string;
    HasAttachments?: boolean;
}

export interface XeroAccount {
    Code?: string;
    Name?: string;
    AccountID?: string;
    Type?: string;
    BankAccountNumber?: string;
    Status?: string;
    Description?: string;
    BankAccountType?: string;
    CurrencyCode?: string;
    TaxType?: string;
    EnablePaymentsToAccount?: boolean;
    ShowInExpenseClaims?: boolean;
    Class?: string;
    SystemAccount?: string;
    ReportingCode?: string;
    ReportingCodeName?: string;
    HasAttachments?: boolean;
}

export interface XeroValidationError {
    Message?: string;
}

export interface XeroWarning {
    Message?: string;
}

export interface XeroLineItem {
    LineItemID?: string;
    Description?: string;
    Quantity?: number;
    UnitAmount?: number;
    AccountCode?: string;
    ItemCode?: string;
    TaxType?: string;
    TaxAmount?: number;
    LineAmount?: number;
    DiscountRate?: number;
    DiscountAmount?: number;
    RepeatingInvoiceID?: string;
}

export interface XeroPayment {
    PaymentID?: string;
    Invoice?: XeroInvoiceResponse;
    Account?: XeroAccount;
    Date?: string;
    Amount?: number;
    CurrencyRate?: number;
    PaymentType?: string;
    Status?: string;
    IsReconciled?: boolean;
    Reference?: string;
    UpdatedDateUTC?: string;
    PaymentTypeID?: string;
}

export interface XeroCreditNote {
    CreditNoteID?: string;
    CreditNoteNumber?: string;
    Type?: string;
    Status?: string;
    LineAmountTypes?: string;
    Date?: string;
    DueDate?: string;
    Reference?: string;
    CurrencyCode?: string;
    CurrencyRate?: number;
    SubTotal?: number;
    TotalTax?: number;
    Total?: number;
    AmountDue?: number;
    AmountPaid?: number;
    AmountCredited?: number;
    UpdatedDateUTC?: string;
    BrandingThemeID?: string;
    HasAttachments?: boolean;
    HasErrors?: boolean;
    ValidationErrors?: XeroValidationError[];
    Warnings?: XeroWarning[];
    StatusAttributeString?: string;
}

export interface XeroPrepayment {
    PrepaymentID?: string;
    Type?: string;
    Contact?: XeroContact;
    Date?: string;
    Status?: string;
    LineAmountTypes?: string;
    SubTotal?: number;
    TotalTax?: number;
    Total?: number;
    CurrencyCode?: string;
    CurrencyRate?: number;
    Reference?: string;
    UpdatedDateUTC?: string;
    BrandingThemeID?: string;
    HasAttachments?: boolean;
    HasErrors?: boolean;
    ValidationErrors?: XeroValidationError[];
    Warnings?: XeroWarning[];
    StatusAttributeString?: string;
}

export interface XeroOverpayment {
    OverpaymentID?: string;
    Type?: string;
    Contact?: XeroContact;
    Date?: string;
    Status?: string;
    LineAmountTypes?: string;
    SubTotal?: number;
    TotalTax?: number;
    Total?: number;
    CurrencyCode?: string;
    CurrencyRate?: number;
    Reference?: string;
    UpdatedDateUTC?: string;
    BrandingThemeID?: string;
    HasAttachments?: boolean;
    HasErrors?: boolean;
    ValidationErrors?: XeroValidationError[];
    Warnings?: XeroWarning[];
    StatusAttributeString?: string;
}

export interface XeroCISDeduction {
    CISDeductionID?: string;
    Contact?: XeroContact;
    DeductionDate?: string;
    Total?: number;
    Status?: string;
    HasAttachments?: boolean;
    HasErrors?: boolean;
    ValidationErrors?: XeroValidationError[];
    Warnings?: XeroWarning[];
    StatusAttributeString?: string;
}

export interface XeroInvoiceAddress {
    AddressType?: string;
    AddressLine1?: string;
    AddressLine2?: string;
    AddressLine3?: string;
    AddressLine4?: string;
    City?: string;
    Region?: string;
    PostalCode?: string;
    Country?: string;
    AttentionTo?: string;
}

export interface XeroInvoiceResponse {
    Type?: string;
    Contact?: XeroContact;
    Date?: string;
    DueDate?: string;
    Status?: string;
    LineAmountTypes?: string;
    LineItems?: XeroLineItem[];
    SubTotal?: number;
    TotalTax?: number;
    Total?: number;
    TotalDiscount?: number;
    UpdatedDateUTC?: string;
    CurrencyCode?: string;
    CurrencyRate?: number;
    InvoiceID?: string;
    InvoiceNumber?: string;
    Reference?: string;
    BrandingThemeID?: string;
    Url?: string;
    SentToContact?: boolean;
    ExpectedPaymentDate?: string;
    PlannedPaymentDate?: string;
    HasAttachments?: boolean;
    RepeatingInvoiceID?: string;
    Payments?: XeroPayment[];
    CreditNotes?: XeroCreditNote[];
    Prepayments?: XeroPrepayment[];
    Overpayments?: XeroOverpayment[];
    AmountDue?: number;
    AmountPaid?: number;
    CISDeduction?: XeroCISDeduction;
    FullyPaidOnDate?: string;
    AmountCredited?: number;
    SalesTaxCalculationTypeCode?: string;
    InvoiceAddresses?: XeroInvoiceAddress[];
    HasErrors?: boolean;
    ValidationErrors?: XeroValidationError[];
    Warnings?: XeroWarning[];
    StatusAttributeString?: string;
}
