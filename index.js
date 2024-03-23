import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});


// listen on "chat message" event and emit it to all clients

io.on("connection", (socket) => {
  socket.on("chat message", (data, callback) => {
    io.emit("chat message", data);
    callback(data);
  });
});


// log connection status

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});


// run the server

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
