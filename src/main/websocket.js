const { rawProvider } = require('./recorder-server');
const { getScreenshotByTimestamp } = require('./capturer');
const server = require('./server');
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

	client.on('heartbeat', () => {
		client.emit('heartbeat', 'ok');
	});

	rawProvider.on('receive-snapshot', snapshot => client.emit('receive-snapshot', snapshot));
	rawProvider.on('receive-action', async action => {
		action.screenshot = await getScreenshotByTimestamp(action.data.time);
		client.emit('receive-action', action);
	});
});