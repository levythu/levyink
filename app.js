var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var r_restapi = require('./routes/rest');
var r_admin = require('./routes/manager');
var r_au=require('./routes/au');

var rand = require("./utils/randomGen");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: rand.GenerateRandomString(100), saveUninitialized: false, resave: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/rest', r_restapi);
app.use('/admin', r_admin);
app.use('/a', r_au);

app.use(function(req, res) {
    res.redirect("https://s.levy.at"+req.originalUrl);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (err.status!=404)
    {
        console.error(err.stack);
    }
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
