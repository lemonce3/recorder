import { api } from './api';

export class ProjectStore {
	constructor(projectId) {
		this.projectId = projectId;
		this.traceIndex = [];
		this.api = api.store.project(projectId);
	}

	async ensureDir() {
		await this.api.ensureDir();
		await this.api.writeDocumentData(JSON.stringify({ id: this.projectId }));
	}

	async loadFromVolume() {		
		const index = await this.getTraceIndex();
		this.traceIndex.splice(0, this.traceIndex.length, ...index);
	}

	async addTrace(trace, image) {
		const traceId = trace.id;

		if (image) {
			await this.api.trace.image.write(traceId, image);
			await this.api.trace.data.write(traceId, JSON.stringify({
				type: 'action',
				data: trace
			}));
		} else {
			await this.api.trace.data.write(traceId, JSON.stringify({
				type: 'action',
				data: trace
			}));
		}

		this.traceIndex.push(trace.id);
		this.$updateIndex();
	}

	async getTraceIndex() {
		return await this.api.trace.index.read();
	}

	async getTraceData(traceId) {
		return await this.api.trace.data.read(traceId);
	}

	async getTraceImage(traceId) {
		return (await this.api.trace.image.read(traceId)).data;
	}

	async $updateIndex() {
		await this.api.trace.index.write(JSON.stringify(this.traceIndex));
	}

	async getCaseIndex() {
		return await this.api.caseIndex.read();
	}

	async updateCaseIndex(caseIndex) {
		await this.api.caseIndex.write(JSON.stringify(caseIndex));
	}
}

export class CaseStore {
	constructor(projectId, caseId) {
		this.actionIndex = [];
		this.api = api.store.project(projectId).case(caseId);
	}
	
	async ensureDir() {
		this.api.ensureDir(this.projectId, this.caseId);
	}

	async loadFromVolume() {
		const index = await this.getActionIndex();
		this.actionIndex.splice(0, this.actionIndex.length, ...index);
	}

	async getActionIndex() {
		return await this.api.action.index.read();
	}

	async getActionList() {
		return await this.api.action.list.read();
	}

	async getAction(id) {
		return await this.api.action.read(id);
	}

	async addAction(id, data) {
		await this.api.action.write(id, data);
		this.actionIndex.push(id);
		this.$updateIndex();
	}

	async insertAction(id, data, prevId) {
		await this.api.action.write(id, data);

		const prevIndex = this.actionIndex.findIndex(actionId => actionId === prevId);
			
		this.actionIndex.splice(prevIndex, 0, id);
		this.$updateIndex();
	}

	async updateAction(id, data) {
		await this.api.action.write(id, data);
	}

	async deleteAction(id, data) {
		await this.api.action.delete(id);

		const index = this.actionIndex.findIndex(actionId => actionId === id);
		this.actionIndex.splice(index, 1);
		this.$updateIndex();
	}

	async $updateIndex() {
		await this.api.action.index.write(JSON.stringify(this.actionIndex));
	}
}