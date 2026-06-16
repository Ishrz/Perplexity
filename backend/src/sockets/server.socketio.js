import { Server } from "socket.io";



let io;
export const initSocket = async (httpServer) => {
   io = new Server(httpServer,
    {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
    }
  );

  console.log("socket.io server started...")

  io.on("connection", (socket) => {
    
    console.log("a user is connected : " + socket.id);
  });
};


export const getIo = ()=>{
  if(!io){
    throw new Error("socket.io not initialized.")
  }

  return io
}
