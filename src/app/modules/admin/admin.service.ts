

import { User } from '../user/user.model';
import { Wallet, } from '../wallet/wallet.model';
import { Transaction } from '../transaction/transaction.model';
import AppError from '../../errorBuilder/AppError';
import httpStatus from 'http-status-codes';
import { IStatus, Role } from '../user/user.interface';
import { WalletStatus } from '../wallet/wallet.interface';

const getAllUsers = async () => {
  return await User.find();
};

const getAllWallets = async () => {
  return await Wallet.find().populate('user');
};

const getAllTransactions = async () => {
  return await Transaction.find().populate(['from', 'to']);
};

const blockWallet = async (walletId: string) => {
  const wallet = await Wallet.findById(walletId);
  if (!wallet) throw new AppError( httpStatus.NOT_FOUND,'Wallet not found');
  wallet.status = WalletStatus.BLOCKED;
  await wallet.save();
  return wallet;
};

const unblockWallet = async (walletId: string) => {
  const wallet = await Wallet.findById(walletId);
  if (!wallet) throw new AppError( httpStatus.NOT_FOUND,'Wallet not found');
  wallet.status = WalletStatus.ACTIVE
  await wallet.save();
  return wallet;
};

const approveAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'AGENT') throw new AppError( httpStatus.NOT_FOUND,'Wallet not found');
  agent.status = IStatus.APPROVED;
  agent.role = Role.AGENT;
  await agent.save();
  return agent;
};

const suspendAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'AGENT') throw new AppError( httpStatus.NOT_FOUND,'Wallet not found');
  agent.status = IStatus.SUSPENDED

  await agent.save();
  return agent;
};


export const AdminService = {
  getAllUsers,
  getAllWallets,
  getAllTransactions,
  blockWallet,
  unblockWallet,
  approveAgent,
  suspendAgent,
};
