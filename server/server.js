import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import { connectDB } from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import {Server} from 'socket.io'
import http from 'http';


// app set up
dotenv.config();
const app = express()
const server = http.createServer(app)
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
// middleware 
app.use(cors())

//initialize socket io server ............
export const io = new   Server(server,{
    cors:{origin:"*"}

})
// store online users 
export const userSocketmap = {}
// socket io handler function 
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId; // ✅ CORRECT way to get userId

  console.log("User Connected", userId);

  if (userId) userSocketmap[userId] = socket.id;

  // Emit online users
  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketmap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
  });
});




// db connection 
connectDB()



// routes ----------
app.use('/api/auth',userRouter)
app.use('/api/messages',messageRouter)

//listening of server 
app.get('/',(req,res)=>{
    res.send("Hello There")
})

if(process.env.NODE_ENV !== "production"){
  const PORT= process.env.PORT || 5000
  server.listen(process.env.PORT,()=>{
    console.log("Server successfully running on port "+process.env.PORT)
})

}
export default server

