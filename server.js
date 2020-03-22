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


const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err.reason));
const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
//app.use(express.static(__dirname + '/templates'));
app.use(express.static(path.join(__dirname, "/static")));

//include Routes
const routes = require('./static/models/routes/router.js');
//app.use('/', routes);

// catch 404 and forward to error handler
/*
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});
*/
app.set('view engine', 'ejs');
//app.use(express.static('public'));
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
