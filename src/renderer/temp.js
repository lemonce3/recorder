import { ipcRenderer, remote } from 'electron';
import path from 'path';
import fs from 'fs';

function writeFile(pathname, json) {
	return new Promise((resolve, reject) => {
		ipcRenderer.emit(EVENT_PREFIX + 'write-file', { pathname, json });
		ipcRenderer.once(EVENT_PREFIX + 'write-file-reply', message => {
			message.error ? reject(message) : resolve(message);
		});
	});
}

function writeFile1(pathname, data) {
	return fs.promises.writeFile(pathname, data);
}

function readFile1(pathname) {
	return fs.promises.readFile(pathname);
}

function deleteFile1(pathname) {
	return fs.promises.unlink(pathname);
}
function readFile(pathname) {
	return new Promise((resolve, reject) => {
		ipcRenderer.emit(EVENT_PREFIX + 'read-file', { pathname });
		ipcRenderer.once(EVENT_PREFIX + 'read-file-reply', message => {
			message.error ? reject(message) : resolve(message);
		});
	});
}

function deleteFile(pathname) {
	return new Promise((resolve, reject) => {
		ipcRenderer.emit(EVENT_PREFIX + 'delete-file', { pathname });
		ipcRenderer.once(EVENT_PREFIX + 'delete-file-reply', message => {
			message.error ? reject(message) : resolve(message);
		});
	});
}

export const tempPath = path.join(remote.app.getPath('temp'), 'recorder', 'temp');
const EVENT_PREFIX = 'ELECTRON_CROPER_WINDOW::';

export class ProjectTemp {
	constructor(projectId) {
		this.projectID = projectId;
		this.traceIndex = [];
		const projectDir = this.projectDir = path.join(tempPath, projectId);
		this.caseDir = path.join(projectDir, 'case');
		this.dataDir = path.join(projectDir, 'trace-data');
		this.imageDir = path.join(projectDir, 'trace-image');
	}

	getTraceIndex() {
		return readFile1(path.join(this.dataDir, 'index.json'));
	}

	async init() {
		await fs.promises.mkdir(this.projectDir, { recursive: true });
		await fs.promises.mkdir(this.caseDir, { recursive: true });
		await fs.promises.mkdir(this.dataDir, { recursive: true });
		await fs.promises.mkdir(this.imageDir, { recursive: true });
		
		await writeFile1(path.join(this.projectDir, 'document.json'), JSON.stringify({ id: this.projectID }));
	}

	async addTrace(trace, image) {
		if (image) {
			await writeFile1(path.join(this.imageDir, trace.id) + '.png', image);
			await writeFile1(path.join(this.dataDir, trace.id), JSON.stringify({
				type: 'action',
				data: trace
			}));
		} else {
			await writeFile1(path.join(this.dataDir, trace.id), JSON.stringify({
				type: 'snapshot',
				data: trace
			}));
		}

		this.traceIndex.push(trace.id);
		this.$updateIndex();
	}

	getTraceData(id) {
		return readFile1(path.join(this.dataDir, id));
	}

	getTraceImage(id) {
		return readFile1(path.join(this.imageDir, id));
	}

	async $updateIndex() {
		await writeFile1(path.join(this.dataDir, 'index.json'), JSON.stringify(this.traceIndex));
	}

	async updateCaseIndex(caseIndex) {
		await writeFile1(path.join(this.caseDir, 'case.json'), JSON.stringify(caseIndex));
	}
}

export class CaseTemp {
	constructor(filehash, casename) {
		this.actionDir = path.join(tempPath, filehash, 'case', casename, 'action');
		this.actionIndex = [];
	}
	
	async init() {
		await fs.promises.mkdir(this.actionDir, { recursive: true });
	}

	getActionIndex() {
		readFile1(path.join(this.actionDir, 'index.json'));
	}

	getAction(id) {
		readFile1(path.join(this.actionDir, id));
	}

	async addAction(action) {
		await writeFile1(path.join(this.actionDir, action.id), JSON.stringify(action));
		this.actionIndex.push(action.id);
		this.$updateIndex();
	}

	async insertAction(action, prevId) {
		await writeFile1(path.join(this.actionDir, action.id), JSON.stringify(action));
		const prevIndex = this.actionIndex.findIndex(id => id === prevId);
			
		this.actionIndex.splice(prevIndex, 0, action.id);
		this.$updateIndex();
	}

	async updateAction(action) {
		await writeFile1(path.join(this.actionDir, action.id), JSON.stringify(action));
	}

	async deleteAction(action) {
		await deleteFile1(path.join(this.actionDir, action.id));
		const index = this.$actionList.findIndex(id => id === action.id);
		this.actionIndex.splice(index, 1);
		this.$updateIndex();
	}

	async $updateIndex() {
		await writeFile1(path.join(this.actionDir, 'index.json'), JSON.stringify(this.actionIndex));
	}
}

function packageFile(source, target) {
	return new Promise((resolve, reject) => {
		ipcRenderer.emit(EVENT_PREFIX + 'package-file', { source, target });
		ipcRenderer.once(EVENT_PREFIX + 'package-file-reply', message => {
			message.error ? reject(message) : resolve(message);
		});
	});
}