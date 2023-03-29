const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const fileRoute = require("./routes/filesRoute");
const socket = require("socket.io");
const path = require("path");

dotenv.config();
mongoose.set('strictQuery', true);
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/static', express.static('public'))

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoute);
app.use("/api/file", fileRoute);

//mongoose connection
mongoose.connect("mongodb+srv://Administrator:FuZMP6oS56Uaw9AA@cluster0.quzyuwy.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connection Successful!")
}).catch((err) => console.log(err))

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on Port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true,
    }
});

//store all online users inside this map
global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;

    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
        console.log(`🔥: ${socket.id} A user disconnected`);
    });

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit("add-user-recieved", userId);
    });

    socket.on("remove-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.receiver);
        if (sendUserSocket) {
            io.to(sendUserSocket).emit("remove-msg-recieved", data);
        }
    });

    socket.on("remove-all", (data) => {
        const sendUserSocket = onlineUsers.get(data.receiver);
        if (sendUserSocket) {
            io.to(sendUserSocket).emit("remove-all", data);
        }
    });

    socket.on("update-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.receiver);
        if (sendUserSocket) {
            io.to(sendUserSocket).emit("update-msg-recieved", data);
        }
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.receiver);
        console.log("sending msg to", sendUserSocket)
        if (sendUserSocket) {
            io.to(sendUserSocket).emit("msg-recieved", data);
        }
    });

    socket.on('typing', (data) => {
        const sendUserSocket = onlineUsers.get(data.receiver);
        if (sendUserSocket) {
            io.to(sendUserSocket).emit('display', data)
        }
    });

    socket.on('send-img', (data) => {
        const sendUserSocket = onlineUsers.get(data.receiver);
        if (sendUserSocket) {
            io.to(sendUserSocket).emit('image', data)
        }
    });
});
