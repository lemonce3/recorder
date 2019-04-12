const {app, BrowserWindow} = require('electron');
const {render} = require('../config.json');
const path = require('path');

const isProd = process.env.NODE_ENV === 'development';

const winURL = isProd
	? `http://localhost:8081`
	: path.resolve(__dirname, '../dist/index.html')

function createWindow() {
	let mainWindow = new BrowserWindow({
		width: render.width,
		height: render.height,
		
	});

	mainWindow.loadURL(winURL);

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	
	if (isProd) {
		const { webContents } = mainWindow;
	
		webContents.on('before-input-event', (event, input) => {
			if (input.key === 'F12' && input.type === 'keyDown') {
				webContents.isDevToolsOpened()
					? webContents.closeDevTools()
					: webContents.openDevTools();
			}

		});

		BrowserWindow.addDevToolsExtension(path.resolve(__dirname, '../dev/vue-devtools/4.1.5_0'));
	}
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	app.quit();
});