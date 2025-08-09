import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";
import { TransactionRoutes } from "../modules/transaction/transaction.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CommissionRoutes } from "../modules/commission/commission.route";
import { SystemRoutes } from "../modules/system/system.route";
import { agentRoutes } from "../modules/agent/agent.route";



export const router = Router()

const RouteModules = [
    {
        path: "/user",
        route: UserRoutes
    },

    {
        path: "/auth",
        route: authRoute
    },
    {
        path: "/wallet",
        route: WalletRoutes
    },
    {
        path: "/transaction",
        route: TransactionRoutes
    },
    {
        path: "/agent",
        route: agentRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    },

    {
        path: "/commissions",
        route: CommissionRoutes
    },

    {
        path: "/system",
        route: SystemRoutes
    },
]





RouteModules.forEach((route) => {
    router.use(route.path, route.route)
})