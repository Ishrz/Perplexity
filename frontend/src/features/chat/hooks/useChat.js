import { initializeSocketConnection } from "../service/chat.Socket.js";
import { useDispatch } from "react-redux";
import {sendMessage,getChats,deleteChat,getMessages} from "../service/chat.api"
import {addMessages,addMessages,setChats,setCurrentChatId,setLoading,setError} from "../chatSlice.js"


export const useChat = () =>{

    const dispatch = useDispatch()


    const handleSendMessage = async ({message , chatId})=>{
         dispatch(setLoading(true))
        const data = await sendMessage({ message, chatId })
        const { chat, aiMessage } = data
        if (!chatId)
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title,
            }))
        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: message,
            role: "user",
        }))
        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: aiMessage.content,
            role: aiMessage.role,
        }))
        dispatch(setCurrentChatId(chat._id))
    }


    return {
        handleSendMessage,
        initializeSocketConnection
    }
}