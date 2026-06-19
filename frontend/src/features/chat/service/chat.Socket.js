import { io } from "socket.io-client";


export const initializedSocketConnection = async () =>{
    const socket = io("http://localhost:3000/",{
        withCredentials:true
    })


  socket.on("connect", () => {
  console.log("Connected to socket.io server, id:" + socket.id); // x8WIv7-mJelg7on_ALbx
});
}