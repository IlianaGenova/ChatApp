var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({

  sender_id: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
  },
  file: {
	  type: Buffer
  },
  fileType: {
	  type: String
  }
  
});

//var Message = mongoose.model('Message', MessageSchema);
//module.exports = Message;
