import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

// Request interceptor - add auth token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor - extract data and handle errors
api.interceptors.response.use(
    (response) => {
        // Extract actual data from response
        const data = response.data?.data || response.data?.response || response.data
        return data
    },
    (error) => {
        const errorMessage = error.response?.data?.message || error.message || "API Error"
        console.error("API Error:", errorMessage)
        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data
        })
    }
)

/**
 * Fetch all chats for the current user
 */
export const getChats = async () => {
    try {
        console.log("[API] Fetching chats...")
        const response = await api.get("/api/v1/chats")
        console.log("[API] Chats fetched successfully:", response)
        return Array.isArray(response) ? response : response?.chats || []
    } catch (error) {
        console.error("[API] Failed to fetch chats:", error)
        throw error
    }
}

/**
 * Fetch messages for a specific chat
 */
export const getMessages = async (chatId) => {
    try {
        if (!chatId) throw new Error("Chat ID is required")
        console.log("[API] Fetching messages for chat:", chatId)
        const response = await api.get(`/api/v1/chats/${chatId}/messages`)
        console.log("[API] Messages fetched successfully:", response)
        return Array.isArray(response) ? response : response?.messages || []
    } catch (error) {
        console.error("[API] Failed to fetch messages:", error)
        throw error
    }
}

/**
 * Send a message to the AI in a chat
 */
export const sendMessage = async ({ message, chatId }) => {
    try {
       
        
        console.log("[API] Sending message:", { message, chatId })
        const response = await api.post("/api/v1/chats/message", {
            message,
            chatId
        })
        console.log("[API] Message sent successfully, response:", response)
        
        // Return the response data
        // The response could be in various formats depending on backend
        return response
    } catch (error) {
        console.error("[API] Failed to send message:", error)
        throw error
    }
}

/**
 * Create a new chat
 */
export const createChat = async (title = "New Chat") => {
    try {
        let message = title
        console.log("[API] Creating new chat:", message)
        const response = await api.post("/api/v1/chats/message", {
            message
        })
        console.log("[API] Chat created successfully:", response)
        return response
    } catch (error) {
        console.error("[API] Failed to create chat:", error)
        throw error
    }
}

/**
 * Delete a chat
 */
export const deleteChat = async (chatId) => {
    try {
        if (!chatId) throw new Error("Chat ID is required")
        console.log("[API] Deleting chat:", chatId)
        const response = await api.delete(`/api/v1/chats/${chatId}`)
        console.log("[API] Chat deleted successfully")
        return response
    } catch (error) {
        console.error("[API] Failed to delete chat:", error)
        throw error
    }
}

/**
 * Update a chat title
 */
export const updateChat = async (chatId, title) => {
    try {
        if (!chatId) throw new Error("Chat ID is required")
        console.log("[API] Updating chat:", { chatId, title })
        const response = await api.put(`/api/v1/chats/${chatId}`, {
            title
        })
        console.log("[API] Chat updated successfully:", response)
        return response
    } catch (error) {
        console.error("[API] Failed to update chat:", error)
        throw error
    }
}

