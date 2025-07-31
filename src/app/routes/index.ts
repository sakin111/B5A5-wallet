import { Router } from "express";


export const router = Router()

const RouteModules = [
        {
        path: "/user",
        route: UserRoutes
    },
]

RouteModules.forEach((route) =>{
    router.use(route.path, route.route)
})