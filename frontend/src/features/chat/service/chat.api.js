import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})


export const sendMessage = async ({message,chatId}) =>{
    const data =await api.post("/api/v1/chats/message", {
        message,
        chatId
    })

    return data.response
}

export const getChats = async () => {
    const response = await api.get("/api/v1/chats")
    return response.data
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/v1/chats/${chatId}/messages`)
    return response.data
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/v1/chats/delete/${chatId}`)
    return response.data
}