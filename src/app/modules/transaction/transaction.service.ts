import AppError from "../../errorBuilder/AppError";
import { Wallet } from "../wallet/wallet.model";
import httpStatus from "http-status-codes"
import { Transaction } from "./transaction.model";
import mongoose from "mongoose";
import { SystemService } from "../system/system.service";
import { CommissionService } from "../commission/commission.service";
import { Types } from "mongoose";



const sendMoney = async (fromUser: string, toUser: string, amount: number) => {
  const fromWallet = await Wallet.findOne({ user: fromUser, status: 'ACTIVE' });
  const toWallet = await Wallet.findOne({ user: toUser, status: 'ACTIVE' });


  if (!fromWallet || !toWallet) {
    throw new AppError(httpStatus.NOT_FOUND, 'One of the wallets does not exist or is blocked');
  }

  if (fromWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  fromWallet.balance -= amount;
  toWallet.balance += amount;
  await fromWallet.save();
  await toWallet.save();

  await Transaction.create({ from: fromUser, to: toUser, amount, type: 'SEND' });

}

const withdrawMoney = async (userId: string, amount: number) => {
  const wallet = await Wallet.findOne({ user: userId, status: 'ACTIVE' });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found or blocked');
  }
  if (wallet.status !== 'ACTIVE') {
    throw new AppError(httpStatus.FORBIDDEN, 'Wallet is blocked');
  }
  if (wallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }
  wallet.balance -= amount;
  await wallet.save();
  await Transaction.create({ from: userId, amount, type: 'WITHDRAW' });
  return wallet;
}

// agent services


const cashIn = async (agentId: string, toUserId: string, amount: number) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const toWallet = await Wallet.findOne({ user: toUserId, status: 'ACTIVE' }).session(session);
    if (!toWallet) {
      throw new AppError(httpStatus.NOT_FOUND, 'Receiver wallet not found or blocked');
    }


    toWallet.balance += amount;
    await toWallet.save({ session });


    const [transaction] = await Transaction.create(
      [
        {
          from: agentId,
          to: toUserId,
          amount,
          type: 'CASH_IN',
        },
      ],
      { session }
    );

    const commissionRate = await SystemService.getCommissionRate() ;
    const commissionAmount = (amount * commissionRate) / 100;

    await CommissionService.createCommission(
      {
        agent: new Types.ObjectId(agentId), 
        type: 'cash-in',                   
        amount: commissionAmount,
        transactionAmount: amount,
        transactionId: transaction._id
      },
      session
    );

    await session.commitTransaction();
    return {
      transaction,
      commissionAmount,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


const cashOut = async (agentId: string, userId: string,amount: number) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const fromWallet = await Wallet.findOne({ user: userId, status: 'ACTIVE' }).session(session);
    if (!fromWallet) {
      throw new AppError(httpStatus.NOT_FOUND, 'User wallet not found or blocked');
    }

    if (fromWallet.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }


    fromWallet.balance -= amount;
    await fromWallet.save({ session });


    const [transaction] = await Transaction.create(
      [
        {
          from: userId,
          to: agentId,
          amount,
          type: 'CASH_OUT',
        },
      ],
      { session }
    );

    // Commission logic
    const commissionRate = await SystemService.getCommissionRate();
    const commissionAmount = (amount * commissionRate) / 100;

    await CommissionService.createCommission(
      {
        agent: new Types.ObjectId(agentId),
        type: "cash-out",
        amount: commissionAmount,
        transactionAmount: amount,
        transactionId: transaction._id,
      },
      session
    );

    await session.commitTransaction();
    return {
      transaction,
      commissionAmount,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};






const getMyTransactions = async (userId: string) => {
  const transactions = await Transaction.find({ $or: [{ from: userId }, { to: userId }] })
    .sort({ createdAt: -1 });
  return transactions;
}

export const transactionService = {
  sendMoney,
  withdrawMoney,
  cashIn,
  cashOut,
  getMyTransactions,
 
};