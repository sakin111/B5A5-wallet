

import { User } from '../user/user.model';
import { Transaction } from '../transaction/transaction.model';
import httpStatus from 'http-status-codes';
import AppError from '../../errorBuilder/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';


const getAgentProfile = async (userId: string) => {
  const agent = await User.findOne({ _id: userId})

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, 'Agent not found');
  }
  return agent;
};

const getAgentTransactions = async (agentId: string, query: Record<string, string>) => {
 const baseQuery = Transaction.find({
      $or: [
      { from: agentId },
      { to: agentId },
      { user: agentId },
    ],
  })
   const queryBuilder = new QueryBuilder(baseQuery, query);
  
    const [data, meta] = await Promise.all([
      queryBuilder.sort().paginate().build(),
      queryBuilder.getMeta(),
    ]);
    
    return {data, meta}

};



export const AgentService = {
  getAgentProfile,
  getAgentTransactions,

};
