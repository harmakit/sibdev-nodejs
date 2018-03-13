require('dotenv');
var express = require("express");
var app = express();
var body_parser = require("body-parser");
var db = require("./models");
var favicon = require('serve-favicon');
var path = require('path');
var flash = require("connect-flash");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var routes = require('./router')(passport);
var auth = require("./controllers/passport/auth")(passport);
var register = require("./controllers/passport/register")(passport);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash());
app.use(cookieParser());
app.use(cookieSession({secret: 'mySecretKey',
    resave :  true ,
    saveUninitialized :  true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  var result = await db.user.findOne({
  where: {
    id: id
  }
})
done(null, result);
});

app.use('/', routes);
app.start = function() {

  try{
    db.sequelize.authenticate();
    db.sequelize.sync();
    console.log("Server: OK");
    app.listen(3000);
  } catch(err) {
    console.error(err);
  }
}

app.start();
