import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        chats:[],
        messages:{},
        currentChatId:null,
        loading:false,
        error:null
    },
    reducers:{
        setChats:(state,action) => {
            state.chats = action.payload
        },
        addChat:(state,action) => {
            state.chats.push(action.payload)
        },
        setMessages:(state,action) => {
            const {chatId, messages} = action.payload
            state.messages[chatId] = messages
        },
        addMessage:(state,action) => {
            const {chatId, message} = action.payload
            if(!state.messages[chatId]) {
                state.messages[chatId] = []
            }
            state.messages[chatId].push(message)
        },
        setCurrentChatId:(state,action) => {
            state.currentChatId = action.payload
        },
        setLoading:(state,action) => {
            state.loading = action.payload
        },
        setError:(state, action) => {
            state.error = action.payload
        }

    }
})

export const {setChats, addChat, setMessages, addMessage, setCurrentChatId,setLoading,setError} = chatSlice.actions

export default chatSlice.reducer