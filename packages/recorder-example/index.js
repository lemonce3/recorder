const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const Recorder = require('@lemonce3/recorder');
const RecorderStoreFS = require('@lemonce3/recorder-store-fs');

module.exports = Recorder({
	mitm: {
		injection: './bundle.js'
	},
	store: RecorderStoreFS({
		// baseDir: path.join(app.getPath('temp'), 'recorder', 'temp')
		baseDir: path.join('temp')
	}),
	exporters: [
		
	]
});