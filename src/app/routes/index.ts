import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";


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
    // {
    //     path: "/wallet",
    //     route: WalletRoutes
    // },
    // {
    //     path: "/transaction",
    //     route: tTransactionRoutes
    // },
]

RouteModules.forEach((route) => {
    router.use(route.path, route.route)
})