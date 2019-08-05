import { ipcRenderer } from 'electron';

const EVENT_PREFIX = 'ELECTRON_MAIN_WINDOW::';
const MODULE_NAME = 'FS';

const send = async (channel, message) => new Promise(resolve => {
	ipcRenderer.once(EVENT_PREFIX + MODULE_NAME + channel + 'reply', (event, reply) => {
		console.log(channel, reply);
		resolve(reply);
	});
	ipcRenderer.send(EVENT_PREFIX + MODULE_NAME + channel, message);
});

export const api = {
	fs: {
		project: {
			async ensureDir(projectId) {
				await send('ensure-project-dir', { projectId });
			},
			async writeDocumentData(projectId, data) {
				await send('write-document-data', { projectId, data });
			},
			async pack(projectId, target) {
				await send('pack-archive', { projectId, target });
			},
			async extract(source) {
				return (await send('extract-archive', { source })).id;
			},
			trace: {
				index: {
					async write(projectId, data) {
						await send('write-trace-index', { projectId, data });
					},
					async read(projectId) {
						return await send('read-trace-index', { projectId });
					}
				},
				data: {
					async write(projectId, traceId, data) {
						await send('write-trace-data', { projectId, traceId, data });
					},
					async read(projectId, traceId) {
						return await send('read-trace-data', { projectId, traceId });
					}
				},
				image: {
					async write(projectId, traceId, image) {
						await send('write-trace-image', { projectId, traceId, image });
					},
					async read(projectId, traceId) {
						return await send('read-trace-image', { projectId, traceId });
					}
				}
			},
			case: {
				async ensureDir(projectId, caseId) {
					await send('ensure-case-dir', { projectId, caseId });
				},
				index: {
					async write(projectId, data) {
						await send('write-case-index', { projectId, data });
					},
					async read(projectId) {
						return await send('read-case-index', { projectId });
					},
				},
				action: {
					index: {
						async write(projectId, caseId, data) {
							await send('write-action-index', { projectId, caseId, data });
						},
						async read(projectId, caseId) {
							const { data } = await send('read-action-index', { projectId, caseId });
							return JSON.parse(data);
						}
					},
					list: {
						async read(projectId, caseId) {
							const { data } = await send('read-action-list', { projectId, caseId });
							return data;					
						}
					},
					async write(projectId, caseId, actionId, data) {
						await send('write-action', { projectId,	caseId, actionId, data });
					},
					async read(projectId, caseId, actionId) {
						const { data } =  await send('read-action', { projectId, caseId, actionId	});
						return JSON.parse(data);
					},
					async delete(projectId, caseId, actionId) {
						await send('delete-action', { projectId, caseId, actionId	});
					}
				}
			}
		}
	}
}; 