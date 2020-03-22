var express = require('express');
var router = express.Router();
var User = require('../user.js');

router.get('/register', function (req, res, next) {
    return res.sendFile(path.join(__dirname + './templates/register.html'));
});

router.post('/register', function (req, res, next) {
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

router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                var err = new Error('Not authorized! Go back!');
                err.status = 400;
                return next(err);
            } else {
                return res.redirect('/profile');
            }
        }
    });
});

router.get('/logout', function (req, res, next) {
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



module.exports = router;
//var exports = module.exports = {};
