const EventEmitter = require('events');
const { ipcMain } = require('electron');

const resolver = new EventEmitter();

// ipcMain.on('resolved-action', action => {
// 	resolver.emit('resolved-action', action);
// });

module.exports = {
	pushSnapshot(snapshot) {
		ipcMain.emit('push-snapshot', snapshot);
	},
	pushAction(action) {
		ipcMain.emit('push-action', action);
	}
}