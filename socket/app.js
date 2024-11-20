import { Server } from "socket.io";
const io = new Server({
    cors: {
        origin: "http://localhost:5173",
        credentials:true,
    }
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  // console.log(userId);
  // console.log(onlineUser);
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    // console.log(onlineUser);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    // console.log(receiverId, data);
    const receiver = getUser(receiverId);
    // console.log(receiver);
    io.to(receiver.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen("3001");