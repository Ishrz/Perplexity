import 'dotenv/config'
import app from './src/app.js';
import { connectDB } from './src/config/database.js';
import { createServer } from "http";
// import { giminiModelCall } from './src/services/ai.service.js';
import { initSocket } from './src/sockets/server.socketio.js';
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app)

initSocket(httpServer)

// Connect to database
connectDB();

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
