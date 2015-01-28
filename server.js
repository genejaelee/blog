// dependencies
var express = require('express');
var app = express();
var server = require('http').Server(app);
var inspect = require('util').inspect;

var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(multer({ 
	dest: './public/files/',
	onFileUploadStart: function(file) {
		console.log(file.originalname + ' is starting ...');
	},
	onFileUploadComplete: function(file) {
		console.log(file.fieldname + ' uploaded to ' + file.path);
	}
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieSession({
	secret: "secret"
}));
app.use(cookieParser('secret'));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/files'));

// env config
app.config = require('./config')(app); // pass global app to config file and get ENV vars
console.log(app.config.mongodb);

// DB config
var mongoskin = require('mongoskin');
var db = mongoskin.db(app.config.mongodb); // get URI from config file

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// IMPLEMENTATION
app.listen(process.env.PORT || 3000);

// routing
var routes = require('./routes/index')(app, db);
var users = require('./routes/users');

module.exports.app = app;
module.exports.db = db;
