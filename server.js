
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
const deck = require('./utils/deckOfCards')
const shuffle = require('./utils/shuffle')

const Lobby = require('./models/Lobby')

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
  socket.on('create lobby', (lobby, user) => {
    room = new Lobby()
    room.owner = user
    room.roomId = lobby
    room.players = []
    room.deck = shuffle(deck)
    room.markModified('cards')
    room.save()
  })
  socket.on('join lobby', (roomId, userData) => {
    user = { ...userData, cards: [] }
    socket.join(roomId)
    Lobby.findOne({ roomId }).then(lobby => {
      oldUser = lobby.players.reduce((reducer, player) => player._id === userData._id ? player : reducer, {})
      console.log(!oldUser._id)
      if (!oldUser._id) {
        console.log("adding user")
        lobby.players.push(user)
        lobby.markModified('users')
        lobby.save()
      }
    })
  })

  socket.on('draw card', (roomId, userData) => {
    console.log('drawing card')
    lobby = Lobby.findOne({ roomId }).then(lobby => {
      user = lobby.players.reduce((reducer, player) => player._id === userData._id ? player : reducer, {})
      user.cards.push(lobby.deck.pop())
      console.log(user.cards)
      lobby.markModified('players')
      lobby.markModified('deck')
      lobby.save().then(lobby => {
        io.to(roomId).emit('card drawn', user.cards)
      })

    })
  })


  socket.on("disconnect", () => console.log("Client disconnected"));
});



server.listen(port, () => console.log(`Listening on port ${port}`));
