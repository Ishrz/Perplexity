# Perplexity Style AI Chat Application 🚀

A full-stack, production-ready AI Search and Chat engine inspired by Perplexity. built using the **MERN Stack**, **LangChain (GenAI Orchestration)**, and real-time **Socket.io** web-sockets.

---

---

## 🛠️ Tech Stack

**Frontend:** React.js, Redux Toolkit (State & Loading Management), Tailwind CSS, React Router, Socket.io-client.  
**Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.io, Nodemailer (OAuth2 & App Password Fallback).  
**AI Orchestration:** `@langchain/google-genai`, `@langchain/mistralai`, `@langchain/core`.

---

## 🛠️ Project Architecture & File Mapping



## 📂 Project Folder Structure

```text
perplexity/
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── chat.controller.js
│   │   ├── middlewares/
│   │   │   └── auth/
│   │   │       └── auth.middleware.js
│   │   ├── validators/
│   │   │   └── auth.validator.js
│   │   ├── models/
│   │   │   ├── chat.model.js
│   │   │   ├── message.model.js
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── chat.routes.js
│   │   ├── services/
│   │   │   ├── ai.service.js
│   │   │   └── mail.service.js
│   │   ├── sockets/
│   │   │   └── server.socketio.js
│   │   └── app.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── app/
    │   │   ├── App.jsx
    │   │   ├── app.routes.jsx
    │   │   ├── app.store.js
    │   │   └── index.css
    │   ├── features/
    │   │   ├── auth/
    │   │   │   ├── components/
    │   │   │   │   ├── Protected.jsx
    │   │   │   │   └── Public.jsx
    │   │   │   ├── hook/
    │   │   │   │   └── useAuth.js
    │   │   │   ├── pages/
    │   │   │   │   ├── Login.jsx
    │   │   │   │   └── Register.jsx
    │   │   │   └── service/
    │   │   │       ├── auth.api.js
    │   │   │       └── auth.slice.js
    │   │   └── chat/
    │   │       └── pages/
    │   │           └── Dashboard.jsx
    │   ├── main.jsx
    │   ├── .gitignore
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── README.md
    │   └── vite.config.js

### Backend Structure (`/backend`)
* **`server.js`**: Core entry point wrapping the Express `app` inside a native Node.js HTTP server for Socket.io compliance.
* **`src/config/database.js`**: Managed MongoDB connection lifecycle.
* **`src/controllers/`**: Isolated business routing logic (`auth.controller.js`, `chat.controller.js`).
* **`src/middlewares/auth/`**: Custom token parsing and session authentication protection.
* **`src/validators/`**: Request body schemas and data filters (`auth.validator.js`).
* **`src/models/`**: Strongly-typed schema layer mapping relationships between `user.model.js`, `chat.model.js`, and `message.model.js`.
* **`src/services/`**: Generative AI workflows with conversational memory (`ai.service.js`) and mailing utilities (`mail.service.js`).
* **`src/sockets/server.socketio.js`**: Event-driven web-socket router managing connection-pools.

### Frontend Structure (`/frontend`)
* **`src/app/`**: Root orchestration housing `App.jsx`, global routes (`app.routes.jsx`), global Redux Store configuration (`app.store.js`), and base styling.
* **`src/features/auth/`**: Core Authentication feature bundle containing:
  * Layout route-guards (`components/Protected.jsx`, `components/Public.jsx`).
  * Custom reactivity state abstraction (`hook/useAuth.js`).
  * View layer viewports (`pages/Login.jsx`, `pages/Register.jsx`).
  * Network fetch interceptors (`service/auth.api.js`) and feature slices (`auth.slice.js`).
* **`src/features/chat/`**: Conversational user interface viewports (`pages/Dashboard.jsx`).

---

## 🌟 Key Engineering Implementations

* **Clean Guard Architecture:** Route guards (`Protected` and `Public`) observe global Redux `auth.loading` flags, preventing flashing/flickering layout updates during state hydration from `/getMe`.
* **State Hook Enforcement:** Core validation hooks operate strictly ahead of conditional returns within components, preventing internal dynamic execution stack crashes.
* **Synchronous Web-Socket Hydration:** Clean instantiation parameters within `server.socketio.js` bypass standard configuration objects to directly map the raw node runtime HTTP wrapper.
* **Tailwind UI Polish:** Custom CSS injection layer applied to clean up structural component rendering (`no-scrollbar`) without sacrificing organic browser layout scrolling.

---

## 🚀 Installation & Local Deployment

### 1. Backend Setup
```bash
cd backend
npm install

Create a .env file in the root of the /backend directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_token
GEMINI_API_KEY=your_google_gemini_key
MISTRAL_API_KEY=your_mistral_key
GOOGLE_USER=your_verified_gmail_account
GOOGLE_APP_PASSWORD=your_16_digit_app_password


2. Frontend Setup

cd ../frontend
npm install


3. Execution (Optimized Watch Mode)
Run Backend (Utilizes local nodemon configurations for rapid boot speed):

cd backend
npm run dev


Run Frontend:

cd frontend
npm run dev


The client dashboard will launch at http://localhost:5173 while seamlessly passing credential streams back and forth to the server thread over port 5000.