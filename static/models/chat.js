var mongoose = require('mongoose');
var Message = require('./message.js');

var ChatSchema = new mongoose.Schema({
    members: {
      type: Array,

      required: true,
    },
    messages: {
      type: [Message],
      default: null
    }
  });

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;