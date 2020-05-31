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

FileSchema.virtual('filePath').get(function() {
 if(this.file != null && this.fileType != null) {
    return `data:${this.fileType}; charset=utf-8; base64, ${this.file.toString('base64')}`
  }
})

//var Message = mongoose.model('Message', MessageSchema);
//module.exports = Message;
