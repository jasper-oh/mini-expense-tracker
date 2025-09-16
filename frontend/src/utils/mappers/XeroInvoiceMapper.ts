import type {Invoice, XeroInvoice} from "../../types/Invoice.ts";

function parseXeroDate(dateStr?: string): string | null {
    if (!dateStr) return null;

    // Handles /Date(1518685950940+0000)/ or ISO string
    const match = dateStr.match(/\/Date\((\d+)([+-]\d+)?\)\//);
    if (match) {
        const timestamp = parseInt(match[1], 10);
        return new Date(timestamp).toISOString();
    }

    return new Date(dateStr).toISOString(); // fallback for ISO-like strings
}

export function mapXeroInvoice(xero: XeroInvoice): Invoice {
    return {
        id: 0, // local DB id, or assign later
        xeroInvoiceId: xero.InvoiceID,
        invoiceNumber: xero.InvoiceNumber ?? "",
        contactName: xero.Contact?.Name ?? "",
        contactEmail: xero.Contact?.EmailAddress ?? null,
        subTotal: parseFloat(xero.SubTotal ?? "0"),
        taxAmount: parseFloat(xero.TotalTax ?? "0"),
        totalAmount: parseFloat(xero.Total ?? "0"),
        currency: xero.CurrencyCode ?? "USD",
        status: xero.Status as any, // map to your InvoiceStatus enum
        invoiceDate: parseXeroDate(xero.Date)!,
        dueDate: parseXeroDate(xero.DueDate),
        paidDate: xero.Payments?.length
            ? parseXeroDate(xero.Payments[0].Date)
            : null,
        description: xero.LineItems?.map(li => li.Description).join(", ") ?? null,
        reference: null,
        type: xero.Type as any, // map to your InvoiceType enum
        createdAt: new Date().toISOString(), // depends on your DB
        updatedAt: new Date().toISOString(),
        linkedTransactions: [],
    };
}