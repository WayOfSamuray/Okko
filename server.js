const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handler(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  global.io = io;

  io.on("connection", (socket) => {
    console.log("SOCKET CONNECTED:", socket.id);

    socket.on("disconnect", () => {
      console.log("SOCKET DISCONNECTED");
    });
  });

  httpServer.listen(3000, () => {
    console.log("SERVER READY");
  });
});
