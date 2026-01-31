const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://real-time-collaborative-drawing-canvas-ca5q3ozp4.vercel.app/", // Vite's default port
        methods: ["GET", "POST"],
    },
});

let drawingHistory = []; // Global history
let users = {};          // Online users

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // 1. Initialize User
    users[socket.id] = {
        id: socket.id,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    };

    // Send initial state
    socket.emit("history", drawingHistory);
    io.emit("users_update", users); // Notify everyone of new user

    // 2. Handle Drawing (Real-time)
    socket.on("draw_line", (data) => {
        // Broadcast to everyone else immediately
        socket.broadcast.emit("draw_line", data);
    });

    // 3. Handle Stroke Save (For History/Undo)
    socket.on("save_stroke", (stroke) => {
        drawingHistory.push(stroke);
    });

    // 4. Handle Undo
    socket.on("undo", () => {
        if (drawingHistory.length > 0) {
            drawingHistory.pop();
            io.emit("history", drawingHistory); // Trigger global redraw
        }
    });

    // 5. Handle Clear
    socket.on("clear", () => {
        drawingHistory = [];
        io.emit("history", drawingHistory);
    });

    // 6. Handle Cursors
    socket.on("cursor_move", (data) => {
        socket.broadcast.emit("cursor_move", { ...data, userId: socket.id, color: users[socket.id]?.color });
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("users_update", users);
    });
});

server.listen(3001, () => {
    console.log("Server running on port 3001");
});