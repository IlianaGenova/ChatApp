var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  chat_id: {
    type: String,
    required: true,
    trim: true
  },
  sender_id: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    trim: true
  }
  //add Date and Status features - when we have the time to integrate them
});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
