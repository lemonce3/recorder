import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, ipcMain, nativeImage, globalShortcut } from 'electron';
import * as capturer from './capturer';
import * as crop from './crop';
import './temp';
import server from './server';
import { recorderServer } from './recorder-server';
import './websocket';
import mitm from './mitm';

const EVENT_PREFIX = 'ELECTRON_RECORDER::';
app.commandLine.appendSwitch('disable-background-timer-throttling');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
	? 'http://localhost:9080'
	: `file://${__dirname}/index.html`;

const screenshotDir = path.resolve('screenshot');

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

	mainWindow.on('closed', () => {
		server.close();
		mitm.close();
		recorderServer.close();
		capturer.destroy();
		crop.destroy();
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

async function screenshot() {
	const image = await cropScreenshot();
	fs.mkdir(screenshotDir, { recursive: true }, error => {
		error && console.log(error);
		const filename = path.resolve(screenshotDir, `${new Date().toLocaleString().replace(/:|\//g, '-')}.png`);
		fs.writeFile(filename, image.toPNG(), error => error && console.log(error));
	});
}

app.on('ready', () => {
	createWindow();
	globalShortcut.register('ctrl+shift+a', screenshot);
	ipcMain.on(EVENT_PREFIX + 'recrop-image', async (event, image) => event.reply(EVENT_PREFIX + 'recrop-image-reply', { dataURL: (await cropImage(image)).toDataURL() }));
	ipcMain.on(EVENT_PREFIX + 'replace-image-with-screenshot', async (event) => event.reply(EVENT_PREFIX + 'replace-image-with-screenshot-reply', { dataURL: (await cropScreenshot()).toDataURL() }));
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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
