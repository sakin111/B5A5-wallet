

export type TransactionType = 'add' | 'withdraw' | 'send' | 'cash_in' | 'cash_out';
export type TransactionStatus = 'pending' | 'completed' | 'reversed';

export interface ITransaction {
  _id?: string;
  type: TransactionType;
  from?: string;
  to?: string;
  amount: number;
  status: TransactionStatus;
  createdAt?: Date;
}


