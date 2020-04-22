var mongoose = require('mongoose');


var ChatSchema = new mongoose.Schema({
    members: {
      type: Array,
      unique: true,
      required: true,
    },
    messages: {
      type: Array,
      unique: true,
      required: true,
    }
  });

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
