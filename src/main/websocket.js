const { rawProvider } = require('./recorder-server');
const { getScreenshotByTimestamp } = require('./capturer');
const server = require('./server');
const io = require('socket.io')(server);


io.on('connection', client => {
	client.on('disconnect', () => {
		rawProvider.removeAllListeners();
	});

	rawProvider.on('receive-snapshot', snapshot => client.emit('receive-snapshot', snapshot));
	rawProvider.on('receive-action', async action => {
		action.screenshot = await getScreenshotByTimestamp(action.data.time);
		client.emit('receive-action', action);
	});
});