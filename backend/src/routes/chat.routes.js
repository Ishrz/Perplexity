import {Router} from "express"
import { authUser } from "../middlewares/auth/auth.middleware.js"
import { sendMessage , getChats,getMessages, chatDelete } from "../controllers/chat.controller.js"


const chatRouter = Router()


chatRouter.post("/message", authUser , sendMessage)
chatRouter.get("/" , authUser , getChats)
chatRouter.get("/:chatId/messages" , authUser , getMessages)
chatRouter.delete("/delete/:chatId" , authUser, chatDelete )



export default chatRouter