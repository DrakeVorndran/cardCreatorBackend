const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lobbySchema = new Schema({
  players: [],
  messages: [],
  deck: [],
  roomId: String,
  owner: String,
})

module.exports = mongoose.model('Lobby', lobbySchema)