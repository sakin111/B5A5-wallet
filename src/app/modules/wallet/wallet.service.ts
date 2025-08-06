import { Request } from "express";
import AppError from "../../errorBuilder/AppError";
import { User } from "../user/user.model";
import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes"
import { Transaction } from "../transaction/transaction.model";





const getWallet = async(userId : string) =>{
  const service = await Wallet.findOne({user: userId})
  return service
}


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


const blockWallet = async (walletId: string) => {
  const wallet = await Wallet.findByIdAndUpdate(walletId, { status: 'BLOCKED' }, { new: true });
  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
  return wallet;
};


export const walletService = {
getWallet,
addMoney,
blockWallet
}

