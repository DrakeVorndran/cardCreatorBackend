
const dotenv = require('dotenv').config()
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const config = require('./config')
const index = require("./controllers/index");
const AuthController = require("./controllers/AuthController");
const app = express();
const port = config.port;

mongoose.connect(config.mongoUri);
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(index);
app.use('/users', AuthController)


const server = http.createServer(app);

const io = socketIo(server);


io.on("connection", socket => {
  console.log("new client connected")
  socket.on('new message', (data, lobby) => {
    console.log(data)
    console.log("emiting")
    io.to(lobby).emit('message sent', data)
  })
  socket.on('join lobby', (lobby) => {
    console.log("joined")
    socket.join(lobby)
  })
  socket.on("disconnect", () => console.log("Client disconnected"));
});



server.listen(port, () => console.log(`Listening on port ${port}`));
