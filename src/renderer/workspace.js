import { ipcRenderer, remote } from 'electron';
import { tempPath, ProjectTemp, CaseTemp } from './temp';

const path = remote.require('path');

const EVENT_PREFIX = 'ELECTRON_CROPER_WINDOW::';

const lemonceRecorderFilter = {
	name: 'LemonceRecorderFile',
	extensions: ['lcrc']
};

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

const packArchive = (projectId, target) => {console.log(projectId, target);
	return new Promise((resolve, reject) => {
		ipcRenderer.send(EVENT_PREFIX + 'pack-archive', { 
			source: path.join(tempPath, projectId),
			target,
		});

		ipcRenderer.once(EVENT_PREFIX + 'pack-archive-reply', (event, args) => {
			resolve(args);
		});
	});
};

const extractArchive = (source, projectId) => {console.log(source);
	return new Promise((resolve, reject) => {
		ipcRenderer.send(EVENT_PREFIX + 'extract-archive', {
			source,
			tempPath
		});
	
		ipcRenderer.once(EVENT_PREFIX + 'extract-archive-reply', (event, args) => {
			resolve(args);
		});
	});
};

function getNewDocumentName(prefix) {
	return `${prefix}${documentCounter++}`;
}

// --------------------------

function install(Vue) {
	const projectIndex = [];
	const projectList = {};

	class CaseInterface {
		constructor(name, document) {
			this.actionIndex = [];
			this.$actionList = [];
			this.id = getId();
			this.name = name;
			this.document = document;

			this.actionTemp = null;
		}

		async init() {
			this.actionTemp = new CaseTemp(this.document.id, this.id);
			await this.actionTemp.init();
		}

		async loadFromTemp() {
			const indexList = this.actionTemp.getActionIndex();

			this.$actionList = await Promise.all(indexList.map(id => this.actionTemp.getAction(id)));
		}

		get actionList() {
			return JSON.stringify(this.$actionList);
		}

		async addAction(action) {
			this.$actionList.push(action);
			await this.actionTemp.addAction(action);
			this.$updateIndex();
		}

		async insertAction(action, prevId) {
			const prevIndex = this.$actionList.findIndex(action => action.id === prevId);
			
			this.$actionList.splice(prevIndex, 0, action);
			await this.actionTemp.insertAction(action, prevId);
			this.$updateIndex();
		}

		async updateAction(action) {
			const index = this.$actionList.findIndex(action => action.id === action.id);
			this.$actionList.splice(index, 1, action);
			await this.actionTemp.updateAction(action);
		}

		async deleteAction(action) {
			const index = this.$actionList.findIndex(action => action.id === action.id);
			this.$actionList.splice(index, 1);
			await this.actionTemp.deleteAction(action);
			this.$updateIndex();
		}

		$updateIndex() {
			this.actionIndex.splice(0, this.actionIndex.length, ...this.$actionList.map(action => action.id));console.log(this.actionIndex);
		}
	}

	class DocumentInterface {
		constructor(document) {
			this.document = document;
		}

		async createCase(caseName) {
			if (this.document.caseList[caseName]) {
				return;
			}

			const recordCase = new CaseInterface(caseName, this.document);
			await recordCase.init();

			this.document.caseList[recordCase.id] = recordCase;
			
			const result = Object.keys(this.document.caseList).map(id => {
				const item = this.document.caseList[id];
				return { name: item.name, id: item.id };
			});

			console.log(result);
			this.document.projectTemp.updateCaseIndex(result);

			return recordCase;
		}

		async addTrace(trace, image) {
			this.document.projectTemp.addTrace(trace, image);
		}

		async getTraceIndex() {
			this.document.projectTemp.getTraceIndex();
		}

		async getTraceData(id) {
			this.document.projectTemp.getTraceData(id);
		}

		async getTraceImage(id) {
			this.document.projectTemp.getTraceImage(id);
		}
	}

	class Project {
		constructor(options) {
			const { pathname = null } = options;
			console.log(options, pathname);
			this.document = {
				name: pathname ? path.basename(pathname) : getNewDocumentName(),
				projectTemp: null,
				caseList: {}
			};
			
			this.pathname = pathname;
		}

		get IDocument() {
			return new DocumentInterface(this.document);
		}

		async init() {
			if (this.pathname) {
				const { id } = await extractArchive(this.pathname);
				this.document.id = id;
			} else {
				this.document.id = getId();
			}

			const projectTemp = this.document.projectTemp = new ProjectTemp(this.document.id);
			await projectTemp.init();
		}

		async save(asPathname) {
			if (asPathname) {
				await packArchive(this.document.id, asPathname);
			}

			const targetPath = this.pathname ? this.pathname : await getSavePath();
			
			await packArchive(this.document.id, targetPath);
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
				await project.init();

				projectList[project.document.id] = project;
				projectIndex.push(project.document.name);

				return project;
			}
		},
		getter: {
			actionIndex(projectId, caseId) {
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