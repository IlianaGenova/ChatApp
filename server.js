const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://iliana:<moje>@chatappcluster-sbbmt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

const io = require('socket.io')(3000)
//const fs = require('fs')
//var http = require('http');

const express = require("express");
const path = require("path");
const app = express();
//const port = process.env.PORT || "8080";

const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  adress: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: Number,
    unique: true,
    required: true
  }
});
const User = mongoose.model('User', UserSchema);
module.exports = User;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
  //res.send('Hello world')
  res.render('index');
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/register', (req, res) => {
  res.render('register');
});
server = app.listen(8080);

io.on('connection', socket => {
  console.log("new user pls")
  socket.emit('message', 'Hello World')
})



/*
client.connect(err => {
  const collection = client.db("test").collection("devices");
  client.close();
});
*/
/*
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
*/
