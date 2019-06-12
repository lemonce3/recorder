import { app, BrowserWindow, ipcMain } from 'electron';
import { updateScreenSize } from './capturer';

const EVENT_PREFIX = 'ELECTRON_CROPER_WINDOW::';

let win;
let screen;
let screenSize;

const winURL = process.env.NODE_ENV === 'development'
	? 'http://localhost:9080/croper'
	: `file://${__dirname}/croper.html`;

function getSize() {
	const screens = screen.getAllDisplays();
	const bounds = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};

	screens.forEach(screen => {
		if (screen.bounds.x === bounds.width) {
			bounds.width = bounds.width + screen.bounds.width;
		}
		if (screen.bounds.x < bounds.x) {
			bounds.x = screen.bounds.x;
		}

		if (screen.bounds.y === bounds.height) {
			bounds.height = bounds.height + screen.bounds.height;
		}

		if (screen.bounds.y < bounds.y) {
			bounds.y = screen.bounds.y;
		}
	});

	return {
		height: bounds.y - bounds.height,
		width: bounds.x - bounds.width
	};
}

function getMergeBounds(images) {
	let x = 0 , y = 0 , xe = 0, ye = 0;

	images.forEach(image => {
		if (image.bounds.x === xe) {
			xe = xe + image.bounds.width;
		}
		if (image.bounds.x < x) {
			x = image.bounds.x;
		}

		if (image.bounds.y === ye) {
			ye = ye + image.bounds.height;
		}

		if (image.bounds.y < y) {
			y = image.bounds.y;
		}
	});

	return {
		x, y,
		width: xe - x,
		height: ye -y
	};
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

	ipcMain.on(EVENT_PREFIX + 'restore', () => win.restore());
});

export function getCropRect({ size, dataURL }) {
	const newSize = getSize();
	if (newSize.height !== screenSize.height || newSize.width !== screenSize.height) {
		screenSize = newSize;
		win.setBounds(screenSize);
		updateScreenSize();
	}

	if (!size) {
		size = screenSize;
	}

	return new Promise((resolve, reject) => {
		win.restore();
		win.webContents.send(EVENT_PREFIX + 'get-crop-rect', size, dataURL);

		ipcMain.once(EVENT_PREFIX + 'get-crop-rect-reply', (event, { rect }) => {
			resolve(rect);
			win.minimize();
		});

		win.setBounds({ x: 0, y: 0 });
	});
}

export function destroy() {
	win.destroy();
}