import { remote } from 'electron';
import { actionToBuffer, bufferToAction } from './action-util';
const fs = remote.require('fs').promises;
const zlib = remote.require('zlib');

export function read(filename) {
	return new Promise(async (resolve, reject) => {
		zlib.gunzip(await fs.readFile(filename), (error, buffer) => {
			if (error) {
				reject(error);
			} else {
				const data = bufferToAction(buffer);
				resolve(data);
			}
		});
	});
}

export function save(filename, buffer) {
	return new Promise((resolve, reject) => {
		zlib.gzip(buffer, async (error, buffer) => {
			if (error) {
				reject(error);
			} else {
				const data = actionToBuffer(buffer);
				fs.writeFile(filename, data).then(() => resolve()).catch(error => reject(error));
			}
		});
	});
}