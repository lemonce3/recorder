import { api } from './api';

export class ProjectStore {
	constructor(projectId) {
		this.projectId = projectId;
		this.traceIndex = [];
	}

	async ensureDir() {
		const projectId = this.projectId;
		await api.fs.project.ensureDir(projectId);
		await api.fs.project.writeDocumentData(projectId, JSON.stringify({ id: projectId }));
	}

	async loadFromVolume() {		
		const { data } = await this.getTraceIndex();
		const index = JSON.stringify(data.toString());
		this.traceIndex.splice(0, this.traceIndex.length, ...index);
	}

	async addTrace(trace, image) {
		const projectId = this.projectId;
		const traceId = trace.id;

		if (image) {
			await api.fs.project.trace.image.write(projectId, traceId, image);
			await api.fs.project.trace.data.write(projectId, traceId, JSON.stringify({
				type: 'action',
				data: trace
			}));
		} else {
			await api.fs.project.trace.data.write(projectId, traceId, JSON.stringify({
				type: 'action',
				data: trace
			}));
		}

		this.traceIndex.push(trace.id);
		this.$updateIndex();
	}

	async getTraceIndex() {
		return await api.fs.project.trace.index.read(this.projectId);
	}

	async getTraceData(traceId) {
		return await api.fs.project.trace.data.read(this.projectId, traceId);
	}

	async getTraceImage(traceId) {
		return await api.fs.project.trace.image.read(this.projectId, traceId);
	}

	async $updateIndex() {
		await api.fs.project.trace.index.write(this.projectId, JSON.stringify(this.traceIndex));
	}

	async getCaseIndex() {
		const { data } = await api.fs.project.case.index.read(this.projectId);
		return JSON.parse(data.toString());
	}

	async updateCaseIndex(caseIndex) {console.log(caseIndex, 'hhh');
		await api.fs.project.case.index.write(this.projectId, JSON.stringify(caseIndex));
	}
}

export class CaseStore {
	constructor(projectId, caseId) {
		this.projectId = projectId;
		this.caseId = caseId;
		this.actionIndex = [];
	}
	
	async ensureDir() {
		api.fs.project.case.ensureDir(this.projectId, this.caseId);
	}

	async loadFromVolume() {
		const { data } = await this.getActionIndex();
		const index = JSON.stringify(data.toString());
		this.actionIndex.splice(0, this.actionIndex.length, ...index);
	}

	async getActionIndex() {
		const data = await api.fs.project.case.action.index.read(this.projectId, this.caseId);
		return JSON.parse(data);
	}

	async getActionList() {
		const data = await api.fs.project.case.action.list.read(this.projectId, this.caseId);
		return data;
	}

	async getAction(id) {
		const data = await api.fs.project.case.action.read(this.projectId, this.caseId, id);
		return JSON.parse(data);
	}

	async addAction(action) {
		await api.fs.project.case.action.write(this.projectId, this.caseId, action.id, JSON.stringify(action));
		this.actionIndex.push(action.id);
		this.$updateIndex();
	}

	async insertAction(action, prevId) {
		await api.fs.project.case.action.write(this.projectId, this.caseId, action.id, JSON.stringify(action));

		const prevIndex = this.actionIndex.findIndex(id => id === prevId);
			
		this.actionIndex.splice(prevIndex, 0, action.id);
		this.$updateIndex();
	}

	async updateAction(action) {
		await api.fs.project.case.action.write(this.projectId, this.caseId, action.id, JSON.stringify(action));
	}

	async deleteAction(action) {
		await api.fs.project.case.action.delete(this.projectId, this.caseId, action.id);

		const index = this.$actionList.findIndex(id => id === action.id);
		this.actionIndex.splice(index, 1);
		this.$updateIndex();
	}

	async $updateIndex() {
		await api.fs.project.case.action.index.write(this.projectId, this.caseId, JSON.stringify(this.actionIndex));
	}
}