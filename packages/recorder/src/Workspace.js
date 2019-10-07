const EventEmitter = require('events');
const _ = require('lodash');
const DEFAULT_CASE_NAME = 'PROJECT_DEFAULT_CASE';

module.exports = function Workspace({store}) {
	const workspace = new EventEmitter();
	
	const projectList = {};
	
	const status = {
		recording: true,
		focus: {
			projectPath: '',
			caseName: ''
		}
	};
	
	function actionStringify(action) {
		return JSON.stringify(action);
	}
	
	function CaseFactory(name) {
		return {
			name,
			actionList: []
		}
	}
	
	function ProjectFactory(projectPath) {
		const caseList = {};

		caseList[DEFAULT_CASE_NAME] = CaseFactory(DEFAULT_CASE_NAME);
		
		return {
			projectPath,
			traceList: [],
			caseList,
			ignoreList: []
		}
	}
	
	Object.assign(workspace, {
		workspaceUpdated() {
			workspace.emit('updated');
		},
		status: {
			query() {
				return status;
			},
			updateFocus({ projectPath, caseName }) {
				if (projectList[projectPath] && projectList[projectPath].caseList[caseName]) {
					status.focus.projectPath = projectPath;
					status.focus.caseName = caseName;
				} else {
					return new Error();
				}
			}
		},
		ProjectList: {
			async query() {
				return Object.keys(projectList).map(projectPath => projectList[projectPath]);
			},
			async delete() {
				Object.keys(projectList).forEach(projectPath => delete projectList[projectPath]);
			}
		},
		Project: {
			async get(projectPath) {
				return projectList[projectPath] ? projectList[projectPath] : new Error();	
			},
			async create(payload) {
				if (!payload.projectPath) {
					payload.projectPath = Date.now();
				}

				const { projectPath } = payload;
				
				if (projectList[projectPath]) {
					return new Error();
				}
				
				const project = ProjectFactory(projectPath);
				const defaultCase = project.caseList[DEFAULT_CASE_NAME];
				await store.Project.create(_.pick(project, ['projectPath', 'ignoreList']));
				await store.Project.Case(projectPath).create(_.pick(defaultCase, ['name']));
				projectList[projectPath] = project;
				return project;
			},
			async update(projectPath, payload) {
				if (projectList[projectPath]) {
					return new Error();
				}
	
				projectList[payload.projectPath] = payload;
			},
			async delete(projectPath) {
				projectList[projectPath] ? delete projectList[projectPath] : new Error();
				
			},
			TraceList(projectPath) {
				const project = projectList[projectPath];
				return {
					async query() {
						await store.TraceList(projectPath).getList();
					}
				}
			},
			Trace(projectPath) {
				const project = projectList[projectPath];
				return {
					async create(payload) {
						await store.Project.Trace(projectPath).create(payload);
					},
					async getData(id) {
						await store.Project.Trace(projectPath).get(id);
					},
					async getScreenshot(id) {
						await store.Project.Trace(projectPath).get(id);
					}
				}
			},
			ignoreList(projectPath) {
				const project = projectList[projectPath];
				return {
					async get() {
		
					},
					async update() {
						
					}
				}
			},
			CaseList(projectPath) {
				const project = projectList[projectPath];
				return {
					async query() {
						return project.caseList;
					},
					async delete() {
						project.caseList = {};
					}
			}
			},
			Case(projectPath) {
				const project = projectList[projectPath];
				return {
					async get(caseName) {
						return project.caseList[caseName]
					},
					async create(caseName) {
						project.caseList[caseName] = CaseFactory(caseName);
						
					},
					async update(caseName, payload) {
						project.caseList[caseName] = payload;
						
					},
					async delete(caseName) {
						delete project.caseList[caseName];
						
					},
					ActionList(caseName) {
						const recordCase = project.caseList[caseName];
						return {
							async query() {
								return recordCase.actionList;
							},
							async delete() {
								recordCase.actionList.splice(0, recordCase.actionList.length);
								
							}
						}
					},
					Action(caseName) {
						const recordCase = project.caseList[caseName];
						return {
							async get(id) {
								return recordCase.actionList.find(action => action.id = id);
							},
							async create(payload) {
								recordCase.actionList.push(JSON.stringify(payload));
								console.log(projectList);
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
			}
		}
	});
	
	return workspace;
}