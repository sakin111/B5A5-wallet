import AppError from "../../errorBuilder/AppError";
import { Wallet } from "../wallet/wallet.model";
import httpStatus from "http-status-codes"
import { Transaction } from "./transaction.model";
import mongoose from "mongoose";
import { SystemService } from "../system/system.service";
import { CommissionService } from "../commission/commission.service";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";




const sendMoney = async (fromEmail: string, toEmail: string, amount: number) => {


const fromUser = await User.findOne({ email: new RegExp(`^${fromEmail}$`, 'i') });
const toUser = await User.findOne({ email: new RegExp(`^${toEmail}$`, 'i') });


  
  if (!fromUser || !toUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'One of the users does not exist');
  }

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
  const newBalance = fromWallet.balance -= amount;
  await fromWallet.save();
  await toWallet.save();

  await Transaction.create({ from: fromUser, to: toUser, amount, type: 'SEND', newBalance: newBalance });

}

const cashOut = async (fromEmail: string, agentEmail: string, amount: number) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const fromUser = await User.findOne({ email: fromEmail, role: Role.USER }).session(session);
    if (!fromUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const agentUser = await User.findOne({ email: agentEmail, role: Role.AGENT }).session(session);
    if (!agentUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Agent not found');
    }

    const userWallet = await Wallet.findOne({ user: fromUser._id, status: 'ACTIVE' }).session(session);
    if (!userWallet) {
      throw new AppError(httpStatus.NOT_FOUND, 'User wallet not found or blocked');
    }

    const agentWallet = await Wallet.findOne({ user: agentUser._id, status: 'ACTIVE' }).session(session);
    if (!agentWallet) {
      throw new AppError(httpStatus.NOT_FOUND, 'Agent wallet not found or blocked');
    }


    if (userWallet.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }


    userWallet.balance -= amount;
    agentWallet.balance += amount;


    await userWallet.save({ session });
    await agentWallet.save({ session });

    const [transaction] = await Transaction.create(
      [
        {
          from: fromUser._id,
          to: agentUser._id,
          amount,
          type: 'CASH_OUT',
          status: 'completed',
        },
      ],
      { session }
    );

    // 7. Calculate and record the commission for the agent
    const commissionRate = await SystemService.getCommissionRate();
    const commissionAmount = (amount * commissionRate) / 100;

    await CommissionService.createCommission(
      {
        agent: agentUser._id,
        type: 'cash-out',
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




// agent services


const cashIn = async (agentId: string, toUserId: string, amount: number) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();


    const agentUser = await User.findOne({ email: agentId }).session(session);
    if (!agentUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    const toUser = await User.findOne({ email: toUserId, role: Role.USER }).session(session);
    if (!toUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const agentWallet = await Wallet.findOne({ user: agentUser._id, status: 'ACTIVE' }).session(session);
    if (!agentWallet) {
      throw new AppError(httpStatus.NOT_FOUND, 'Receiver wallet not found or blocked');
    }
    const userWallet = await Wallet.findOne({ user: toUser._id, status: 'ACTIVE' }).session(session);
    if (!userWallet) {
      throw new AppError(httpStatus.NOT_FOUND, 'Receiver wallet not found or blocked');
    }

    agentWallet.balance -= amount;
    userWallet.balance += amount;


    await userWallet.save({ session });
    await agentWallet.save({ session });


    const [transaction] = await Transaction.create(
      [
        {
          from: agentUser._id,
          to: toUser._id,
          amount,
          type: 'CASH_IN',
          status: 'completed',
        },
      ],
      { session }
    );

    const commissionRate = await SystemService.getCommissionRate() ;
    const commissionAmount = (amount * commissionRate) / 100;

    await CommissionService.createCommission(
      {
        agent: agentUser._id, 
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



const cashOutHistoryCount = async (agentId: string, query: Record<string, string>) => {
  const baseQuery = Transaction.find({
    $or: [
      { from: agentId },
      { to: agentId },   
      { user: agentId }, 
    ],
  })


  const queryBuilder = new QueryBuilder(baseQuery, query);

  const [data, meta] = await Promise.all([
    queryBuilder.sort().build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};
const cashOutHistory = async (agentId: string, query: Record<string, string>) => {
  const baseQuery = Transaction.find({
    type: "CASH_OUT", 
    $or: [
      { from: agentId },
      { to: agentId },   
      { user: agentId }, 
    ],
  })
    .populate("from", "name email role")
    .populate("to", "name email role")
    

  const queryBuilder = new QueryBuilder(baseQuery, query);

  const [data, meta] = await Promise.all([
    queryBuilder.sort().paginate().build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};



const getMyTransactionStats = async (userId: string, query: Record<string, string>) => {

  const baseQuery = Transaction.find({
    $or: [
      { from: userId },
      { to: userId },
      { user: userId },
    ],
  });

  const queryBuilder = new QueryBuilder(baseQuery, query);

  const [data, meta] = await Promise.all([
    queryBuilder.sort().build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getMyTransactions = async (userId: string, query: Record<string, string>) => {

  const baseQuery = Transaction.find({
    $or: [
      { from: userId },
      { to: userId },
      { user: userId },
    ],
  });

  const queryBuilder = new QueryBuilder(baseQuery, query);

  const [data, meta] = await Promise.all([
    queryBuilder.sort().paginate().build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};



export const transactionService = {
  sendMoney,
  cashIn,
  cashOut,
  getMyTransactions,
  getMyTransactionStats,
  cashOutHistory,
  cashOutHistoryCount
 
};