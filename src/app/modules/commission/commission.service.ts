
import { Commission } from './commission.model';
import { ICommission } from './commission.interface';
import mongoose, { ClientSession } from 'mongoose';


const createCommission = async (payload: Partial<ICommission>, session?: ClientSession) => {
  return await Commission.create([payload], session ? { session } : undefined);
};






const getAgentCommissionSummary = async (userId: string) => {

  const result = await Commission.aggregate([
    { $match: { agent: new mongoose.Types.ObjectId(userId) } },
    
    {
      $group: {
        _id: null,
        totalCommission: { $sum: "$amount" } 
      }
    }
  ]);

  return result[0]?.totalCommission || 0;
};




const getAllCommissions = async () => {
  return await Commission.find().populate('agent').sort({ createdAt: -1 });
};



export const CommissionService = {
  createCommission,
 getAgentCommissionSummary ,
  getAllCommissions,
};
