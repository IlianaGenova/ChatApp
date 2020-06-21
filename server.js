const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://iliana:moje@chatappcluster-sbbmt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });


//const fs = require('fs')


const express = require("express");
var http = require('http');
const path = require("path");
const app = express();
var server = app.listen(3000);
//const port = process.env.PORT || "8080";
const io = require('socket.io').listen(server)


var User = require('./static/models/user.js');
var Message = require('./static/models/message.js');
var Chat = require('./static/models/chat.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const fs = require('fs');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//connect to MongoDB
mongoose.connect(uri, {
  useCreateIndex : true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err.reason));
const db = mongoose.connection;
module.exports = mongoose.model('Message', Message);
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
  //remove this pls
  //db.collection("users").updateMany( {}, {$push:{previousChats:null}}, {multi:true});
  //db.collection("users").updateMany( {}, {$pull: {previousChats:null}}, {multi:true});
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
        return next(error);
    } else {
        if (user === null) {
            var err = new Error('Not authorized! Please login!');
            return res.redirect('/register');
        }
    }
    Chat.find().exec(function (error, allChats){
      if(error){
        console.log(error);
      }
      else{
        User.find().exec(function (error, allUsers){
          if(error){
            console.log(error);
          }
          else{
            res.render("index", {user: user, allChats: allChats, allUsers: allUsers});
          }
        });
      }
    });
  });
});


app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/register', (req, res) => {
  res.render('register');
});
app.get('/chat', (req, res, next) => {

    if(req.query.search){
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');

      User.find({username: regex}, function (err, users){
        if(err){
          console.log(err);
        } else {
          res.render('search', {items: users});
        }
      });
    }

    else if(req.query.searchresult) {
      User.findById(req.session.userId).exec(function (error, user1) {
        if(error){
          //return next(error);
          console.log(err);
        }
        User.findById(req.query.searchresult).exec(function (error, user2){
          if(error){
            console.log(err);
          }
          else{
            // console.log(user2.id);
            Chat.findOne( {members: { $all: [user1.id, user2.id] } } , function (err, chat) {
              if(err){
                console.log(err);
              }
              else {
                // console.log(chat);
                if(chat != null) {
                  // console.log(chat.id);
                  res.redirect(`/chat/${chat.id}`);
                }
                else {
                  var chatData = {
                    members: [user1.id, user2.id],
                    messages: [null],
					files: [null]
                  }

                  Chat.create(chatData, function (error, chat) {
                    if(error){
                      return next(error);
                    } else {
                      db.collection("users").updateOne( user1, {$push: {previousChats: chat.id}});
                      db.collection("users").updateOne( user2, {$push: {previousChats: chat.id}});
                      db.collection("chats").updateMany( {}, {$pull: {messages: null}}, {multi:true});
					  db.collection("chats").updateMany( {}, {$pull: {files: null}}, {multi:true});
                      res.redirect(`/chat/${chat.id}`);
                    }
                  })

                }
              }
            });
          }
        })

      //db.chats.findOne( {members: { $all: [User.findById("5ea5c7f50577a74674f4f73e").id, User.findById("5ea5c8020577a74674f4f73f").id] } } );
      //db.chats.findOne( {members: { $all: ["5ea5c7f50577a74674f4f73e", "5ea5c8020577a74674f4f73f"] } } );


      });
    }
    else {
      res.render("chat");
    }
});


app.get("/chat/:id", function(req, res) {
  User.find().exec(function (error, allUsers){
    if(error){
      console.log(error);
    }
    else {
      Chat.find().exec(function (error, allChats){
        if(error){
          console.log(error);
        }
        else {
          Chat.findById(req.params.id).exec(function(err, foundChat){
              if(err){
                  console.log(err);
              } else {
                  // console.log("chat found")
                  User.find(User.findById(foundChat.members)).exec(function(error, users){
                    if(error){
                      console.log(error);
                    }
                    else {
                      //console.log(users);
                      User.findById(req.session.userId).exec(function(error, user1){
						//console.log(user1)
						for(i = 0; i < users.length; i++){
                          if(users[i].id != user1.id){
                            if(users[i].blockedUsers.includes(user1.id) || user1.blockedUsers.includes(users[i].id)){
                              res.render('blockedchat', {guest: users[i], chat: foundChat, user: user1, allChats: allChats, allUsers: allUsers});
                            }
                            else {
                              res.render('chat', {guest: users[i], chat: foundChat, user: user1, allChats: allChats, allUsers: allUsers});
                            }
                          }
                        }
                      });
                    }


                      // foundChat.messages.create(messageData, function (error, message) {
                      //   console.log(error, message.content)
                      //     if (error) {
                      //         return error;
                      //     } else {
                      //
                      //       //doesnt work with both - keeps reloading
                      //       //res.end();
                      //       //res.status(200) ;
                      //     }
                      // });
                  });
              }
          });
        }
      })
    }
  })
})

// app.get("/chat/:id/picture", function(req, res) {
//
// }

app.post("/chat/:id", function(req, res) {
  Chat.findById(req.params.id).exec(function(err, foundChat){
    if(err){
        console.log(err);
    } else {
        console.log("chat found")
        User.find(User.findById(foundChat.members)).exec(function(error, users){
          if(error){
            console.log(error);
          }//save message to chat
          else if (req.body.msgerinput != '')
          {
            var messageData = {
                sender_id: req.session.userId,
                content: req.body.msgerinput,
                date: new Date()
            }

			console.log("message info sent")
			io.emit('sendCurrentUser', users[0]);
			io.emit('message', messageData);

            db.collection("chats").updateOne(foundChat, {$push: {"messages": messageData}}, function(error) {
              if(error){
                console.log(error);
              }
            })
          }
		  else if (req.body.fileinput != null && req.body.fileinput != "") {
			// console.log("asdasda" + req.body.fileinput);
			var file1 = JSON.parse(req.body.fileinput);

			if (file1 != null) { //mime type check omitted
				var fileData = {
	                sender_id: req.session.userId,
	                date: new Date(),
					file: file1.data,
					fileType: file1.type
	            }

				console.log("file info sent")
				console.log(fileData)
				io.emit('sendCurrentUser', users[0]);
				io.emit('file', fileData);

				db.collection("chats").updateOne(foundChat, {$push: {"files": fileData}}, function(error) {
	              if(error){
	                console.log(error);
	              }
	            })
			}
		  }
          else if (req.body.msgerinput == '' && req.body.fileinput == null) {
            var err = new Error('You need to enter text to the message.');
            err.status = 400;
            return next(err);
          }
        });
    }
  });
});

app.post("/chat/:id/confirm", function(req, res) {
	Chat.findById(req.params.id).exec(function(err, foundChat){
		if(err){
	    	console.log(err);
	    } else {
				db.collection("chats").updateOne(foundChat, {$set: {confirmation: true}});
				res.redirect(`/chat/${foundChat.id}`);
		}
	})
})

app.post('/block/:id', function (req, res){
  Chat.findById(req.params.id).exec(function(err, foundChat){
    if(err){
        console.log(err);
    } else {
        User.find(User.findById(foundChat.members)).exec(function(error, users){
          if(error){
            console.log(error);
          }//save message to chat
          else {
            // console.log(users);
            User.findById(req.session.userId).exec(function(error, user1){
              for(i = 0; i < users.length; i++){
                if(users[i].id != user1.id){
                  // console.log(users[i].username);
                  var block = {
                    blockedUsers : users[i].id
                  }
                  db.collection("users").updateOne(user1, {$push: block}, function(error){
                    if(error){
                      console.log(error);
                    }
                    else {
                      res.redirect(`/chat/${foundChat.id}`);
                    }
                  });
                }
              }
            });
          }
        });
    }
  });
});

app.get('/register', function (req, res, next) {
    return res.sendFile(path.join(__dirname + './views/register.ejs'));
});

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
                db.collection("users").updateOne( user, {$pull: {previousChats:null}});
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
  // socket.emit('message', 'Hello World')
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
        res.render('profile', {items: user});
      });
});

app.get('/blocked', function (req, res){
  User.find().exec(function (error, allUsers){
    if(error){
      console.log(error);
    }
    else{
      User.findById(req.session.userId).exec(function (error, user) {
        if(error){
          console.log(error);
        }
        else {
          res.render('blocked', {users : allUsers, items: user.blockedUsers});
        }
      });
    }
  });
});

app.post('/unblock', function (req, res){
  User.findById(req.session.userId).exec(function(error, current_user){
    if(error){
      console.log(error);
    }
    else {
      //console.log(req.body.unblock);
      //console.log(req.session.userId);
      var unblock = User.findById(req.body.unblock).exec(function(error, unblock_user){
        console.log(unblock_user.id);
        console.log(current_user.blockedUsers);
        // const index = current_user.blockedUsers.indexOf(unblock_user.id);
        // if (index > -1) {
        //     current_user.blockedUsers.splice(index, 1);
        // }
        // console.log(current_user.blockedUsers);
        db.collection("users").updateOne(current_user, {$pull: {blockedUsers: unblock_user.id} }, function(error){
          if(error){
            console.log(error);
          }
          else {
            res.redirect('/blocked');
          }
        });
      });
    }
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
        return res.redirect('/');
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

// app.get('/chat', function (req, res) {
//
//
// });

app.post('/chat', function (req, res) {
  // req.body.search.addEventListener("submit", event => {
  //   event.preventDefault();
  // });
});

function escapeRegex(text) {
return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//app.get('/search')

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
