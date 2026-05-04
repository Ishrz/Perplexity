//lib
import {Router} from "express"

const authRouter = Router()

//controllers
import { register ,verifyEmail , login} from "../controllers/auth.controller.js"

//middlewares
import { validateRegister , validateLogin } from "../validators/auth.validator.js"




authRouter.post("/register" , validateRegister , register)

authRouter.get("/verify-email" , verifyEmail)

authRouter.post("/login" , validateLogin , login)




export default authRouter