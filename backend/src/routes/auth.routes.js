//lib
import {Router} from "express"

const authRouter = Router()

//controllers
import { register ,verifyEmail } from "../controllers/auth.controller.js"

//middlewares
import { validateRegister } from "../validators/auth.validator.js"




authRouter.post("/register" , validateRegister , register)

authRouter.get("/verify-email" , verifyEmail)




export default authRouter