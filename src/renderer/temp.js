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

export class ProjectTemp {
	constructor(projectId) {
		this.projectId = projectId;
		this.traceIndex = [];
	}

	async init() {
		const projectId = this.projectId;
		await send('ensure-project-dir', { projectId });
		await send('write-document-data', { projectId, data: JSON.stringify({ id: projectId })});
	}

	async addTrace(trace, image) {
		const projectId = this.projectId;
		const traceId = trace.id;

		if (image) {
			await send('write-trace-image', { projectId, traceId, image });
			await send('write-trace-data', { projectId, traceId, data: JSON.stringify({
				type: 'action',
				data: trace
			})
			});
		} else {
			await send('write-trace-data', { projectId, traceId, data: JSON.stringify({
				type: 'snapshot',
				data: trace
			})
			});
		}

		this.traceIndex.push(trace.id);
		this.$updateIndex();
	}

	async getTraceIndex() {
		return await send('read-trace-index', { projectId: this.projectId });
	}

	async loadTraceTemp() {
		const { data } = await this.getTraceIndex();
		const index = JSON.stringify(data.toString());
		this.traceIndex.splice(0, this.traceIndex.length, ...index);
		return index;
	}

	async getTraceData(traceId) {
		return await send('read-trace-data', { projectId: this.projectId, traceId });
	}

	async getTraceImage(traceId) {
		return await send('read-trace-image', { projectId: this.projectId, traceId });
	}

	async $updateIndex() {
		await send('write-trace-index', { projectId: this.projectId, data: JSON.stringify(this.traceIndex) });
	}

	async loadCaseIndex() {
		return await send('read-case-index', { projectId: this.projectId });
	}

	async updateCaseIndex(caseIndex) {
		await send('write-case-index', { projectId: this.projectId, data: JSON.stringify(caseIndex) });
	}
}

export class CaseTemp {
	constructor(projectId, caseId) {
		this.projectId = projectId;
		this.caseId = caseId;
		this.actionIndex = [];
	}
	
	async init() {
		await send('ensure-case-dir', { projectId: this.projectId, caseId: this.caseId });
	}

	async getActionIndex() {
		const { data } = await send('read-action-index', { projectId: this.projectId, caseId: this.caseId });
		return JSON.parse(data);
	}

	async getActionList() {
		const { data } = await send('read-action-list', { projectId: this.projectId, caseId: this.caseId });
		return data;
	}

	async getAction(id) {
		const { data } =  await send('read-action', {
			projectId: this.projectId,
			caseId: this.caseId,
			actionId: id
		});
		return JSON.parse(data);
	}

	async addAction(action) {
		await send('write-action', {
			projectId: this.projectId,
			caseId: this.caseId,
			actionId: action.id,
			data: JSON.stringify(action)
		});

		this.actionIndex.push(action.id);
		this.$updateIndex();
	}

	async insertAction(action, prevId) {
		await send('write-action', {
			projectId: this.projectId,
			caseId: this.caseId,
			actionId: action.id,
			data: JSON.stringify(action)
		});

		const prevIndex = this.actionIndex.findIndex(id => id === prevId);
			
		this.actionIndex.splice(prevIndex, 0, action.id);
		this.$updateIndex();
	}

	async updateAction(action) {
		await send('write-action', {
			projectId: this.projectId,
			caseId: this.caseId,
			actionId: action.id,
			data: JSON.stringify(action)
		});
	}

	async deleteAction(action) {
		await send('delete-action', {
			projectId: this.projectId,
			caseId: this.caseId,
			actionId: action.id
		});

		const index = this.$actionList.findIndex(id => id === action.id);
		this.actionIndex.splice(index, 1);
		this.$updateIndex();
	}

	async $updateIndex() {
		await send('write-action-index', {
			projectId: this.projectId,
			caseId: this.caseId,
			data: JSON.stringify(this.actionIndex)
		});
	}
}