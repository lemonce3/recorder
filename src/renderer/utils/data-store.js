import { remote } from 'electron';
const fs = remote.require('fs').promises;
const zlib = remote.require('zlib');

export function read(filename) {
	return new Promise(async (resolve, reject) => {
		zlib.gunzip(await fs.readFile(filename), (error, buffer) => {
			if (error) {
				reject(error);
			} else {
				resolve(buffer);
			}
		});
	});
}

export function save(filename, data) {
	return new Promise((resolve, reject) => {
		zlib.gzip(data, async (error, buffer) => {
			if (error) {
				reject(error);
			} else {
				fs.writeFile(filename, buffer).then(() => resolve()).catch(error => reject(error));
			}
		});
	});
}