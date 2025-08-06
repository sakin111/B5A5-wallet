import { model, Schema } from "mongoose";
import { IAuth, IStatus, IUser, Role } from "./user.interface";


const AuthSchema = new Schema<IAuth>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }

}, {
    timestamps: true,
    versionKey: false
})


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String , required : true},
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER

    },
    phone: { type: String },
    status: {
        type: String,
        enum: Object.values(IStatus),
        default: IStatus.ACTIVE
    },
    isVerified: { type: String, default: 'false' },
    auth: [AuthSchema]
}, {
    timestamps: true
})

export const User= model("User", userSchema)  