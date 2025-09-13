import { Types } from "mongoose";

export interface ICommission {
    agent: Types.ObjectId; 
    type: 'cash-in' | 'cash-out'; 
    amount: number; 
    transactionAmount?: number;
    transactionId?: string; 
    createdAt?: Date; 
}


export interface ICommissionQuery {
  page?: string;
  limit?: string;
  searchTerm?: string;
  type?: string;
  sort?: string;
}

export interface ICommissionSummary {
  _id: string;
  name: string;
  email: string;
  totalCommissions: number;
  totalCommission: number;
  lastCommissionDate: Date | null;
  createdAt: Date;
}

