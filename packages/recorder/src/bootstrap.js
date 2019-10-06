const fs = require('fs');
const path = require('path');

const EVENT_PREFIX = 'ELECTRON_SCREENSHOT_CAPTURER::';

module.exports = function bootstrap({ Electron, croper, screenshot }, context) {
	if (typeof Electron === 'string') {
		return;
	}
	const { app, BrowserWindow, ipcMain, nativeImage, globalShortcut } = Electron;
	app.commandLine.appendSwitch('disable-background-timer-throttling');

	let mainWindow;
	// const winURL = process.env.NODE_ENV === 'development'
	// 	? 'http://localhost:8080/recorder.html'
	// 	: `file://${__dirname}/index.html`;

	const winURL = 'http://localhost:8080/recorder.html';

	function createWindow() {
		/**
		 * Initial window options
		 */
		mainWindow = new BrowserWindow({
			height: 600,
			useContentSize: true,
			width: 400,
			frame: false,
			resizable: false,
			webPreferences: {
				nodeIntegration: true,  //default value of webPreferences.nodeIntegration is false in Electron 5.0.0
				nodeIntegrationInWorker: true,
				allowRunningInsecureContent: false,
				webSecurity: true,
				backgroundThrottling: false
			}
		});

		mainWindow.removeMenu();
		mainWindow.loadURL(winURL);
		mainWindow.webContents.openDevTools();

		mainWindow.on('closed', () => {
			mainWindow = null;
		});
	}

	async function cropImage(image) {
		const rect = await crop.getCropRect(image);
		return nativeImage.createFromDataURL(image.dataURL).crop(rect);
	}

	async function cropScreenshot() {
		return cropImage(await capturer.getScreenshot());
	}

	// async function screenshot() {
	// 	const image = await cropScreenshot();
	// 	fs.mkdir(screenshotDir, { recursive: true }, error => {
	// 		error && console.log(error);
	// 		const filename = path.resolve(screenshotDir, `${new Date().toLocaleString().replace(/:|\//g, '-')}.png`);
	// 		fs.writeFile(filename, image.toPNG(), error => error && console.log(error));
	// 	});
	// }

	app.on('ready', () => {
		croper.ready();
		screenshot.ready();
		createWindow();
		// globalShortcut.register('ctrl+shift+a', screenshot);
		ipcMain.on(EVENT_PREFIX + 'recrop-image', async (event, image) => event.reply(EVENT_PREFIX + 'recrop-image-reply', { dataURL: (await cropImage(image)).toDataURL() }));
		ipcMain.on(EVENT_PREFIX + 'replace-image-with-screenshot', async (event) => event.reply(EVENT_PREFIX + 'replace-image-with-screenshot-reply', { dataURL: (await cropScreenshot()).toDataURL() }));
		ipcMain.on(EVENT_PREFIX + 'start-capturer', async (event) => {
			await capturer.startCapture();
			event.reply(EVENT_PREFIX + 'start-capturer-reply');
		});
		ipcMain.on(EVENT_PREFIX + 'stop-capturer', async (event) => {
			await capturer.stopCapture();
			event.reply(EVENT_PREFIX + 'stop-capturer-reply');
		});
	});

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		if (mainWindow === null) {
			createWindow();
		}
	});
}