import { Types } from "mongoose";

export interface ICommission {
    agent: Types.ObjectId; 
    type: 'cash-in' | 'cash-out'; 
    amount: number; 
    transactionAmount?: number;
    transactionId?: string; 
    createdAt?: Date; 
}


