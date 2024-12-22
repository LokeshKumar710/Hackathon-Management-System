const app = require('./app')
const PORT = process.env.PORT || 1313
const cors = require('cors')
const http = require("http");
const { Server } = require("socket.io");
const socketHandlers = require("./socket/handlers");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://192.168.51.200:3000"],
    methods: ["GET", "POST"],
  },
});


// WebSocket connection
io.on("connection", (socket) => {
  socketHandlers.handleConnection(socket, io);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

