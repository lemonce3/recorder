import { ipcRenderer, remote } from 'electron';
import { ProjectTemp, CaseTemp } from './temp';

const path = remote.require('path');

const EVENT_PREFIX = 'ELECTRON_MAIN_WINDOW::';
const MODULE_NAME = 'FS';

const send = async (channel, message) => new Promise(resolve => {
	ipcRenderer.once(EVENT_PREFIX + MODULE_NAME + channel + 'reply', (event, reply) => resolve(reply));
	ipcRenderer.send(EVENT_PREFIX + MODULE_NAME + channel, message);
});

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

			this.actionTemp = null;
		}

		async init() {
			this.actionTemp = new CaseTemp(this.document.id, this.id);
			await this.actionTemp.init();
		}

		async loadFromTemp() {
			this.$actionList = await this.actionTemp.getActionList();
			console.log(this.$actionList);
			this.$updateIndex();
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

		async createCase(caseName, caseId) {
			if (this.document.caseList[caseId]) {
				return;
			}

			const recordCase = new CaseInterface(this.document, caseName, caseId);
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
			const isOpen = Boolean(this.pathname);

			if (isOpen) {
				const reply = await send('extract-archive', { source: this.pathname });
				console.log(reply);
				this.document.id = reply.id;
			} else {
				this.document.id = getId();
			}

			const projectTemp = this.document.projectTemp = new ProjectTemp(this.document.id);
			await projectTemp.init();

			if (isOpen) {
				await projectTemp.loadTraceTemp();
				const { data } = await projectTemp.loadCaseIndex();
				const caseIndex = JSON.parse(data.toString());
				console.log(caseIndex);
				await Promise.all(caseIndex.map(async ({ name, id }) => {
					const recordCase = await this.IDocument.createCase(name, id);
					await recordCase.init();
					await recordCase.loadFromTemp();
				}));
			}
		}

		async save(asPathname) {
			if (asPathname) {
				await send('pack-archive', this.document.id, asPathname);
			}

			const target = this.pathname ? this.pathname : await getSavePath();
			
			await send('pack-archive', {
				projectId: this.document.id,
				target
			});
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