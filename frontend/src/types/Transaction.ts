export interface Transaction {
    id: number;
    amount: number;
    currency: string;
    date: string;
    description: string;
    categoryId: number;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
}
