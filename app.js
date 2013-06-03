var express = require('express'),
	http = require('http'),
	path = require('path'),
	routes = require('./routes')
	fs = require('fs'),
	app = module.exports = express()
	server = http.createServer(app),
	io = require('socket.io').listen(server);

// all environments
app.configure(function() {
	app.set('port', process.env.PORT || 8080);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  	app.use(express.errorHandler());
});

app.get('/', routes.index);

// Packages Resources
app.get('/js/templates.js', routes.templatejs);
app.get('/js/vendor.js', routes.vendorjs);

io.sockets.on('connection', function(socket) {
	socket.on('login', function(username) {
		socket.emit('showmessage', {message: 'Welcome ' + username, type: 'info' });
		socket.broadcast.emit('showmessage', {message: 'Welcome ' + username, type: 'info' });
	});

	socket.on('boil', function() {
		socket.emit('status:update', {now: 'Boiling'});	
	});

	socket.on('status:read', function(data, callback) {
		var status = {}; 	
		status.now = "Sparging";
		status.next = "Lautering";
		status.remaining = "0:20:12";
		status.total = "1:42:02";

		callback(null, status);
	});
});

//app.listen(app.get('port'));
server.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + (process.env.PORT || 8080));
// });

