
import { Commission } from './commission.model';
import { ICommission } from './commission.interface';
import  { ClientSession } from 'mongoose';
import { User } from '../user/user.model';
import { Transaction } from '../transaction/transaction.model';


const createCommission = async (payload: Partial<ICommission>, session?: ClientSession) => {
  return await Commission.create([payload], session ? { session } : undefined);
};






// service
const getAgentCommissionSummary = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Example: If commission is earned by agents from transactions
  const totalCommissionData = await Transaction.aggregate([
    { $match: { agent: user._id } }, // Or adjust field if different
    { $group: { _id: null, totalCommission: { $sum: "$commission" } } },
  ]);

  const totalCommission =
    totalCommissionData.length > 0
      ? totalCommissionData[0].totalCommission
      : 0;

  return {
    data: {
      user,
      totalCommission,
    },
    meta: {
      userId,
    },
  };
};




const getAllCommissions = async () => {
  return await Commission.find().populate('agent').sort({ createdAt: -1 });
};



export const CommissionService = {
  createCommission,
 getAgentCommissionSummary ,
  getAllCommissions,
};
