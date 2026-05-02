//lib
import {Router} from "express"

const authRouter = Router()

//controllers
import { register } from "../controllers/auth.controller.js"

//middlewares
import { validateRegister } from "../validators/auth.validator.js"



authRouter.post("/register" , validateRegister , register)




export default authRouter