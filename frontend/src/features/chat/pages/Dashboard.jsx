import { useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { useChatOperations } from "../hooks/useChatOperations"

const Dashboard = () => {
  const [inputValue, setInputValue] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  
  const { chats, messages, currentChatId, loading, error } = useSelector((state) => state.chat)
  const currentMessages = currentChatId ? messages[currentChatId] || [] : []

  // console.log("chats data")
  // console.log(chats)

  // Debug Redux state
  useEffect(() => { 
    console.log("[Dashboard] Redux State:", {
      chatsCount: chats?.length,
      currentChatId,
      messagesObject: messages,
      currentMessages,
      loading,
      error
    })
  }, [chats, messages, currentChatId, loading, error])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentMessages, loading])

  // Get chat operations
  const {
    fetchChats,
    fetchMessages,
    selectChat,
    handleSendMessage,
    handleCreateChat,
    isLoading
  } = useChatOperations()

  // Load chats on mount
  useEffect(() => {
    console.log("[Dashboard] Component mounted, fetching chats");
    fetchChats()
  }, [fetchChats])

  // Note: We don't need a separate effect to fetch messages because:
  // 1. fetchChats() already loads messages for the first chat
  // 2. selectChat() already loads messages when switching chats
  // This effect is kept as a fallback in case messages need to be refetched
  useEffect(() => {
    if (currentChatId && (!currentMessages || currentMessages.length === 0)) {
      console.log("[Dashboard] No messages for current chat, fetching...");
      fetchMessages(currentChatId)
    }
  }, [currentChatId, currentMessages, fetchMessages])

  const onSendMessage = async () => {
    if (!inputValue.trim()) {
      console.warn("Message is empty");
      return;
    }

 

    console.log("[Dashboard] Sending message:", { inputValue, currentChatId });

    const success = await handleSendMessage(inputValue, currentChatId)
    if (success) {
      setInputValue("")
      console.log("[Dashboard] Message sent successfully, input cleared");
    }
  }

  const onChatSelect = (chatId) => {
    // console.log("chatID selcte")
    // console.log(chatId)
    selectChat(chatId)
    setSidebarOpen(false)
  }

  const onCreateChat = async () => {
    await handleCreateChat("New Chat")
  }

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-700 bg-gray-800 p-4 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Perplexity</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            ✕
          </button>
        </div>

        {/* New Chat Button */}
        <button 
          onClick={onCreateChat}
          disabled={isLoading}
          className="mb-6 w-full rounded border border-gray-600 bg-gray-700 py-2 px-4 text-sm text-gray-100 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "+ New Chat"}
        </button>

        {/* Chats List */}
        <div className="space-y-2">
          <h2 className="mb-3 text-xs font-semibold uppercase text-gray-400">Chats</h2>
          {chats && chats.length > 0 ? (
            chats.map((chat,) => (
              <button
                key={chat._id}
                onClick={() => onChatSelect(chat._id)}
                className={`w-full truncate rounded px-3 py-2 text-left text-sm transition-colors ${
                  currentChatId === chat._id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {chat.title || "Untitled Chat"}
                
              </button>
            ))
          ) : (
            <p className="text-xs text-gray-500">No chats yet</p>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex w-full flex-col md:flex-1">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-100"
          >
            ☰
          </button>
          <h2 className="text-lg font-semibold text-gray-100">
            {chats.find((c) => c.id === currentChatId)?.title || "Select a chat"}
          </h2>
          <div className="w-8" /> {/* Spacer for centering */}
        </header>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-600 text-red-200 px-4 py-3 m-4 rounded">
            {error}
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentMessages && currentMessages.length > 0 ? (
            <div className="space-y-4">
              {currentMessages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-3 md:max-w-md lg:max-w-lg ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-100"
                    }`}
                  >
                    <p className="text-sm md:text-base">{msg.content}</p>
                    {msg.timestamp && (
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-gray-700 px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                      <p className="text-sm text-gray-300 ml-2">Typing...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              <div className="text-center">
                <p>No messages yet. Start a conversation!</p>
                <p className="text-xs mt-2 text-gray-600">Debug - ChatID: {currentChatId} | Messages keys: {Object.keys(messages).join(', ')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 bg-gray-800 p-4 md:p-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && currentChatId && onSendMessage()}
              placeholder={currentChatId ? "Type your message..." : "Select a chat to start..."}
              className="flex-1 rounded border border-gray-600 bg-gray-700 px-4 py-3 text-gray-100 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={onSendMessage}
              className="rounded bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors md:px-6"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
