/* eslint-disable @typescript-eslint/no-explicit-any */


import { User } from '../user/user.model';
import { Wallet, } from '../wallet/wallet.model';
import { Transaction } from '../transaction/transaction.model';
import AppError from '../../errorBuilder/AppError';
import httpStatus from 'http-status-codes';
import { IStatus, IUser, Role } from '../user/user.interface';

import { ITransactionQuery} from './admin.interface';
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




export const getAllTransactions = async (query: ITransactionQuery) => {
  const page = parseInt(query.page as string, 10) || 1;
  const limit = parseInt(query.limit as string, 10) || 10;
  const sort = query.sort === "-createdAt" ? -1 : 1;
  const searchTerm = query.searchTerm?.toLowerCase() || "";
  const typeFilter = query.type?.toUpperCase() || "";


  const pipeline: any[] = [

    {
      $lookup: {
        from: "users",
        localField: "from",
        foreignField: "_id",
        as: "from",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "to",
        foreignField: "_id",
        as: "to",
      },
    },

    {
      $unwind: { path: "$from", preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: "$to", preserveNullAndEmptyArrays: true },
    },

    ...(typeFilter ? [{ $match: { type: typeFilter } }] : []),

    ...(searchTerm
      ? [
          {
            $match: {
              $or: [
                { "from.email": { $regex: searchTerm, $options: "i" } },
                { "to.email": { $regex: searchTerm, $options: "i" } },
                { "from.name": { $regex: searchTerm, $options: "i" } },
                { "to.name": { $regex: searchTerm, $options: "i" } },
              ],
            },
          },
        ]
      : []),

    { $sort: { createdAt: sort } },

    { $skip: (page - 1) * limit },
    { $limit: limit },

    {
      $project: {
        _id: 1,
        type: 1,
        amount: 1,
        status: 1,
        createdAt: 1,
        from: { name: 1, email: 1, role: 1, status: 1 },
        to: { name: 1, email: 1, role: 1, status: 1 },
      },
    },
  ];

  const transactions = await Transaction.aggregate(pipeline);

  const totalCountPipeline: any[] = [
    ...pipeline.filter(
      stage => !stage.$skip && !stage.$limit && !stage.$sort && !stage.$project
    ),
    { $count: "total" },
  ];
  const totalCountResult = await Transaction.aggregate(totalCountPipeline);
  const total = totalCountResult[0]?.total || 0;

  const totalPages = Math.ceil(total / limit);

  const meta = {
    page,
    limit,
    total,
    totalPages,
  };

  return { data: transactions, meta };
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
