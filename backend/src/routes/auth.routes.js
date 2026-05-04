//lib
import {Router} from "express"

const authRouter = Router()

//controllers
import { register ,verifyEmail , login , getMe}  from "../controllers/auth.controller.js"

//middlewares
import { validateRegister , validateLogin } from "../validators/auth.validator.js"
import {authUser} from "../middlewares/auth.middleware.js"




authRouter.post("/register" , validateRegister , register)

authRouter.get("/verify-email" , verifyEmail)

authRouter.post("/login" , validateLogin , login)

authRouter.get("/getMe" , authUser ,getMe)


export default authRouter