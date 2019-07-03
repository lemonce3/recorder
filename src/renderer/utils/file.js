import { remote } from 'electron';
const path = remote.require('path');
const { dialog } = remote;
import { read, save } from './data-store';

const lemonceRecorderFilter = {
	name: 'LemonceRecorderFile',
	extensions: ['lcrc']
};

export const fileStatus = {
	name: 'untitled',
	base: null,
	dir: null,
	path: null
};

function setFileStatus(newValue = {
	name: 'untitled',
	base: null,
	dir: null,
	path: null
}) {
	Object.assign(fileStatus, newValue);
}

function parseFilename(filename) {
	const result = path.parse(filename);

	return {
		name: result.name,
		base: result.base,
		dir: result.dir,
		path: filename
	};
}

export function newFile(name) {
	setFileStatus();
	fileStatus.name = name;
}

export function saveFile(data) {
	return new Promise((resolve, reject) => {
		if (fileStatus.path) {
			save(fileStatus.path, data);

			resolve();
		} else {
			dialog.showSaveDialog({ defaultPath: fileStatus.name, filters: [lemonceRecorderFilter] }, async filename => {
				if (filename) {
					setFileStatus(parseFilename(filename));
					await save(fileStatus.path, data);

					resolve();
				}
			});
		}
	});
}

export function saveAs(data) {
	return new Promise((resolve, reject) => {
		dialog.showSaveDialog({ filters: [lemonceRecorderFilter] }, async filename => {
			if (filename) {
				await save(filename, data);

				resolve();
			}
		});
	});
}

export function openFile() {
	return new Promise((resolve, reject) => {
		dialog.showOpenDialog({ properties: ['openFile'], filters: [lemonceRecorderFilter] }, async result => {
			if (result.length !== 0) {
				const filename = result[0];
				setFileStatus(parseFilename(filename));
				resolve({ filename, buffer: await read(filename) });
			}
		});
	});
}