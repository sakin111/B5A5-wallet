
import { Commission } from './commission.model';
import { ICommission } from './commission.interface';
import { ClientSession } from 'mongoose';

const createCommission = async (payload: Partial<ICommission>, session?: ClientSession) => {
  return await Commission.create([payload], session ? { session } : undefined);
};

const getAgentCommissions = async (agentId: string) => {
  return await Commission.find({ agent: agentId }).sort({ createdAt: -1 });
};

const getAllCommissions = async () => {
  return await Commission.find().populate('agent').sort({ createdAt: -1 });
};

export const CommissionService = {
  createCommission,
  getAgentCommissions,
  getAllCommissions,
};
