import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setChats,
    setMessages,
    addMessage,
    setCurrentChatId,
    setLoading,
    setError,
} from "../chat.slice";
import {
    sendMessage,
    getChats,
    getMessages,
    createChat,
    deleteChat,
} from "../service/chat.service.api";

/**
 * Main hook for chat operations
 * Handles all interactions between UI and API service layer
 */
export const useChatOperations = () => {
    const dispatch = useDispatch();
    const { currentChatId, loading, error } = useSelector((state) => state.chat);
    // console.log("current chat id")
    // console.log(currentChatId)

    /**
     * Fetch all chats and populate Redux state
     * This is called on component mount to load chat list
     */
    const fetchChats = useCallback(async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        
        try {
            console.log("[HOOK] fetchChats: Starting fetch...");
            const chatsData = await getChats();
            
            console.log("[HOOK] fetchChats: Received data:", chatsData);
            
            // Ensure chatsData is an array
            const validChats = Array.isArray(chatsData) ? chatsData : [];
            console.log("[HOOK] fetchChats: Valid chats:", validChats);
            
            // Dispatch chats to Redux
            dispatch(setChats(validChats));
            
            // Set first chat as current if available and no chat is selected
            if (validChats.length > 0 && !currentChatId) {
                const firstChatId = validChats[0]._id;
                console.log("[HOOK] fetchChats: Setting first chat as active:", firstChatId);
                dispatch(setCurrentChatId(firstChatId));
                
                // Also fetch messages for the first chat
                console.log("[HOOK] fetchChats: Fetching messages for first chat:", firstChatId);
                try {
                    const messagesData = await getMessages(firstChatId);
                    const validMessages = Array.isArray(messagesData) ? messagesData : [];
                    console.log(firstChatId)
                    dispatch(setMessages({
                        chatId: firstChatId,
                        messages: validMessages
                    }));
                    console.log("[HOOK] fetchChats: Messages loaded for first chat");
                } catch (messageError) {
                    console.error("[HOOK] fetchChats: Failed to fetch messages for first chat:", messageError);
                }
            }
            
            console.log("[HOOK] fetchChats: Complete");
            return validChats;
        } catch (error) {
            const errorMessage = error?.message || "Failed to fetch chats";
            console.error("[HOOK] fetchChats error:", errorMessage);
            dispatch(setError(errorMessage));
            return [];
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, currentChatId]);

    /**
     * Fetch messages for a specific chat
     */
    const fetchMessages = useCallback(async (chatId) => {
        if (!chatId) {
            console.warn("[HOOK] fetchMessages: No chatId provided");
            return [];
        }
        
        dispatch(setLoading(true));
        dispatch(setError(null));
        
        try {
            console.log("[HOOK] fetchMessages: Fetching for chatId:", chatId);
            const messagesData = await getMessages(chatId);
            
            console.log("[HOOK] fetchMessages: Received data:", messagesData);
            
            // Ensure messagesData is an array
            const validMessages = Array.isArray(messagesData) ? messagesData : [];
            
            // Dispatch messages to Redux
            dispatch(setMessages({
                chatId,
                messages: validMessages
            }));
            
            console.log("[HOOK] fetchMessages: Complete");
            return validMessages;
        } catch (error) {
            const errorMessage = error?.message || "Failed to fetch messages";
            console.error("[HOOK] fetchMessages error:", errorMessage);
            dispatch(setError(errorMessage));
            return [];
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    /**
     * Select a chat and fetch its messages
     */
    const selectChat = useCallback(async (chatId) => {
        if (!chatId) {
            console.warn("[HOOK] selectChat: No chatId provided");
            return;
        }
        
        console.log("[HOOK] selectChat: Selecting chat:", chatId);
        
        // First dispatch the chat ID change
        dispatch(setCurrentChatId(chatId));
        
        // Then fetch messages for this chat
        console.log("[HOOK] selectChat: Fetching messages for chat:", chatId);
        
        dispatch(setLoading(true));
        dispatch(setError(null));
        
        try {
            const messagesData = await getMessages(chatId);
            console.log("[HOOK] selectChat: Messages received:", messagesData);
            
            const validMessages = Array.isArray(messagesData) ? messagesData : [];
            
            // Dispatch messages to Redux with correct chatId
            dispatch(setMessages({
                chatId,
                messages: validMessages
            }));
            
            console.log("[HOOK] selectChat: Messages stored in Redux with chatId:", chatId);
        } catch (error) {
            const errorMessage = error?.message || "Failed to fetch messages";
            console.error("[HOOK] selectChat error:", errorMessage);
            dispatch(setError(errorMessage));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    /**
     * Send a message and get AI response
     */
    const handleSendMessage = useCallback(async (messageText, chatIdParam = null) => {
        const chatId = chatIdParam || currentChatId;
        console.log("from hook sendmessage")
        console.log(chatId)
        
        if (!messageText?.trim()) {
            console.warn("[HOOK] handleSendMessage: Message is empty");
            return false;
        }
        
       
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            console.log("[HOOK] handleSendMessage: Sending message", { messageText, chatId });

            // Add user message to UI immediately for instant feedback
            const userMessageId = Date.now();
            dispatch(addMessage({
                chatId,
                message: {
                    id: userMessageId,
                    content: messageText,
                    role: "user",
                    timestamp: new Date().toISOString()
                }
            }));

            console.log("[HOOK] handleSendMessage: User message added to UI");

            // Send message to backend API
            const response = await sendMessage({
                message: messageText,
                chatId
            });

            console.log("[HOOK] handleSendMessage: Response received:", response);

            // Handle AI response - try multiple possible response formats
            let aiMessage = null;
            
            if (response?.aiMessage) {
                aiMessage = response.aiMessage;
            } else if (response?.content) {
                aiMessage = response.content;
            } else if (response?.message) {
                aiMessage = response.message;
            } else if (response?.reply) {
                aiMessage = response.reply;
            } else if (response?.text) {
                aiMessage = response.text;
            } else if (typeof response === 'string') {
                aiMessage = response;
            }

            if (aiMessage) {
                dispatch(addMessage({
                    chatId,
                    message: {
                        id: userMessageId + 1,
                        content: aiMessage,
                        role: "assistant",
                        timestamp: new Date().toISOString()
                    }
                }));
                console.log("[HOOK] handleSendMessage: AI response added to UI", { content: aiMessage });
            } else {
                console.warn("[HOOK] handleSendMessage: No AI message found in response", response);
            }

            return true;
        } catch (error) {
            const errorMessage = error?.message || "Failed to send message";
            console.error("[HOOK] handleSendMessage error:", errorMessage, error);
            dispatch(setError(errorMessage));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }, [currentChatId, dispatch]);

    /**
     * Create a new chat
     */
    const handleCreateChat = useCallback(async (title = "New Chat") => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            console.log("[HOOK] handleCreateChat: Creating chat with title:", title);
            const newChat = await createChat(title);
            
            console.log("[HOOK] handleCreateChat: Chat created:", newChat);

            // Add the new chat to the chats list
            dispatch(setCurrentChatId(newChat.id));
            
            // Refetch chats to update the list
            await fetchChats();
            
            return newChat;
        } catch (error) {
            const errorMessage = error?.message || "Failed to create chat";
            console.error("[HOOK] handleCreateChat error:", errorMessage);
            dispatch(setError(errorMessage));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, fetchChats]);

    /**
     * Delete a chat
     */
    const handleDeleteChat = useCallback(async (chatId) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            console.log("[HOOK] handleDeleteChat: Deleting chat:", chatId);
            await deleteChat(chatId);
            
            console.log("[HOOK] handleDeleteChat: Chat deleted");

            // Refetch chats to update the list
            await fetchChats();
            
            return true;
        } catch (error) {
            const errorMessage = error?.message || "Failed to delete chat";
            console.error("[HOOK] handleDeleteChat error:", errorMessage);
            dispatch(setError(errorMessage));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, fetchChats]);

    return {
        // Query operations
        fetchChats,
        fetchMessages,
        
        // Mutation operations
        selectChat,
        handleSendMessage,
        handleCreateChat,
        handleDeleteChat,
        
        // State
        isLoading: loading,
        error
    };
};
