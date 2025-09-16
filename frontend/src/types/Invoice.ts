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

// ================== Updated Xero Types ==================

export interface XeroInvoicesResponse {
    DateTimeUTC: string;
    Id: string;
    Invoices: XeroInvoice[];
    ProviderName: string;
    Status: string;
}

export interface XeroInvoice {
    Type: string;
    Contact: XeroContact;
    Date: string;              // comes as "/Date(1518685950940+0000)/"
    DateString?: string;       // sometimes ISO string
    DueDate?: string;
    DueDateString?: string;
    Status: string;
    LineAmountTypes: string;
    LineItems: XeroLineItem[];
    SubTotal: string;          // numeric but returned as string
    TotalTax: string;
    Total: string;
    UpdatedDateUTC: string;
    CurrencyCode: string;
    InvoiceID: string;
    InvoiceNumber?: string;
    Payments?: XeroPayment[];
    AmountDue?: string;
    AmountPaid?: string;
    AmountCredited?: string;
}

export interface XeroContact {
    ContactID: string;
    ContactStatus?: string;
    Name: string;
    EmailAddress?: string;
    FirstName?: string;
    LastName?: string;
    Addresses?: XeroAddress[];
    Phones?: XeroPhone[];
    UpdatedDateUTC?: string;
    IsSupplier?: string | boolean;  // API can send "true"/"false" as string
    IsCustomer?: string | boolean;
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

export interface XeroLineItem {
    LineItemID: string;
    ItemCode?: string;
    Description?: string;
    Quantity?: string;         // numeric but returned as string
    UnitAmount?: string;
    AccountCode?: string;
    AccountId?: string;
    TaxType?: string;
    TaxAmount?: string;
    LineAmount?: string;
    Item?: XeroItem;
    Tracking?: XeroTracking[];
}

export interface XeroItem {
    ItemID: string;
    Name: string;
    Code: string;
}

export interface XeroTracking {
    TrackingCategoryID: string;
    Name: string;
    Option: string;
}

export interface XeroPayment {
    PaymentID: string;
    Date: string;
    Amount: string;
}
