import {Router} from "express"
import { authUser } from "../middlewares/auth/auth.middleware.js"
import { sendMessage } from "../controllers/chat.controller.js"


const chatRouter = Router()


chatRouter.post("/message", authUser , sendMessage)


export default chatRouter