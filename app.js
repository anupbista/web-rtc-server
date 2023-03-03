const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});
io.on("connection", async (socket) => {

  const sockets = await io.fetchSockets();
  console.log("Joined user", socket.id);
  io.sockets.emit("user-joined", {
    id: socket.id, count: io.engine.clientsCount, sockets: sockets.map(k => k.id)
  });

  socket.on('signal', async (payload) => {
    console.log(payload);
    const data = payload;
    console.log(`From: ${socket.id} To: ${data.toId} Message: ${JSON.stringify(data.message)}`);
    io.to(data.toId).emit('signal', {
      id: socket.id,
      message: data.message
    });
  });

  socket.on("message", (data) => {
    io.sockets.emit("broadcast-message", {
      id: socket.id,
      data
    });
  });

  socket.on('disconnect', () => {
    io.sockets.emit("user-left", socket.id);
  });

});

httpServer.listen(3000);
