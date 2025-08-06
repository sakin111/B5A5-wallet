import { envVar } from "../config/env";
import { IAuth, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs"


 export const seedAdmin = async() => {
    try {
        const isAdminExists = await User.findOne({email : envVar.ADMIN_EMAIL})

        if(isAdminExists){
            console.log(" admin already exists")
            return
        }

        const AuthProvider : IAuth = {
            provider: "Credential",
            providerId: envVar.ADMIN_EMAIL
        }

 const hashPassword = await bcrypt.hash(envVar.ADMIN_PASSWORD, Number(envVar.BCRYPT_SALT_ROUND) )

   const payload: Partial<IUser> = {
    name: "admin",
    role: Role.ADMIN,
    email: envVar.ADMIN_EMAIL,
    password: hashPassword, 
    isVerified: true,
    auth : [AuthProvider]

   }
        const Admin = await User.create(payload)
        return Admin
    } catch (error) {
        console.log(error)
    }
};

