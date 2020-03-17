const io = require('socket.io')(3000)

io.on('connection', socket => {
  console.log("new user")
  socket.emit('chat-message', 'Hello World')
})
