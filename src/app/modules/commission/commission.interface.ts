
export interface ICommission {
    agent: string; 
    type: 'cash-in' | 'cash-out'; 
    amount: number; 
    transactionAmount?: number;
    transactionId?: string; 
    createdAt?: Date; 
}


