const express = require("express");
const app = express();
const server = require("http").Server(app);
PORT = 3000;
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const ngrok = require("ngrok");

//middleware
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/uuid", (req, res) => {
  res.redirect("/" + uuidv4());
});

app.get("/:room", (req, res) => {
  res.render("room", {
    roomId: req.params.room,
  });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    room = io.sockets.adapter.rooms.get(roomId);
    var roomSize = 0;
    if (room) {
      roomSize = room.size;
    }
    if (roomSize < 2) {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("user-connected");
      socket.on("disconnect", () => {
        socket.broadcast.to(roomId).emit("user-disconnected");
      });
      socket.on("can-play", () => {
        socket.broadcast.to(roomId).emit("can-play");
      });
      socket.on("clicked", (id) => {
        socket.broadcast.to(roomId).emit("clicked", id);
      });
    } else {
      socket.emit("full-room");
    }
  });
});

(async function () {
  const url = await ngrok.connect({
    proto: "http",
    add: 3000,
    authtoken: "2J24KNGZhis0BmkESDZZ4fwT4Nr_7qdtM94NmBhGRdtVEuhCv",
  });
  console.log(url);
})();

server.listen(PORT, () => {
  console.log("listening to the port");
});
