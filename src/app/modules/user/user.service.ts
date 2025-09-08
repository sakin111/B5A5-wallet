import AppError from "../../errorBuilder/AppError";
import { IAuth, IUser, Role } from "./user.interface";
import httpStatus from "http-status-codes"
import { User } from "./user.model";
import bcrypt from "bcryptjs"
import { envVar } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { WalletStatus } from "../wallet/wallet.interface";
import { Wallet } from "../wallet/wallet.model";

const createUser = async(payload : Partial<IUser>) =>{
   const {email, password ,role, ...rest} = payload
     if (!email || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email and password are required');
  }
     const isUserExist = await User.findOne({email})
    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "user already exist")
    }

    let assignedRole: Role = Role.USER; 

  if (role === Role.AGENT) {
    assignedRole = Role.AGENT; 
  } else if (role === Role.ADMIN) {
    assignedRole = Role.USER;    
  } else {
    assignedRole = Role.USER;  
  }

    const hashPassword =  await bcrypt.hash(password as string, Number(envVar.BCRYPT_SALT_ROUND))
    const AuthProvider : IAuth =  {provider: "Credential", providerId: email as string}
    const user = await User.create({
        email,
        password: hashPassword,
        role: assignedRole,
        auth: [AuthProvider],
        ...rest
    })
    const createWallet = await Wallet.create({
        user: user._id,
        balance: 50,
        status: WalletStatus.ACTIVE                                                                                     

    })
    return {
        user, createWallet
    }
}

const updateUser = async (userId: string, payload:Partial<IUser>, decodedToken:JwtPayload) =>{
    
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

const getMeService = async(userId: string) =>{
    const user = await User.findById(userId).select("-password")
    return {
       data: user
    }
}

const getAllUser = async() =>{
    const user = await User.find({})
    const totalUser = await User.countDocuments()
    return {
        data: user,
        meta: {
            totalUser
        }
    }
}

const getUserById = async(userId: string) => {
    const user = await User.findById(userId);
    return {
        data:user,
        meta: {
            userId
        }
    }
}

const getAgentCommissionById = async (userId: string) => {
  const result = await User.findOne({ _id: userId }).select('commission');
  return { data: result?.commissionRate };
};

export const userService ={
    createUser,
    updateUser,
    getAllUser,
    getUserById ,
    getAgentCommissionById,
    getMeService 
}