

import { User } from '../user/user.model';
import { Wallet, } from '../wallet/wallet.model';
import { Transaction } from '../transaction/transaction.model';
import AppError from '../../errorBuilder/AppError';
import httpStatus from 'http-status-codes';
import { IStatus, Role } from '../user/user.interface';


const getAllUsers = async () => {
  return await User.find();
};

const getAllWallets = async () => {
  return await Wallet.find().populate('user');
};

const getAllTransactions = async () => {
  return await Transaction.find().populate(['from', 'to']);
};



const approveAgent = async (agentId: string) => {
  const user = await User.findById(agentId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  if (user.role !== Role.USER) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is not eligible for agent approval');
  }

  user.role = Role.AGENT;
  user.status = IStatus.APPROVED;
  await user.save();
  return user;
};


const suspendAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'AGENT') throw new AppError( httpStatus.NOT_FOUND,'Wallet not found');
  agent.status = IStatus.SUSPENDED

  await agent.save();
  return agent;
};

const activeAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'AGENT') throw new AppError( httpStatus.NOT_FOUND,'Wallet not found');
  agent.status = IStatus.ACTIVE

  await agent.save();
  return agent;
};


export const AdminService = {
  getAllUsers,
  getAllWallets,
  getAllTransactions,
  approveAgent,
  suspendAgent,
  activeAgent
};
