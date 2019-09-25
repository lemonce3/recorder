const { app, BrowserWindow, ipcMain } = require('electron');

// import { startCapture, stopCapture } from './capturer';

// const { getMergeBounds } = require('../renderer/utils/get-merge-bounds');
function getMergeBounds() {}

const EVENT_PREFIX = 'ELECTRON_CROPER_WINDOW::';

module.exports = function (options) {
	let win;
	let screen;
	let screenSize;
	
	const winURL = process.env.NODE_ENV === 'development'
		? options.devURL
		: options.productURL;
	
	function ready() {
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
	}
	
	async function getCropRect({ size, dataURL }) {
		await stopCapture();
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
	
			ipcMain.once(EVENT_PREFIX + 'get-crop-rect-reply', async (event, { rect }) => {
				await startCapture();
				resolve(rect);
				win.hide();
			});
		});
	}
	
	function destroy() {
		win.destroy();
	}

	return {
		ready,
		getCropRect,
		destroy
	}
}