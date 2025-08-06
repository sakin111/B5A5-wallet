import {Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { authController } from "./auth.controller";



const router = Router()

router.post("/login", authController.CredentialLogin)
router.post("/refresh-token", authController.getNewAccessToken)
router.post("/logout", authController.logout)
router.post("reset-password",  checkAuth(...Object.values(Role)),authController.resetPassword)

export const authRoute = router