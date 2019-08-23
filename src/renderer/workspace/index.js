import { remote } from 'electron';
import { ProjectStore, CaseStore } from './store';
import { api } from './api';

const path = remote.require('path');

const lemonceRecorderFilter = {
	name: 'LemonceRecorderFile',
	extensions: ['lcrc']
};

function actionStringify(action) {
	return JSON.stringify(action);
}

const getId = (length = 5) =>
	Array(length)
		.fill('')
		.map(() =>
			Math.random()
				.toString(16)
				.substring(2, 8)
		)
		.join('-');

let documentCounter = 1;

function getSavePath() {
	return new Promise(resolve => remote.dialog.showSaveDialog({ filters: [lemonceRecorderFilter] }, resolve));
}

function getNewDocumentName(prefix) {
	return `${prefix}${documentCounter++}`;
}

// --------------------------

function install(Vue) {
	const projectIndex = [];
	const projectList = {};

	class CaseInterface {
		constructor(document, name, id) {
			this.actionIndex = [];
			this.$actionList = [];
			this.id = id ? id : getId();
			this.name = name;
			this.document = document;

			this.caseStore = null;
		}

		async ensureDir() {
			this.caseStore = new CaseStore(this.document.id, this.id);
			await this.caseStore.ensureDir();
		}

		async loadFromVolume() {
			this.caseStore = new CaseStore(this.document.id, this.id);
			await this.caseStore.loadFromVolume();
			const actionList = await this.caseStore.getActionList();
			this.$actionList = actionList.map(action => ({id: action, data: JSON.stringify(action)}));
			console.log(this.$actionList);
			this.$updateIndex();
		}

		get actionList() {
			return this.$actionList.map(action => JSON.parse(action.data));
		}

		async addAction(action) {
			const data = actionStringify(action);
			this.$actionList.push({
				id: action.id,
				data
			});
			await this.caseStore.addAction(action.id, data);
			this.$updateIndex();
		}

		async insertAction(action, prevId) {
			const prevIndex = this.$actionList.findIndex(item => item.id === prevId);
			const data = actionStringify(action);

			this.$actionList.splice(prevIndex, 0, {
				id: action.id,
				data
			});

			await this.caseStore.insertAction(action.id, data, prevId);
			this.$updateIndex();
		}

		async updateAction(action) {
			const index = this.$actionList.findIndex(item => item.id === action.id);
			const data = actionStringify(action);

			this.$actionList.splice(index, 1, {
				id: action.id,
				data
			});

			await this.caseStore.updateAction(action.id, data);
			this.$updateIndex();
		}

		async deleteAction(action) {
			const index = this.$actionList.findIndex(item => item.id === action.id);
			this.$actionList.splice(index, 1);
			await this.caseStore.deleteAction(action.id, action);
			this.$updateIndex();
		}

		async emptyAction() {
			await this.caseStore.api.action.empty();
			this.$actionList.splice(0, this.$actionList.length);
			this.$updateIndex();
		}

		$updateIndex() {
			this.actionIndex.splice(0, this.actionIndex.length, ...this.$actionList.map(action => action.id));
		}
	}

	class DocumentInterface {
		constructor(document) {
			this.document = document;
		}

		async createCase(caseName, caseId) {
			if (this.document.caseList[caseId]) {
				return;
			}

			const recordCase = new CaseInterface(this.document, caseName, caseId);
			await recordCase.ensureDir();

			this.document.caseList[recordCase.id] = recordCase;
			await this.$updateCaseIndex();

			return recordCase;
		}

		async loadCase(caseName, caseId) {
			const recordCase = new CaseInterface(this.document, caseName, caseId);
			await recordCase.loadFromVolume();
			this.document.caseList[recordCase.id] = recordCase;

			return recordCase;
		}

		async addTrace(trace, image) {
			this.document.projectStore.addTrace(trace, image);
		}

		async getTraceIndex() {
			return await this.document.projectStore.getTraceIndex();
		}

		async getTraceData(id) {
			return await this.document.projectStore.getTraceData(id);
		}

		async getTraceImage(id) {
			return await this.document.projectStore.getTraceImage(id);
		}

		async $updateCaseIndex() {
			const result = Object.keys(this.document.caseList).map(id => {
				const item = this.document.caseList[id];
				return { name: item.name, id: item.id };
			});

			console.log(result);
			this.document.projectStore.updateCaseIndex(result);
		}
	}

	class Project {
		constructor(options) {
			const { pathname = null } = options;
			console.log(options, pathname);
			this.document = {
				name: pathname ? path.basename(pathname) : getNewDocumentName('录制工程'),
				projectStore: null,
				caseList: {}
			};
			
			this.pathname = pathname;
		}

		get IDocument() {
			return new DocumentInterface(this.document);
		}

		async loadFromVolume() {
			const documentId = await api.store.extract(this.pathname);
			console.log(documentId);
			this.document.id = documentId;

			const projectStore = this.document.projectStore = new ProjectStore(this.document.id);
			await projectStore.loadFromVolume();

			const caseIndex = await projectStore.getCaseIndex();
			console.log('caseIndex', caseIndex);
			await Promise.all(caseIndex.map(async ({ name, id }) => {
				await this.IDocument.loadCase(name, id);
			}));
		}

		async ensureDir() {
			this.document.id = getId();
			const projectStore = this.document.projectStore = new ProjectStore(this.document.id);
			await projectStore.ensureDir();
		}

		async save() {
			const target = this.pathname ? this.pathname : await getSavePath();
			await api.store.project(this.document.id).pack(target);
		}

		async saveAs() {
			const target = await getSavePath();
			await api.store.project(this.document.id).pack(target);
		}

		unload() {
			projectList.splice(projectList.findIndex(project => project === this), 1);
			projectIndex.splice(projectIndex.findIndex(id => id === this.pathname));
		}
	}

	Vue.prototype.$workspace = {
		project: {
			index: projectIndex,
			list: projectList,
			async create(pathname) {
				const project = new Project({ pathname });
				await project.ensureDir();

				projectList[project.document.id] = project;
				projectIndex.push(project.document.name);

				return project;
			},
			async openFile(pathname) {
				const project = new Project({pathname});
				await project.loadFromVolume();

				projectList[project.document.id] = project;
				projectIndex.push(project.document.name);

				return project;
			}
		},
		getter: {
			actionIndex(projectId, caseId) {console.log(projectId, caseId, projectList);
				return projectList[projectId].document.caseList[caseId].actionIndex;
			},
			actionList(projectId, caseId) {
				return projectList[projectId].document.caseList[caseId].actionList;
			}
		}
	};
}

export default {
	install
};