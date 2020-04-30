var mongoose = require('mongoose');


var ChatSchema = new mongoose.Schema({
    members: {
      type: Array,

      required: true,
    },
    messages: {
      type: Array,

      required: true,
    }
  });

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
