const EventEmitter = require('events');
const _ = require('lodash');
const SAMPLE_CASE_NAME = '__SAMPLE_CASE__';

function base64Encode(string) {
	return Buffer.from(string).toString('base64');
}

function base64Decode(base64) {
	return Buffer.from(base64, 'base64').toString();
}

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

		caseList[base64Encode(SAMPLE_CASE_NAME)] = CaseFactory(SAMPLE_CASE_NAME);
		
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

				return status;
			}
		},
		projectList: {
			async query() {
				return Object.keys(projectList).map(projectPath => projectList[projectPath]);
			},
			async delete() {
				Object.keys(projectList).forEach(projectPath => delete projectList[projectPath]);
			}
		},
		Project: Object.assign(function (projectPath) {
			const project = projectList[projectPath];
			return {
				sampleCase: {
					
				},
				caseList: {
					async query() {
						return Object.keys(project.caseList).map(caseName => project.caseList[caseName]);
					},
					async delete() {
						project.caseList = {};
					}
				},
				Case: Object.assign(function (caseName) {
					const recordCase = project.caseList[caseName];
					return {
						actionList: {
							async query() {
								return recordCase.actionList;
							},
							async delete() {
								recordCase.actionList.splice(0, recordCase.actionList.length);
							},
						action: {
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
			}, {
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
				}
				}),
				traceList: {
					async query() {
						await store.Project(projectPath).traceList.getList();
					}
				},
				trace: {
					async create(payload) {
						await store.Project(projectPath).trace.create(payload);
					},
					async getData(id) {
						await store.Project(projectPath).trace.get(id);
					},
					async getScreenshot(id) {
						await store.Project(projectPath).trace.get(id);
					}
				}
			}
		}, {
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
				
				const project = projectList[projectPath] = ProjectFactory(projectPath);
				const result = _.pick(project, ['projectPath', 'ignoreList']);
				await store.Project.create(result);

				const sampleCase = project.caseList[base64Encode(SAMPLE_CASE_NAME)];
				await store.Project(projectPath).Case.create(_.pick(sampleCase, ['name']));
				return result;
			},
			async update(projectPath, payload) {
				if (projectList[projectPath]) {
					return new Error();
				}
	
				projectList[payload.projectPath] = payload;
			},
			async delete(projectPath) {
				projectList[projectPath] ? delete projectList[projectPath] : new Error();
				
			}
		})
	});
	
	return workspace;
}