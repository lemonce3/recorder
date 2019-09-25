const EventEmiter = require('events');


module.exports = function Workspace({store}) {
	const workspace = new EventEmiter();
	
	const projectList = {};
	
	const status = {
		focus: {
			project: '',
			case: ''
		}
	};
	
	function workspaceUpdated() {
		workspace.emit('update');
	}
	
	function actionStringify(action) {
		return JSON.stringify(action);
	}
	
	function CaseFactory(name) {
		return {
			name,
			actionList: []
		}
	}
	
	function CaseInterface(recordCase) {
		return {
			ActionList: {
				async query() {
					return recordCase.actionList.map(action => JSON.parse(action));
				},
				async delete() {
					recordCase.actionList.splice(0, recordCase.actionList.length);
				}
			},
			Action: {
				async get(id) {
					return recordCase.actionList.find(action => action.id = id);
				},
				async create(payload) {
					recordCase.actionList.push(JSON.stringify(payload));
				},
				async update(id, payload) {
					const index = recordCase.actionList.findIndex(action => action.id = id);
					if (!index) {
						return new Error();
					}
	
					recordCase.actionList[index] = payload;
				},
				async delete(id) {
					const index = recordCase.actionList.findIndex(action => action.id = id);
					if (!index) {
						return new Error();
					}
	
					delete recordCase.actionList[index];
				}
			}
		}
	}
	
	
	function ProjectFactory(PathBase64) {
		return {
			PathBase64,
			caseList: {},
			ignoreList: []
		}
	}
	
	function ProjectInterface(project) {
		return {
			CaseList: {
				async query() {
					
				},
				async delete() {
	
				}
			},
			Case: {
				async get(nameBase64) {
					CaseInterface(project.caseList[nameBase64]);
				},
				async create(nameBase64) {
					project.caseList[nameBase64] = CaseFactory(nameBase64);
				},
				async update(nameBase64, payload) {
					project.caseList[nameBase64] = payload;
				},
				async delete(nameBase64) {
					delete project.caseList[nameBase64];
				}
			},
			TraceList: {
				async query() {
	
				}
			},
			Trace: {
				async create() {
	
				},
				async getData() {
	
				},
				async getScreenshot() {
	
				}
			},
			ignoreList: {
				async get() {
	
				},
				async update() {
	
				}
			}
		}
	}
	
	Object.assign(workspace, {
		status: {
			query() {
				return {
					projectPath: status.focus.project,
					caseName: status.focus.case
				}
			},
			updateFocus({ projectPath, caseName }) {
				if (projectList[projectPath] && projectList[projectPath][caseName]) {
					status.focus.project = projectPath;
					status.focus.caseName = caseName;
				} else {
					return new Error();
				}
			}
		},
		ProjectList: {
			async query() {
				return Object.keys(projectList).map(PathBase64 => ProjectInterface(projectList[PathBase64]));
			},
			async delete() {
				Object.keys(projectList).forEach(PathBase64 => delete projectList[PathBase64]);
			}
		},
		Project: {
			async get(PathBase64) {
				return projectList[PathBase64] ? ProjectInterface(projectList[PathBase64]) : new Error();
			},
			async create(payload) {
				if (projectList[payload.PathBase64]) {
					return new Error();
				}
	
				projectList[payload.PathBase64] = ProjectFactory(payload.PathBase64);
			},
			async update(pathBase64, payload) {
				if (projectList[PathBase64]) {
					return new Error();
				}
	
				projectList[payload.PathBase64] = payload;
			},
			async delete(PathBase64) {
				return projectList[PathBase64] ? delete projectList[PathBase64] : new Error();
			}
		}
	});
	
	return workspace;
}