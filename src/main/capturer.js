import { app, BrowserWindow, ipcMain } from 'electron';

const EVENT_PREFIX = 'ELECTRON_SCREENSHOT_CAPTURER::';

let win;
let screen;
let screenSize;

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

app.on('ready', () => {
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
});

export function updateScreenSize() {
	win.webContents.send('update-screen-size');
}

export function getScreenshot() {
	return new Promise((resolve, reject) => {
		win.webContents.send(EVENT_PREFIX + 'get-screenshot');

		ipcMain.once(EVENT_PREFIX + 'get-screenshot-reply', (event, args) => {
			resolve(args);
		});
	});
}

export function getScreenshotByTimestamp(timestamp) {
	return new Promise((resolve, reject) => {
		win.webContents.send(EVENT_PREFIX + 'get-screenshot-by-timestamp', timestamp);

		ipcMain.once(EVENT_PREFIX + 'get-screenshot-by-timestamp', (event, args) => {
			resolve(args);
		});
	});
}

export function destroy() {
	win.destroy();
}