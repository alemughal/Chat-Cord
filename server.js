const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");

const app = express();

// Create server

const server = http.createServer(app);
const io = socketio(server);

// Set Static Folder

app.use(express.static(__dirname + "/public"));

// Run when client connects

const botName = "ChatCord Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user

    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );
    
    // Send users and room info

    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    })
  });
  // Listen for Chat Message

  socket.on("ChatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  // Runs when client disconnects

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if(user){
        console.log("user disconnected")
        io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`))
    }

    
  });
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
