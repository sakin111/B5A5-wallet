import { IStatus, Role } from "../user/user.interface"



export interface ITransactionQuery {
  searchTerm?: string;
  type?: string;
  sort?: string;
  page?: string;
  limit?: string;
}


export interface IUserTransactionSummary {
  _id: string;
  name: string;
  email: string;
  status: IStatus;
  role: Role;
  transactionsByType: Record<string, number>;
  totalTransactions: number;
  totalVolume: number;
  lastTransactionType: string;
  createdAt: Date;
}