const fs = require('fs');
const path = require('path');
const rootCA = require('./dev-cert.json');
const { app } = require('electron');

const Recorder = require('@lemonce3/recorder');
const RecorderStoreFS = require('@lemonce3/recorder-store-fs');

const injectPath = process.env.NODE_ENV === 'development'
	? path.join(__dirname, 'bundle.js')
	: path.join(path.parse(app.getPath('exe')).dir, 'bundle.js');

const inject = fs.readFileSync(injectPath).toString();

module.exports = Recorder({
	mitm: {
		observer: 'http://localhost:10120',
		tracker: 'http://localhost:10110',
		ssl: {
			rootCA,
			enableIntercept: true
		},
		inject,
		port: 6788
	},
	store: RecorderStoreFS({
		// baseDir: path.join(app.getPath('temp'), 'recorder', 'temp')
		baseDir: path.join('temp')
	}),
	exporters: [
		
	]
});

process.on('uncaughtException', console.log);