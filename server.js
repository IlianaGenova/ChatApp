const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://iliana:moje@chatappcluster-sbbmt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

const io = require('socket.io')(3000)
//const fs = require('fs')
//var http = require('http');

const express = require("express");
const path = require("path");
const app = express();
//const port = process.env.PORT || "8080";

var User = require('./static/models/user.js');
var Message = require('./static/models/message.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect(uri, {
  useCreateIndex : true,
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
//const routes = require('./static/models/routes/router.js');
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
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
        return next(error);
    } else {
        if (user === null) {
            var err = new Error('Not authorized! Please login!');
            return res.redirect('/register');
        }
    }
    res.render('chat');
});
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/register', (req, res) => {
  res.render('register');
});
app.get('/chat', (req, res) => {
  res.render('chat');
});

//
// app.get('/register', function (req, res, next) {
//     return res.sendFile(path.join(__dirname + './views/register.ejs'));
// });

app.post('/register', function (req, res, next) {
    console.log("Hello");
    if (req.body.email &&
      req.body.username &&
      req.body.password &&
      req.body.adress &&
      req.body.phone) {
        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            adress: req.body.adress,
            phone: req.body.phone
        }
        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });

    }
    else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }

})


io.on('connection', socket => {
  console.log("new user pls")
  socket.emit('message', 'Hello World')
})


app.get('/profile', function (req, res, next) {
    User.findById(req.session.userId).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                var err = new Error('Not authorized! Go back!');
                err.status = 400;
                return next(err);
            }
        }
        res.render('profile');
    });
});

app.post('/login', function (req, res, next) {

  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/chat');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }

})

app.get('/logout', function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/register');
            }
        });
    }
});

app.get('/chat', function (req, res) {
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    User.find({username : regex}, function (err, user){
      if(err){
        console.log(err);
      } else {
        res.render("/profile") //this should render a chat with the user we searched
      }
    });
  }
});

app.post('/chat', function (req, res) {
  if (req.body.msgerinput != '')
  {
    var messageData = {
        chat_id: 0,
        sender_id: req.session.userId,
        content: req.body.msgerinput
    }
    Message.create(messageData, function (error, user) {
        if (error) {
            return next(error);
        } else {
          //doesnt work with both - keeps reloading
          //res.end();
          //res.status(200) ;
        }
    });

  }
  else {
      var err = new Error('You need to enter text to the message.');
      err.status = 400;
      return next(err);
  }
});

function escapeRegex(text) {
return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



server = app.listen(8080);

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
