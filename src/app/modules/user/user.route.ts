import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { UserController } from "./user.controller";



const router = Router()

router.post("/register" ,  UserController.createUser )
router.get("/all-user",checkAuth(Role.ADMIN), validateRequest(createUserZodSchema), UserController.getAllUser)
router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updatedUser)
router.get("/:id", checkAuth(Role.ADMIN), UserController.getUserById)


export const UserRoutes = router