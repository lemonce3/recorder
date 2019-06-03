import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, ipcMain, nativeImage, globalShortcut } from 'electron';
import { cropImage } from './capturer';
import './server';
import './websocket';

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
		mainWindow = null;
	});
}

async function cropScreenshot() {
	const result = await cropImage();
	console.log(result);

	// fs.mkdir(screenshotDir, { recursive: true }, error => {
	// 	error && console.log(error);
	// 	const filename = path.resolve(screenshotDir, `${new Date().toISOString()}.png`);
	// 	fs.writeFile(filename, result.toPNG(), error => error && console.log(error));
	// });
}

app.on('ready', () => {
	createWindow();
	globalShortcut.register('ctrl+shift+a', cropScreenshot);
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
