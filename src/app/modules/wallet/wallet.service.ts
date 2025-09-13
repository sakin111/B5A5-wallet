
import AppError from "../../errorBuilder/AppError";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes"
import { Transaction } from "../transaction/transaction.model";
import { WalletStatus } from "./wallet.interface";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { IStatus } from "../user/user.interface";





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
  const user = await User.findOne({ _id: new Types.ObjectId(userId) }); // rename to "user"
  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  wallet.status = WalletStatus.BLOCKED;
  user.status = IStatus.BLOCKED;
  
  await wallet.save();
  await user.save();

  return wallet;
};





const unblockWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: new Types.ObjectId(userId) });
  const user = await User.findOne({ _id: new Types.ObjectId(userId) }); 
  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  wallet.status = WalletStatus.ACTIVE;
  user.status = IStatus.ACTIVE;
  
  await wallet.save();
  await user.save();

  return wallet;
};




export const walletService = {
getWallet,
addMoney,
blockWallet,
unblockWallet
}

