import { remote } from 'electron';
import { actionToBuffer, bufferToAction } from './action-util';
const fs = remote.require('fs').promises;
const zlib = remote.require('zlib');

export function read(filename) {
	return new Promise(async (resolve, reject) => {
		// resolve(bufferToAction(await fs.readFile(filename)));
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

export function save(filename, actionList) {
	const data = actionToBuffer(actionList);
	return new Promise((resolve, reject) => {
		// fs.writeFile(filename, data).then(() => resolve()).catch(error => reject(error));
		zlib.gzip(data, async (error, buffer) => {
			if (error) {
				reject(error);
			} else {
				fs.writeFile(filename, buffer).then(() => resolve()).catch(error => reject(error));
			}
		});
	});
}