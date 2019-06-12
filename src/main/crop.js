import { app, BrowserWindow, ipcMain } from 'electron';
import { updateScreenSize } from './capturer';
import { getMergeBounds } from '../renderer/utils/get-merge-bounds';

const EVENT_PREFIX = 'ELECTRON_CROPER_WINDOW::';

let win;
let screen;
let screenSize;

const winURL = process.env.NODE_ENV === 'development'
	? 'http://localhost:9080/croper'
	: `file://${__dirname}/croper.html`;

app.on('ready', () => {
	screen = require('electron').screen;
	screenSize = getMergeBounds(screen.getAllDisplays());

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

	win.setBounds(screenSize);
	win.loadURL(winURL);
	win.hide();

	ipcMain.on(EVENT_PREFIX + 'restore', () => win.restore());
});

export function getCropRect({ size, dataURL }) {
	const newSize = getMergeBounds(screen.getAllDisplays());
	if (newSize.height !== screenSize.height || newSize.width !== screenSize.height) {
		screenSize = newSize;
		updateScreenSize();
	}

	if (!size) {
		size = screenSize;
	}

	return new Promise((resolve, reject) => {
		win.show();
		win.setBounds(screenSize);
		win.webContents.send(EVENT_PREFIX + 'get-crop-rect', size, dataURL);

		ipcMain.once(EVENT_PREFIX + 'get-crop-rect-reply', (event, { rect }) => {
			resolve(rect);
			win.hide();
		});
	});
}

export function destroy() {
	win.destroy();
}