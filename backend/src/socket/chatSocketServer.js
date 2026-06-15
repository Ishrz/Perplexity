import { Server } from "socket.io";

export const socketInitialization = async (httpServer) => {
  const io = new Server(
    { httpServer },
    {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
    }
  );

  console.log("socket.io server started...")

  io.on("connection", (socket) => {
    
    console.log("id = ",socket.id);
  });
};
