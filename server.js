const express = require("express");
const app = express();
const server = require("http").Server(app);
PORT = 3000;
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");

//middleware
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

server.listen(PORT, () => {
  console.log("listening to the port");
});
