
import { Commission } from './commission.model';
import { ICommission } from './commission.interface';
import  { ClientSession } from 'mongoose';
import { User } from '../user/user.model';



const createCommission = async (payload: Partial<ICommission>, session?: ClientSession) => {
  return await Commission.create([payload], session ? { session } : undefined);
};






const getAgentCommissionSummary = async (userId: string) => {

  const user = await User.findById(userId).select("-password -__v");
  if (!user) throw new Error("User not found");


  const commissionData = await Commission.aggregate([
    { $match: { agent: user._id } },
    {
      $group: {
        _id: "$agent",
        totalCommission: { $sum: "$amount" },
        totalTransactionAmount: { $sum: "$transactionAmount" },
      },
    },
  ]);

  const totalCommission =
    commissionData.length > 0 ? commissionData[0].totalCommission : 0;

  const effectiveRate =
    commissionData.length > 0 && commissionData[0].totalTransactionAmount > 0
      ? commissionData[0].totalCommission / commissionData[0].totalTransactionAmount
      : 0;

  return {
    data: {
      user,
      totalCommission,
      effectiveRate,
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
