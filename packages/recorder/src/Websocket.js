module.exports = function ({ server }) {
	const io = require('socket.io')(server);
	let recorderGUIClient = null;

	io.on('connection', client => {
		client.on('disconnect', () => {
			console.log('disconnect');
		});

		client.on('error', error => {
			console.log(error);
		});

		client.on('connect_error', error => console.log(error));
		client.on('connect_timeout', error => console.log(error));
		recorderGUIClient = client;
		// setInterval(() => {
		// 	console.log('updated');
		// 	client.emit('updated', {aa: 'aoeuaoeu'});
		// }, 2000);
		console.log('connected');
	});

	return {
		emit(event, data) {
			recorderGUIClient.emit(event, data);
		},
		addEventListener(event, callback) {
			recorderGUIClient.on(event, callback);
		}
	}
}