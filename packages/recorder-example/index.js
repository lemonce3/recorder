const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const Recorder = require('@lemonce3/recorder');
const RecorderStore = require('@lemonce3/recorder-store');
const RecorderStoreFS = require('@lemonce3/recorder-store-fs');

module.exports = Recorder({
	mitm: {
		port: 6789,
		injection: './bundle.js'
	},
	store: {
		app: RecorderStore({
			store: RecorderStoreFS({
				// baseDir: path.join(app.getPath('temp'), 'recorder', 'temp')
				baseDir: path.join('temp')
			})
		})
	},
	exporters: [
		
	]
});