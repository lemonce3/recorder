// const actionStore = require('./actionStore');
const server = require('./server');
const io = require('socket.io')(server);


io.on('connection', client => {
	client.on('heartbeat', data => {
		client.emit('heartbeat', 'ok');
	});

	client.on('disconnect', () => {

	});

	// actionStore.removeAllListeners();
	// actionStore.on('newRaw', raw => client.send('newRaw', raw));
});