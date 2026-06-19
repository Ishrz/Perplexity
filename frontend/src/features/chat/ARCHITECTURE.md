# Chat Application - Hook Layer Architecture

## Overview
This document describes the hook layer that interacts with the service layer and manages data flow to the UI.

## Architecture Layers

```
┌─────────────────────────┐
│     React Component     │ (Dashboard.jsx)
│   (UI Rendering)        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Custom Hooks          │ (useChatOperations.js)
│   (Business Logic)      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Redux Reducers        │ (chat.slice.js)
│   (State Management)    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Service Layer         │ (chat.service.api.js)
│   (API Communication)   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Backend API           │ (http://localhost:3000)
│   (Server)              │
└─────────────────────────┘
```

## Service Layer (`chat.service.api.js`)

### Responsibilities
- Handle all HTTP requests to the backend
- Request/Response interceptors for data transformation
- Error handling and logging
- Data validation before sending

### Key Functions
```javascript
getChats()                    // Fetch all chats
getMessages(chatId)           // Fetch messages for a chat
sendMessage({message, chatId}) // Send message to AI
createChat(title)             // Create new chat
deleteChat(chatId)            // Delete a chat
updateChat(chatId, title)     // Update chat title
```

### Request Interceptor
- Automatically adds auth token from localStorage
- Adds proper headers

### Response Interceptor
- Extracts data from response (handles multiple response formats)
- Logs API calls for debugging
- Error handling with custom error objects

## Hook Layer (`useChatOperations.js`)

### Responsibilities
- Bridge between UI components and service layer
- Manage async operations and side effects
- Dispatch Redux actions
- Handle business logic
- Error handling and user feedback

### Main Functions

#### 1. **fetchChats()**
Fetches all chats and populates Redux state
- Called on component mount
- Sets first chat as active if available
- Handles loading and error states
- Logs: `[HOOK] fetchChats: ...`

#### 2. **fetchMessages(chatId)**
Fetches messages for a specific chat
- Validates chatId
- Updates Redux with messages
- Returns array of messages
- Logs: `[HOOK] fetchMessages: ...`

#### 3. **selectChat(chatId)**
Switches to a different chat
- Updates currentChatId in Redux
- Automatically fetches messages for the new chat
- Logs: `[HOOK] selectChat: ...`

#### 4. **handleSendMessage(messageText, chatId)**
Sends user message and gets AI response
- Validates input
- Adds user message to UI immediately
- Sends to backend
- Adds AI response to messages
- Returns boolean success
- Logs: `[HOOK] handleSendMessage: ...`

#### 5. **handleCreateChat(title)**
Creates a new chat
- Creates chat via API
- Refetches chat list
- Sets new chat as active
- Logs: `[HOOK] handleCreateChat: ...`

#### 6. **handleDeleteChat(chatId)**
Deletes a chat
- Calls delete API
- Refetches chat list
- Logs: `[HOOK] handleDeleteChat: ...`

## Redux State (`chat.slice.js`)

### State Structure
```javascript
{
  chats: [],              // Array of chat objects
  messages: {},           // Map of chatId to messages array
  currentChatId: null,    // Currently selected chat ID
  loading: false,         // Loading state for all operations
  error: null             // Error message if any
}
```

### Actions
- `setChats(chats)` - Set all chats
- `addChat(chat)` - Add single chat
- `setMessages({chatId, messages})` - Set messages for a chat
- `addMessage({chatId, message})` - Add single message
- `setCurrentChatId(chatId)` - Set active chat
- `setLoading(bool)` - Set loading state
- `setError(message)` - Set error message

## UI Component (Dashboard.jsx)

### Data Flow

1. **Component Mount**
   ```
   useEffect(() => { fetchChats() })
   ↓
   Fetches all chats from API
   ↓
   Redux state updated with chats
   ↓
   Component re-renders showing chat list
   ```

2. **Chat Selection**
   ```
   User clicks chat → onChatSelect(chatId)
   ↓
   selectChat(chatId) from hook
   ↓
   Updates currentChatId in Redux
   ↓
   useEffect triggers → fetchMessages(chatId)
   ↓
   Messages loaded into Redux
   ↓
   Component re-renders showing messages
   ```

3. **Send Message**
   ```
   User types and clicks Send → onSendMessage()
   ↓
   handleSendMessage(messageText) from hook
   ↓
   Dispatch user message to Redux immediately
   ↓
   Send to API
   ↓
   Receive AI response
   ↓
   Dispatch AI message to Redux
   ↓
   Component re-renders showing both messages
   ```

## Debugging with Console Logs

The hook layer includes comprehensive logging:

```javascript
[API] Fetching chats...
[API] Chats fetched successfully: [...]
[HOOK] fetchChats: Starting fetch...
[HOOK] fetchChats: Received data: [...]
[HOOK] fetchChats: Valid chats: [...]
[HOOK] fetchChats: Setting first chat as active: chat-id
[HOOK] fetchChats: Complete
```

## Error Handling

Each operation includes try-catch with proper error handling:
1. Error caught in hook
2. Error message extracted
3. Dispatched to Redux via `setError()`
4. Displayed to user in UI
5. Logged to console for debugging

## Usage Example in Component

```javascript
const { 
  fetchChats,
  fetchMessages,
  selectChat,
  handleSendMessage,
  handleCreateChat,
  isLoading,
  error 
} = useChatOperations()

// Load chats on mount
useEffect(() => {
  fetchChats()
}, [fetchChats])

// Send a message
const onSendMessage = async () => {
  const success = await handleSendMessage(inputValue)
  if (success) setInputValue("")
}

// Create new chat
const onCreateChat = async () => {
  await handleCreateChat("New Chat")
}
```

## Benefits of This Architecture

1. **Separation of Concerns**: UI, Business Logic, State Management, API Layer are separate
2. **Reusability**: Hooks can be used in multiple components
3. **Testability**: Each layer can be tested independently
4. **Error Handling**: Centralized error handling at hook layer
5. **Loading States**: Proper loading state management throughout
6. **Debugging**: Console logs help track data flow
7. **Maintainability**: Changes to API format only affect service layer
8. **Performance**: Redux prevents unnecessary re-renders
