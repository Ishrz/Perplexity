import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import morgan from "morgan"
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
  methods:["GET","POST","PUT","DELETE"]
}));
app.use(morgan("dev"))

// Routes
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';

app.use("/api/v1/auth" , authRouter)
app.use("/api/v1/chats" , chatRouter)





//health check 
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
