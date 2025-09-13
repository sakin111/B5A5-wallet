

import { User } from '../user/user.model';
import { Wallet, } from '../wallet/wallet.model';
import { Transaction } from '../transaction/transaction.model';
import AppError from '../../errorBuilder/AppError';
import httpStatus from 'http-status-codes';
import { IStatus, IUser, Role } from '../user/user.interface';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { ITransactionQuery, IUserTransactionSummary } from './admin.interface';
import { JwtPayload } from 'jsonwebtoken';
import { envVar } from '../../config/env';
import bcrypt from 'bcryptjs';


const getAllUsers = async () => {
  return await User.find();
};

const getAllWallets = async () => {
  return await Wallet.find().populate('user');
};

const AllTransactions = async () => {
  return await Transaction.find().populate(['from', 'to']);
};




export const getAllTransactions = async (query: ITransactionQuery): Promise<{ data: IUserTransactionSummary[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
 
  let userQuery = User.find();
  const userQueryBuilder = new QueryBuilder(userQuery, query);
  userQueryBuilder.filter();
  userQueryBuilder.search(["name", "email"]);
  const allUsers = await userQueryBuilder.modelQuery.exec();

  // If no users found, fallback to manual search
  let usersToSummarize = allUsers;
  if (usersToSummarize.length === 0) {
    const simpleQuery: Record<string, any> = {};
    if (query.searchTerm && query.searchTerm.trim() !== "") {
      simpleQuery.$or = [
        { name: { $regex: query.searchTerm, $options: "i" } },
        { email: { $regex: query.searchTerm, $options: "i" } },
      ];
    }
    usersToSummarize = await User.find(simpleQuery);
  }


  const summary: IUserTransactionSummary[] = await Promise.all(
    usersToSummarize.map(async (user) => {
      const userId = user._id.toString();
      const transactionQuery: Record<string, any> = {
        $or: [{ from: userId }, { to: userId }],
      };
      if (query.type && query.type !== "") {
        transactionQuery.type = query.type.toUpperCase();
      }
      const transactions = await Transaction.find(transactionQuery);
      const typeCounts: Record<string, number> = {};
      let totalVolume = 0;
      let lastTransactionDate: Date | null = null;
      let lastTransactionType = "";
      transactions.forEach((t) => {
        const type = t.type || "UNKNOWN";
        typeCounts[type] = (typeCounts[type] || 0) + 1;
        totalVolume += t.amount;
        if (t.createdAt && (!lastTransactionDate || new Date(t.createdAt) > lastTransactionDate)) {
          lastTransactionDate = new Date(t.createdAt);
          lastTransactionType = type;
        }
      });
      return {
        _id: userId,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        transactionsByType: typeCounts,
        totalTransactions: transactions.length,
        totalVolume,
        lastTransactionType,
        createdAt: user.createdAt,
      };
    })
  );

  let filteredSummary = summary;
  if (query.type && query.type !== "") {
    filteredSummary = summary.filter((user) => user.totalTransactions > 0);
  }


  if (query.sort) {
    if (query.sort === "totalVolume") {
      filteredSummary.sort((a, b) => b.totalVolume - a.totalVolume);
    } else if (query.sort === "-totalVolume") {
      filteredSummary.sort((a, b) => a.totalVolume - b.totalVolume);
    } else if (query.sort === "createdAt") {
      filteredSummary.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } else if (query.sort === "-createdAt") {
      filteredSummary.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }

  // Pagination
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "10", 10);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredSummary.slice(startIndex, endIndex);
  const meta = {
    page,
    limit,
    total: filteredSummary.length,
    totalPages: Math.ceil(filteredSummary.length / limit),
  };
  return { data: paginatedData, meta };
};




const approveAgent = async (agentId: string) => {
  const user = await User.findById(agentId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  if (user.role !== Role.AGENT) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Only agents can be approved');
  }

  user.status = IStatus.APPROVED;
  await user.save();
  return user;
};

const suspendAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);
  if (!agent) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  if (agent.role !== Role.AGENT) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Only agents can be suspended');
  }

  agent.status = IStatus.SUSPENDED;
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

const getAdminService = async(userId: string) =>{
    const user = await User.findById(userId).select("-password")
    return {
       data: user
    }
}


const updateAdmin = async (userId: string, payload:Partial<IUser>, decodedToken:JwtPayload) =>{
    
    const ifUserExists = await User.findById(userId)

    if(!ifUserExists){
        throw new AppError(httpStatus.NOT_FOUND, "user does not exists")
    }

    
    if(payload.role){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.AGENT){
            throw new AppError(httpStatus.FORBIDDEN, "you are unauthorized")
        }
        if(payload.role === Role.USER && decodedToken.role === Role.AGENT){
     throw new AppError(httpStatus.FORBIDDEN, "you are unauthorized")
        }

    }
    if( payload.isVerified) {
          if(decodedToken.role === Role.USER || decodedToken.role === Role.AGENT){
            throw new AppError(httpStatus.FORBIDDEN, "you are unauthorized")
        }
    }
    if(payload.password){
        payload.password = await bcrypt.hash(payload.password, envVar.BCRYPT_SALT_ROUND)
    }

    const newUserUpdate = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
    return newUserUpdate
}



export const AdminService = {
  getAllUsers,
  getAllWallets,
  getAllTransactions,
  approveAgent,
  suspendAgent,
  activeAgent,
  AllTransactions,
  getAdminService,
  updateAdmin
};
