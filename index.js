/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

/* PASSPORT LOCAL AUTHENTICATION */

var {Local} = require('./passport/local');

/* Routes */

var userRoutes = require('./routes/user');

app.get('/error', (req, res) => res.send("error logging in"));
app.use('/user', userRoutes);
app.get('/:file', function(req, res){
  var file = req.params.file;
  console.log(req.params.file);
  req.params.file == 'register' ? 
    res.sendFile('register.html', { root : __dirname}) : 
    res.sendFile('login.html', { root : __dirname});
});
app.get('/', (req, res) => res.send('Hello Moto...!'));