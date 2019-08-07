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
	store: {
		extract: async source => (await send('extract-archive', { source })).id,
		project(projectId) {
			return {
				ensureDir: async () => await send('ensure-project-dir', { projectId }),
				writeDocumentData: async data => await send('write-document-data', { projectId, data }),
				pack: async target => await send('pack-archive', { projectId, target }),
				caseIndex: {
					write: async data => await send('write-case-index', { projectId, data }),
					read: async () => JSON.parse((await send('read-case-index', { projectId })).data),
				},
				trace: {
					index: {
						write: async data => await send('write-trace-index', { projectId, data }),
						read: async () => JSON.parse((await send('read-trace-index', { projectId })).data)
					},
					data: {
						write: async (traceId, data) => await send('write-trace-data', { projectId, traceId, data }),
						read: async traceId => JSON.parse((await send('read-trace-data', { projectId, traceId })).data)
					},
					image: {
						write: async (traceId, image) => await send('write-trace-image', { projectId, traceId, image }),
						read: async traceId => await send('read-trace-image', { projectId, traceId })
					}
				},
				case(caseId) {
					return {
						ensureDir: async () => await send('ensure-case-dir', { projectId, caseId }),
						action: {
							index: {
								write: async data => await send('write-action-index', { projectId, caseId, data }),
								read: async () => JSON.parse((await send('read-action-index', { projectId, caseId })).data),
							},
							list: {
								read: async () => (await send('read-action-list', { projectId, caseId })).data
							},
							write: async (actionId, data) => await send('write-action', { projectId,	caseId, actionId, data }),
							read: async actionId => JSON.parse((await send('read-action', { projectId, caseId, actionId	})).data),
							delete: async actionId => await send('delete-action', { projectId, caseId, actionId	})
						}
					};
				}
			};
		}
	}
};

