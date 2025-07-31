import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { UserController } from "./user.controller";


const router = Router()

router.post("/register" , checkAuth(Role.ADMIN), validateRequest(createUserZodSchema), UserController.createUser )
router.get("/all-user", UserController.getAllUser)
router.get("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updatedUser)


export const UserRoutes = router