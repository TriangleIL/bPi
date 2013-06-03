var socketio = require('socketio');

module.exports.listen = function(app) {
	io = socketio.listen(app);

	io.sockets.on('connection', function(socket) {
		// Test Login
		socket.on('login', function(username) {
			socket.emit('showmessage', {message: 'Welcome ' + username, type: 'info' });
			socket.broadcast.emit('showmessage', {message: 'Welcome ' + username, type: 'info' });
		});

		// Home Screen Status 
		socket.on('status:read', function(data, callback) {
			var status = { 	now: 'Sparging',
							next: 'Lautering', 
							remaining: '0:20:12',
							total: '1:42:02'
						};
			console.log(status);
			callback(null, status);
		});
	});
};