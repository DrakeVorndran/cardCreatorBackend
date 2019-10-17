const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lobbySchema = new Schema({
  players: [],
  messages: [],
  roomID: String,
})

module.exports = mongoose.model('User', userSchema)