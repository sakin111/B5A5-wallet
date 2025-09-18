import { Schema, model } from 'mongoose';
import { ITransaction } from './transaction.interface';

const transactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, enum: ['ADD_MONEY', 'WITHDRAW', 'SEND', 'CASH_IN', 'CASH_OUT'], required: true },
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'reversed'], default: 'completed' },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
