
import AppError from "../../errorBuilder/AppError";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes"
import { Transaction } from "../transaction/transaction.model";
import { WalletStatus } from "./wallet.interface";
import { Types } from "mongoose";





const getWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
   throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
  }
  return wallet;
};


const addMoney = async(userId: string, amount: number) =>{
       const wallet = await Wallet.findOneAndUpdate(
      { user: userId, status: 'ACTIVE' },
      { $inc: { balance: amount } },
      { new: true }
    );
    if (!wallet) throw new Error('Wallet not found or blocked');
    await Transaction.create({ from: userId, amount, type: 'ADD_MONEY' });
    return wallet;
}

const blockWallet = async (userId: string) => {
   const wallet = await Wallet.findOne({ user: new Types.ObjectId(userId) });
  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
  
  wallet.status = WalletStatus.BLOCKED;
  await wallet.save();
  return wallet;
};




const unblockWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: new Types.ObjectId(userId) });
  if (!wallet) throw new AppError( httpStatus.NOT_FOUND,'Wallet not found');
  wallet.status = WalletStatus.ACTIVE
  await wallet.save();
  return wallet;
};




export const walletService = {
getWallet,
addMoney,
blockWallet,
unblockWallet
}

