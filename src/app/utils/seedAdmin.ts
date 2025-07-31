import { envVar } from "../config/env";
import { IAuth, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs"


 export const seedAdmin = async() => {
    try {
        const isSuperAdminExists = await User.findOne({email : envVar.ADMIN_EMAIL})

        if(isSuperAdminExists){
            console.log("super admin already exists")
            return
        }

        const AuthProvider : IAuth = {
            provider: "Credential",
            providerId: envVar.ADMIN_EMAIL
        }

 const hashPassword = await bcrypt.hash(envVar.ADMIN_PASSWORD, Number(envVar.BCRYPT_SALT_ROUND) )

   const payload: Partial<IUser> = {
    name: "super admin",
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

