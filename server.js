const io = require('socket.io')(3000)
const fs = require('fs')
//const express = require('express');
//const app = express();app.set('view engine', 'ejs');

io.on('connection', socket => {
  console.log("new user")
  socket.emit('chat-message', 'Hello World')
})

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./index.html', null, function(error, data) {
      if(error) {
        res.writeHead(404);
        res.write("File not found");
      } else {
        res.write(data);
      }
    res.end();
  })
    //res.end('Hello World!');
    //res.render('index');
}).listen(8080);
