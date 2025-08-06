

import { SystemSetting } from './system.model';

export const SystemService = {
  async getCommissionRate() {
    const setting = await SystemSetting.findOne({ key: 'commissionRate' });
    return setting?.value || 0;
  },

  async setCommissionRate(rate: number) {
    return await SystemSetting.findOneAndUpdate(
      { key: 'commissionRate' },
      { value: rate },
      { upsert: true, new: true }
    );
  },
};
