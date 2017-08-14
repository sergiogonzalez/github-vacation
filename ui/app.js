require('babel-register');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var GitHubUtil = require('./util/GitHubUtil.js').default;
var logger = require('morgan');
var path = require('path');
var session = require('express-session');
var sharedsession = require("express-socket.io-session");

var closePull = require('./routes/close_pull');
var index = require('./routes/index');
var login = require('./routes/login');
var repositories = require('./routes/repositories');

var app = express();

var sess = {
	secret: 'mysecret',
	cookie: {},
	resave: true,
	saveUninitialized: true,
};

if (app.get('env') === 'production') {
	app.set('trust proxy', 1) // trust first proxy
	sess.cookie.secure = true // serve secure cookies
}

var sessionObj = session(sess);

app.use(sessionObj);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/close_pull', closePull);
app.use('/login', login);
app.use('/repositories', repositories);

var server = require('http').Server(app);

server.listen(80);

var io = require('socket.io')(server);

io.use(
	sharedsession(
		sessionObj,
		{
			autoSave:true
		}
	)
);

io.on(
	'connection',
	function (socket) {
		socket.on(
			'webHook',
			function (data) {
				GitHubUtil.addWebHook(
					socket.handshake.session.access_token,
					data.owner,
					data.repo,
					function() {
						console.log('WebHook Added');
					}
				);
			}
		);
	}
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;