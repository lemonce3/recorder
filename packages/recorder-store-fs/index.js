'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const fsp = fs.promises;
const path = require('path');

async function writeFile(pathname, data) {
	return await fsp.writeFile(pathname, data).catch(e => console.log(e));
}

async function readFile(pathname) {
	return await fsp.readFile(pathname);
}

async function deleteFile(pathname) {
	return await fsp.unlink(pathname);
}

async function emptyDir(pathname) {
	return await fse.emptyDir(pathname);
}

const getProjectDir = projectId => path.join(tempPath, projectId);

const getTraceDataDir = projectId => path.join(getProjectDir(projectId), 'trace-data');
const getTraceImageDir = projectId => path.join(getProjectDir(projectId), 'trace-image');

const getCaseDir = projectId => path.join(getProjectDir(projectId), 'case');
const getActionDir = (projectId, caseName) => path.join(getProjectDir(projectId), 'case', caseName, 'action');

async function KeyValueStore({
	storePath,
	extension = ''
}) {
	const indexPath = path.join(storePath, 'index.json');
	const index = [];
	if (await fse.pathExists(indexPath)) {
		const result = await readFile(indexPath);
		index.splice(0, index.length, ...result);
	}

	async function updateIndex() {
		await writeFile(indexPath, JSON.stringify(index));
	}

	function getItemFilename(key) {
		return path.join(storePath, key) + extension;
	}

	return {
		async query() {

		},
		async clean() {
			await emptyDir(storePath);
		},
		async create(payload) {
			const filename = getItemFilename(payload.key);
			await writeFile(filename, payload.value);
			traceIndex.push(payload.key);
			await updateIndex();
		},
		async get(payload) {
			if (!traceIndex.includes(id)) {
				return;
			}

			const filename = getItemFilename(payload.key);
			return await readFile(filename);
		},
		async update(payload) {
			if (!traceIndex.includes(id)) {
				return;
			}

			const filename = getItemFilename(payload.key);
			await writeFile(filename, payload.value);
			await updateIndex();
		},
		async delete(payload) {
			if (!traceIndex.includes(id)) {
				return;
			}

			traceIndex.findIndex(id => id === payload.key);
			await updateIndex();
			await deleteFile();
		}
	}
}

function BoxStore(options) {
	const { baseDir } = options;

	function getItemDir(key) {
		return path.join(baseDir, key);
	}

	function getDataPath(key) {
		return path.join(getItemDir(key), 'data.json');
	}

	async function readData(key) {
		return {
			hash: encodeURI(key),
			data: await readFile(getDataPath(key))
		}
	}

	async function writeData(key, value) {
		await writeFile(getDataPath(key), value);
	}

	return {
		async query() {
			return await fsp.readdir(baseDir).map(readData);
		},
		async clean() {
			await emptyDir(baseDir);
		},
		async create(payload) {
			const { key, value } = payload;
			await writeData(key, value);
		},
		async get(payload) {
			await readData(payload.key);
		},
		async update(payload) {
			const { key, value } = payload;
			await writeData(key, value);
		},
		async delete(payload) {
			await emptyDir(getItemDir(payload.key));
		}
	}
}



module.exports = function (options) {
	const { baseDir } = options;
	const rootPath = path.join(baseDir, 'recorder', 'temp');
	
	const actionStoreList = {};
	const traceDataStoreList = {};
	const traceImageStoreList = {};
	const caseStoreList = {};
	const projectStore = BoxStore({
		rootPath
	});
	
	
	function getTraceDataStore(projectId) {
		return traceDataStoreList[projectId]
			? traceDataStoreList[projectId]
			: traceDataStoreList[projectId] = KeyValueStore({
				storePath: getTraceDataDir(projectId)
			});
	}
	
	function getTraceImageStore(projectId) {
		return traceImageStoreList[projectId]
			? traceImageStoreList[projectId]
			: traceImageStoreList[projectId] = KeyValueStore({
				storePath: getTraceImageDir(projectId),
				extension: '.png'
			});
	}
	
	function getCaseStore(projectId) {
		return caseStoreList[projectId]
			? caseStoreList[projectId]
			: caseStoreList[projectId] = BoxStore(getCaseDir(projectId));
	}
	
	function getActionStore(projectId, caseName) {
		if (!actionStoreList[projectId]) {
			actionStoreList[projectId] = {};
		}
	
		return actionStoreList[projectId][caseName]
			? actionStoreList[projectId][caseName]
			: actionStoreList[projectId][caseName] = KeyValueStore({
				storePath: getActionDir(projectId, caseName)
			});
	}

	const store = {
		ProjectList: {
			async query() {
				return await projectStore.getList();
			},
			async delete() {
				return await projectStore.clean();
			}
		},
		Project: {
			async create(filename) {
				await projectStore.create();
			},
			async get(filename) {
				await projectStore.get();
			},
			async update(filename, data) {
				await projectStore.update();
			},
			async delete(filename) {
				await projectStore.delete();
			}
		},
		TraceList: {
			async query() {
				return await getTraceDataStore(projectId).getList();
			},
			async delete() {
				return await getTraceDataStore(projectId).clean();
			}
		},
		Trace: {
			async create(projectId, payload) {
				await getTraceDataStore(projectId).create({
					key: payload.id,
					value: payload.data
				});
				if (payload.image) {
					await getTraceImageStore(projectId).create({
						key: payload.id,
						value: payload.image
					});
				}
			},
			async get(projectId, payload) {
				await getTraceDataStore(projectId).get({
					id: payload.id
				});
			},
			async update(projectId, payload) {
				await getTraceDataStore(projectId).update({
					key: payload.id,
					value: payload.data
				});
				if (payload.image) {
					await getTraceImageStore(projectId).update({
						key: payload.id,
						value: payload.image
					});
				}
			},
			async delete(projectId, payload) {
				await getTraceDataStore(projectId).delete({
					id: payload.id
				});
			}
		},
		CaseList: {
			async query() {
				await getCaseStore(projectId).getList();
			},
			async delete() {
				await getCaseStore(projectId).clean();
			}
		},
		Case: {
			async create(payload) {
				await getCaseStore(projectId).create();
			},
			async get(payload) {
				await getCaseStore(projectId).get();
			},
			async update(payload) {
				await getCaseStore(projectId).update();
			},
			async delete(payload) {
				await getCaseStore(projectId).delete();
			}
		},
		ActionList: {
			async query() {
				return await getActionStore(projectId, caseName).getList();
			},
			async delete() {
				return await getActionStore(projectId, caseName).clean();
			}
		},
		Action: {
			async create(id) {
				await getActionStore(projectId, caseName).create({
					key: payload.id,
					value: payload.data
				});
			},
			async get(id) {
				await getActionStore(projectId, caseName).get({
					id: payload.id
				});
			},
			async update() {
				await getActionStore(projectId, caseName).update({
					key: payload.id,
					value: payload.data
				});
			},
			async delete() {
				await getActionStore(projectId, caseName).delete({
					id: payload.id
				});
			}
		}
	}

	return store;
};