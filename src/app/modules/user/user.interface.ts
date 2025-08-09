import { Types } from "mongoose";


export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    AGENT = 'AGENT'
}

export interface IAuth {
    provider: "Credential"
    providerId: string;
}

export enum IStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  SUSPENDED = "SUSPENDED",
  APPROVED = "APPROVED",

}


export interface IUser {
    _id: Types.ObjectId,
    name: string,
    email: string,
    password?: string,
    phone?: string 
    role?: Role,
    status: IStatus,
    isVerified ? : boolean
    auth ?: IAuth[]
    commissionRate?: number;
    createdAt?: Date;
    updatedAt?: Date;
}