const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize app
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/colorGame", { useNewUrlParser: true, useUnifiedTopology: true });

const ResultSchema = new mongoose.Schema({ result: String, createdAt: { type: Date, default: Date.now } });
const Result = mongoose.model("Result", ResultSchema);

// API to get past results
app.get("/results", async (req, res) => {
    const results = await Result.find().sort({ createdAt: -1 }).limit(10);
    res.json(results);
});

// Function to generate random results
function generateResult() {
    const colors = ["Big", "Small", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Emit results every 30 seconds
setInterval(async () => {
    const newResult = generateResult();
    await Result.create({ result: newResult });
    io.emit("newResult", newResult);
}, 30000);

io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("disconnect", () => console.log("User disconnected"));
});

// Start server
server.listen(5000, () => console.log("Server running on port 5000"));
