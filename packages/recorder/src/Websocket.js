module.exports = function ({ server }) {
	const io = require('socket.io')(server);

	io.on('connection', client => {
		client.on('disconnect', () => {
			rawProvider.removeAllListeners();
			console.log('disconnect');
		});

		client.on('error', error => {
			console.log(error);
		});

		client.on('connect_error', error => console.log(error));
		client.on('connect_timeout', error => console.log(error));

		return {
			send(event, data) {
				client.emit(event, data);
			},
			addEventListener(event, callback) {
				client.on(event, callback);
			}
		}
	});
}