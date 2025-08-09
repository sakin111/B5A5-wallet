

import { Schema, model } from 'mongoose';
import { ISystemSetting } from './system.interface';

const systemSchema = new Schema<ISystemSetting>({
  key: { type: String, enum: ['commissionRate'], required: true, unique: true },
  value: { type: Number, required: true , default : 1.5 },
});

export const SystemSetting = model<ISystemSetting>('SystemSetting', systemSchema);
