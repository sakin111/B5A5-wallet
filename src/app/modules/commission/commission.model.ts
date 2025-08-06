



import { Schema, model } from 'mongoose';

const commissionSchema = new Schema(
  {
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['cash-in', 'cash-out'], required: true },
    amount: { type: Number, required: true },
    transactionAmount: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Commission = model('Commission', commissionSchema);
