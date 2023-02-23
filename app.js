const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;
const ENVIRONMENT = process.env.ENVIRONMENT || "development";

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    // origin: "http://localhost:4200",
  },
});
const connectedListOfUsers = [];
io.on("connection", (socket) => {
  console.log(socket.handshake);

  socket.on("send-message", (payload) => {
    console.log("🚀 ~ payload:", payload);

    socket.broadcast.emit("message", payload);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

server.listen(PORT, () => {
  console.log(
    `${ENVIRONMENT} server running on http://localhost:${PORT}. Swagger on http://localhost:${PORT}/swagger `
  );
});
