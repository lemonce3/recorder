import { app, BrowserWindow, ipcMain } from 'electron';

const EVENT_PREFIX = 'ELECTRON_SCREENSHOT_WINDOW::';

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
		minWidth: screenSize.width,
		minHeight: screenSize.height,
		frame: false,
		movable: false,
		alwaysOnTop: true,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			backgroundThrottling: false
		}
	});

	win.loadURL(winURL);
	win.setBounds({ x: 0, y: 0 });
	win.setSkipTaskbar(true);
	win.minimize();

	ipcMain.on(EVENT_PREFIX + 'hide', () => win.minimize());
});

export function cropImage(size, dataURL) {
	const newSize = getSize();
	if (newSize.height !== screenSize.height || newSize.width !== screenSize.height) {
		screenSize = newSize;
	}

	if (!size) {
		size = screenSize;
	}

	return new Promise((resolve, reject) => {
		win.restore();

		win.webContents.send(EVENT_PREFIX + 'crop-image', size, dataURL);

		ipcMain.once(EVENT_PREFIX + 'crop-image-reply', (event, rect, dataURL) => {
			win.minimize();
			resolve({rect, dataURL});
		});

		win.setBounds({ x: 0, y: 0 });
	});
}

export function getScreenshot() {
	return new Promise((resolve, reject) => {
		win.webContents.send(EVENT_PREFIX + 'get-screenshot');

		ipcMain.once(EVENT_PREFIX + 'get-screenshot-reply', (event, args) => {
			resolve(args);
		});
	});
}

export function getSnapshotByTimestamp(timestamp) {
	return new Promise((resolve, reject) => {
		win.webContents.send(EVENT_PREFIX + 'get-snapshot-by-timestamp', timestamp);

		ipcMain.once(EVENT_PREFIX + 'get-snapshot-by-timestamp', (event, args) => {
			resolve(args);
		});
	});
}