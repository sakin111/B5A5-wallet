

export interface IAgentProfile {
  _id: string;
  email: string;
  role: 'agent';
  status: 'approved' | 'suspended';
}
