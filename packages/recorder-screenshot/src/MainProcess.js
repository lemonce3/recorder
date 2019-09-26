const { app, BrowserWindow, ipcMain } = require('electron');

const EVENT_PREFIX = 'ELECTRON_SCREENSHOT_CAPTURER::';

module.exports = function (options) {
	let win;
	let screen;
	
	const winURL = process.env.NODE_ENV === 'development'
		? 'http://localhost:9080/capturer'
		: `file://${__dirname}/capturer.html`;
	
	function getSize() {
		const screens = screen.getAllDisplays();
		const size = {
			width: 0,
			height: 0
		};
	
		screens.forEach(screen => {
			if (screen.bounds.x === size.width) {
				size.width = size.width + screen.bounds.width;
			}
	
			if (screen.bounds.y === size.height) {
				size.height = size.height + screen.bounds.height;
			}
		});
	
		return size;
	}
	
	function ready() {
		screen = require('electron').screen;
		screenSize = getSize();
	
		win = new BrowserWindow({
			useContentSize: true,
			height: 0,
			width: 0,
			frame: false,
			movable: false,
			alwaysOnTop: false,
			webPreferences: {
				nodeIntegration: true,
				webSecurity: false,
				backgroundThrottling: false,
				offscreen: true
			}
		});
	
		win.loadURL(winURL);
		win.setSkipTaskbar(true);
		win.minimize();
	
		ipcMain.on(EVENT_PREFIX + 'restore', () => win.restore());
	}
	
	function start() {
		return new Promise((resolve, reject) => {
			win.webContents.send(EVENT_PREFIX + 'start-capture');
	
			ipcMain.once(EVENT_PREFIX + 'start-capture-reply', (event, args) => {
				resolve(args);
			});
		});
	}
	
	function stop() {
		return new Promise((resolve, reject) => {
			win.webContents.send(EVENT_PREFIX + 'stop-capture');
	
			ipcMain.once(EVENT_PREFIX + 'stop-capture-reply', (event, args) => {
				resolve(args);
			});
		});
	}
	
	function destroy() {
		win.destroy();
	}

	return {
		ready,
		start,
		stop,
		destroy
	}
}