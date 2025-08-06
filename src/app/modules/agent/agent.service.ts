

import { User } from '../user/user.model';
import { CommissionService } from '../commission/commission.service';
import { Transaction } from '../transaction/transaction.model';
import httpStatus from 'http-status-codes';
import AppError from '../../errorBuilder/AppError';

const getAgentProfile = async (agentId: string) => {
  const agent = await User.findOne({ _id: agentId, role: 'agent' }).select('-password');
  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, 'Agent not found');
  }
  return agent;
};

const getAgentTransactions = async (agentId: string) => {
  return await Transaction.find({
    $or: [{ from: agentId }, { to: agentId }],
  }).sort({ createdAt: -1 });
};

const getAgentCommissionHistory = async (agentId: string) => {
  return await CommissionService.getAgentCommissions(agentId);
};

export const AgentService = {
  getAgentProfile,
  getAgentTransactions,
  getAgentCommissionHistory,
};
