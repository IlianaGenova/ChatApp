var mongoose = require('mongoose');
var Message = require('./message.js');
var File = require('./file.js');

var ChatSchema = new mongoose.Schema({
    members: {
      type: Array,

      required: true,
    },
    messages: {
      type: [Message],
      default: null
  },
  files: {
	  type: [File],
	  default: null
  },
  confirmation: {
	  type: Boolean,
	  default: false
  }
  // ,
  // confirmationSender: {
	//   type: String,
	//   default: null
  // }
  });

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
