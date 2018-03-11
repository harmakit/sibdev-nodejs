require('dotenv').config()
var express = require('express');
var app = express();
var path = require('path');
var passport = require('passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./models');
var flash = require('express-flash');
var cookieSession = require('cookie-session');
var session = require('express-session');
var router = require('./router')(passport);
var authPassport = require('./controllers/authPassport')(passport);
var registerPassport = require('./controllers/registerPassport')(passport);


//routes:
/*
var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var login = require('./routes/login');
var profile = require('./routes/profile');
*/
//------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(cookieParser());
app.use(cookieSession({secret: 'mySecretKey',
    resave :  true ,
    saveUninitialized :  true }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));


//authPassport(app);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  var result = await db.users.findOne({
  where: {
    id: id
  }
})
done(null, result);
});

app.use('/', router);


/*
app.use('/', index);
app.use('/users', users);
app.use('/register', register);
app.use('/login', login);
app.use('/profile', profile);
*/

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

var start = function (){
  try{
    db.sequelize.authenticate();
    db.sequelize.sync();
    console.log("Server: OK");
    app.listen(3000);
  } catch(err) {
    console.error(err);
  }
}

start();
