
import { Commission } from './commission.model';
import { ICommission, ICommissionQuery, ICommissionSummary } from './commission.interface';
import  { ClientSession } from 'mongoose';
import { User } from '../user/user.model';
import { QueryBuilder } from '../../utils/QueryBuilder';



const createCommission = async (payload: Partial<ICommission>, session?: ClientSession) => {
  return await Commission.create([payload], session ? { session } : undefined);
};






const getAgentCommissionSummary = async (userId: string) => {

  const user = await User.findById(userId).select("-password -__v");
  if (!user) throw new Error("User not found");


  const commissionData = await Commission.aggregate([
    { $match: { agent: user._id } },
    {
      $group: {
        _id: "$agent",
        totalCommission: { $sum: "$amount" },
        totalTransactionAmount: { $sum: "$transactionAmount" },
      },
    },
  ]);

  const totalCommission =
    commissionData.length > 0 ? commissionData[0].totalCommission : 0;

  const effectiveRate =
    commissionData.length > 0 && commissionData[0].totalTransactionAmount > 0
      ? commissionData[0].totalCommission / commissionData[0].totalTransactionAmount
      : 0;

  return {
    data: {
      user,
      totalCommission,
      effectiveRate,
    },
    meta: {
      userId,
    },
  };
};





export const getAllCommissions = async (
  query: ICommissionQuery
): Promise<{
  data: ICommissionSummary[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> => {
  // Step 1: Find agents with QueryBuilder
  let agentQuery = User.find({ role: "AGENT" });
  const agentQueryBuilder = new QueryBuilder(agentQuery, query);

  agentQueryBuilder.filter();
  agentQueryBuilder.search(["name", "email"]);

  const allAgents = await agentQueryBuilder.modelQuery.exec();

  // fallback if search yields nothing
  let agentsToSummarize = allAgents;
  if (agentsToSummarize.length === 0) {
    const simpleQuery: Record<string, any> = { role: "AGENT" };
    if (query.searchTerm && query.searchTerm.trim() !== "") {
      simpleQuery.$or = [
        { name: { $regex: query.searchTerm, $options: "i" } },
        { email: { $regex: query.searchTerm, $options: "i" } },
      ];
    }
    agentsToSummarize = await User.find(simpleQuery);
  }

  // Step 2: Aggregate commissions for each agent
  const summary: ICommissionSummary[] = await Promise.all(
    agentsToSummarize.map(async (agent) => {
      const agentId = agent._id.toString();

      const commissionQuery: Record<string, any> = { agent: agentId };

      if (query.type && query.type !== "") {
        commissionQuery.type = query.type.toLowerCase();
      }

      const commissions = await Commission.find(commissionQuery);
      const commissionsTypes = await Commission.find(commissionQuery).select("type");

      let totalCommission = 0;
      let lastCommissionDate: Date | null = null;

      commissions.forEach((c) => {
        totalCommission += c.amount;
        if (
          c.createdAt &&
          (!lastCommissionDate || new Date(c.createdAt) > lastCommissionDate)
        ) {
          lastCommissionDate = new Date(c.createdAt);
        }
      });

      return {
        _id: agentId,
        name: agent.name,
        email: agent.email,
        type: commissionsTypes.map(ct => ct.type),
        totalCommissions: commissions.length,
        totalCommission,
        lastCommissionDate,
        createdAt: agent.createdAt,
      };
    })
  );

  // Step 3: Filtered summary (optional)
  let filteredSummary = summary;
  if (query.type?.toLowerCase() && query.type.toLowerCase() !== "") {
    filteredSummary = summary.filter((s) => s.totalCommissions > 0);
  }

  // Step 4: Sorting
  if (query.sort) {
    if (query.sort === "totalCommission") {
      filteredSummary.sort((a, b) => b.totalCommission - a.totalCommission);
    } else if (query.sort === "-totalCommission") {
      filteredSummary.sort((a, b) => a.totalCommission - b.totalCommission);
    } else if (query.sort === "createdAt") {
      filteredSummary.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    } else if (query.sort === "-createdAt") {
      filteredSummary.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    }
  }

  // Step 5: Pagination
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




export const CommissionService = {
  createCommission,
 getAgentCommissionSummary ,
  getAllCommissions,
};
