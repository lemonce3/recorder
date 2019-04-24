const {app, BrowserWindow, Tray, Menu} = require('electron');
const {render} = require('../config.json');
const path = require('path');
// const createServer = require('./recoder-server');

const isProd = process.env.NODE_ENV === 'development';
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

const winURL = isProd
	? `http://localhost:8081`
	: path.resolve(__dirname, '../dist/index.html'); //苹果不自己加file://协议

function createWindow() {
	let mainWindow = new BrowserWindow({
		width: render.width,
		height: render.height,
		alwaysOnTop: true,
		frame: false,
		resizable: false
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

app.on('ready', function () {
	createWindow();

	const tray = new Tray(path.resolve('asset/lemonce.ico'));

	const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ]);

	tray.setToolTip('test');

	tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', () => {
	app.quit();
});