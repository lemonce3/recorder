const fs = require('fs');
const fsp = fs.promises;

const path = require('path');

const archiver = require('archiver');
const extractZip = require('extract-zip');
const { ipcMain, app } = require('electron');

const EVENT_PREFIX = 'ELECTRON_MAIN_WINDOW::';
const MODULE_NAME = 'FS';

const tempPath = path.join(app.getPath('temp'), 'recorder', 'temp');

function pack(source, target) {console.log(source, target);
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

async function writeFile(pathname, data) {
	return await fsp.writeFile(pathname, data);
}

async function readFile(pathname) {
	return await fsp.readFile(pathname);
}

async function deleteFile(pathname) {
	return await fsp.unlink(pathname);
}

async function ensureDir(dir) {
	return new Promise(resolve => {
		fsp.access(dir, fs.constants.R_OK | fs.constants.W_OK).then(resolve).catch(async () => {
			await fsp.mkdir(dir, { recursive: true });
			resolve();
		});
	});
}

const getProjectDir = projectId => path.join(tempPath, projectId);

const getDocumentDataPath = projectId => path.join(getProjectDir(projectId), 'document.json');

const getTraceDataDir = projectId => path.join(getProjectDir(projectId), 'trace-data');
const getTraceImageDir = projectId => path.join(getProjectDir(projectId), 'trace-image');

const getTraceDataPath = (projectId, traceId) => path.join(getTraceDataDir(projectId), traceId) + '.json';
const getTraceImagePath = (projectId, traceId) => path.join(getTraceImageDir(projectId), traceId) + '.png';
const getTraceIndexPath = projectId => path.join(getTraceDataDir(projectId), 'index.json');

const getCaseDir = projectId => path.join(getProjectDir(projectId), 'case');
const getCaseIndexPath = projectId => path.join(getCaseDir(projectId), 'index.json');

const getActionDir = (projectId, caseId) => path.join(getProjectDir(projectId), 'case', caseId, 'action');
const getActionPath = (projectId, caseId, actionId) => path.join(getActionDir(projectId, caseId), actionId) + '.json';
const getActionIndexPath = (projectId, caseId) => path.join(getActionDir(projectId, caseId), 'index.json');

const handler = {
	'ensure-project-dir': async ({ projectId }) => await Promise.all([ getTraceDataDir(projectId), getTraceImageDir(projectId), getCaseDir(projectId) ].map(dir => ensureDir(dir))),
	'ensure-case-dir': async ({ projectId, caseId }) => await Promise.all([ getCaseDir(projectId), getActionDir(projectId, caseId) ].map(dir => ensureDir(dir))),
	'write-document-data': async({projectId, data}) => await writeFile(getDocumentDataPath(projectId), data),
	'write-trace-data': async ({ projectId, traceId, data }) => await writeFile(getTraceDataPath(projectId, traceId), data),
	'write-trace-image': async ({ projectId, traceId, image }) => await writeFile(getTraceImagePath(projectId, traceId), image),
	'write-trace-index': async ({ projectId, data }) => await writeFile(getTraceIndexPath(projectId), data),
	'read-trace-data': async ({ projectId, traceId }) => {
		const pathname = getTraceDataPath(projectId, traceId);
		const data = await readFile(pathname);
		return { data };
	},
	'read-trace-image': async ({ projectId, traceId }) => {
		const pathname = getTraceImagePath(projectId, traceId);
		const data = await readFile(pathname);
		return { data };
	},
	'read-trace-index': async ({ projectId }) => {
		const pathname = getTraceIndexPath(projectId);
		const data = await readFile(pathname);
		return { data };
	},
	'write-case-index': async ({ projectId, data }) => {
		const pathname = getCaseIndexPath(projectId);
		await writeFile(pathname, data);
	},
	'read-case-index': async ({ projectId }) => {
		const pathname = getCaseIndexPath(projectId);
		const data = await readFile(pathname);
		return { data };
	},
	'write-action-index': async ({ projectId, caseId, data }) => await writeFile(getActionIndexPath(projectId, caseId), data),
	'write-action': async ({ projectId, caseId, actionId, data }) => await writeFile(getActionPath(projectId, caseId, actionId), data),
	'read-action-index': async ({ projectId, caseId }) => {
		const pathname = getActionIndexPath(projectId, caseId);
		const data = await readFile(pathname);
		return { data: data.toString() };
	},
	'read-action-list': async ({ projectId, caseId }) => {
		const indexPath = getActionIndexPath(projectId, caseId);
		const actionIndex = JSON.parse(await readFile(indexPath));
		
		const actionList = await Promise.all(actionIndex.map(async actionId => JSON.parse(await readFile(getActionPath(projectId, caseId, actionId)))));
		return { data: actionList };
	},
	'read-action': async ({ projectId, caseId, actionId }) => {
		const pathname = getActionPath(projectId, caseId, actionId);
		const data = await readFile(pathname);
		return { data };
	},
	'delete-action': async ({ projectId, caseId, actionId }) => {
		const pathname = getActionPath(projectId, caseId, actionId);
		const data = await readFile(pathname);
		return { data };
	},
	'extract-archive': async ({ source }) => {
		return new Promise(async resolve => {
			const dir = path.join(tempPath, 'opening');
	
			await new Promise(resolve => extractZip(source, { dir }, error => {
				console.log(error);
				resolve();
			}));
		
			const data = await readFile(path.join(dir, 'document.json'));
			const document = JSON.parse(data.toString());
			
			setTimeout(async () => {
				await fsp.rename(dir, path.join(tempPath, document.id));
				resolve({ id: document.id });
			}, 1000);
		});
	},
	'pack-archive': async ({ projectId, target }) => {console.log(projectId, target);
		await pack(getProjectDir(projectId), target);
	}	
};

Object.keys(handler).forEach(name => {
	const channel = EVENT_PREFIX + MODULE_NAME + name;
	ipcMain.removeAllListeners(channel);
	ipcMain.on(channel, async (event, message) => {
		const reply = await handler[name](message);console.log(name, message, reply);
		event.reply(channel + 'reply', reply);
	});
});