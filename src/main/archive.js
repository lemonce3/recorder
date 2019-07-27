const fs = require('fs');
const path = require('path');

const archiver = require('archiver');
const extractZip = require('extract-zip');
const { ipcMain } = require('electron');

const EVENT_PREFIX = 'ELECTRON_CROPER_WINDOW::';


function pack(source, target) {
	const output = fs.createWriteStream(target);
	const archive = archiver('zip', {
		zlib: { level: 9 }
	});
	
	output.on('close', function() {
		console.log(archive.pointer() + ' total bytes');
		console.log('archiver has been finalized and the output file descriptor has closed.');
	});
	
	output.on('end', function() {
		console.log('Data has been drained');
	});
	
	output.on('error', function(error) {
		console.log(error);
	});
	
	archive.on('warning', function(err) {
		if (err.code === 'ENOENT') {
			// log warning
		} else {
			// throw error
			throw err;
		}
	});
	
	archive.on('error', function(err) {
		throw err;
	});
	
	archive.pipe(output);
	archive.directory(source, false);
	archive.finalize();
}

function extract(source, target) {
	return; 
}

ipcMain.on(EVENT_PREFIX + 'extract-archive', async (event, { source, tempPath }) => {
	const dir = path.join(tempPath, 'opening');

	console.log(source, dir);
	await new Promise(resolve => extractZip(source, { dir }, error => resolve(error)));

	fs.readFile(path.join(dir, 'document.json'), (error, data) => {
		const document = JSON.parse(data.toString());
		console.log(document);
		// fs.rename(dir, path.join(tempPath, document.id), error => event.reply(EVENT_PREFIX + 'extract-archive-reply', { id: document.id }));
		event.reply(EVENT_PREFIX + 'extract-archive-reply', { id: document.id });
	});
});

ipcMain.on(EVENT_PREFIX + 'pack-archive', async (event, { source, target }) => {console.log(source, target);
	await pack(source, target);

	event.reply(EVENT_PREFIX + 'pack-archive-reply');
});