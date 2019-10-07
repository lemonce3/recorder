import axios from 'axios';
import io from 'socket.io';

function base64Encode(string) {
	return btoa(string);
}

function base64Decode(base64) {
	return atob(base64);
}

function ProjectPayload(raw) {
	if (raw.projectPath) {
		raw.projectPath = base64Encode(raw.projectPath);
	}

	return raw;
}

function ProjectResponse(raw) {
	if (raw.projectPath) {
		raw.projectPath = base64Decode(raw.projectPath);
	}

	return raw;
}

function CasePayload(raw) {
	if (raw.caseName) {
		raw.caseName = base64Encode(raw.caseName);
	}

	return raw;
}

function CaseResponse(raw) {
	if (raw.projectPath) {
		raw.projectPath = base64Decode(raw.projectPath);
	}

	return raw;
}

export default function install(Vue, { store }) {
	const origin = 'http://localhost:10110';

	const agent = axios.create({
		baseURL: '/api/workspace'
	});

	const websocket = io(origin);

	Vue.mixin({
		computed: {
			workspaceLastUpdate() {
				if (this.$store) {
					return this.$store.state.workspace.lastUpdated;
				}
				
				return null;
			}
		},
		watch: {
			workspaceLastUpdate() {
				if (this.updateData) {
					this.updateData();
				}
			}
		}
	});

	websocket.on('connect', () => console.log('connect'));
	websocket.on('connection', () => console.log('connection'));
	websocket.on('disconnect', () => console.log('disconnect'));
	websocket.on('error', error => console.log(error));
	websocket.on('connect_error', error => console.log(error));
	websocket.on('error', error => console.log(error));
	websocket.on('updated', () => {
		console.log('workspace update');
		if (store) {
			store.dispatch('UPDATE_LAST_UPDATED', Date.now());
		}
	});

	Vue.prototype.$workspace = {
		status: {
			async query() {
				const { data: status } = await agent.get('/status');

				return status;
			},
			async updateFocus(focus) {
				const { data: status } = await agent.put('/status', {
					data: {
						projectPath: base64Encode(focus.projectPath),
						caseName: base64Encode(focus.caseName)
					}
				});

				status.focus.projectPath = base64Decode(status.focus.projectPath);
				status.focus.caseName = base64Decode(status.focus.caseName);

				return status;
			}
		},
		projectList: {
			async query() {
				
			}
		},
		Project: Object.assign(function (projectPath) {
			const pathBase64 = base64Encode(projectPath);
			return {
				caseList: {
					async query() {
						const { data: caseList } = await agent.get(`/project/${pathBase64}/case`);
						return caseList;
					},
					async delete() {
						const { data: result } = await agent.delete(`/project/${pathBase64}/case`);
						return result;
					}
				},
				Case: Object.assign(function (caseName) {
					const nameBase64 = base64Encode(caseName);
					return {
						actionList: {
							async query() {
								const { data: actionList } = await agent.get(`/project/${pathBase64}/case/${nameBase64}/action/`);
								return actionList;
							},
							async delete() {
								const { data: result } = await agent.delete(`/project/${pathBase64}/case/${nameBase64}/action`);
								return result;
							}
						},
						action: {
							async get(id) {
								const { data: action } = await agent.get(`/project/${pathBase64}/case/${nameBase64}/action/${id}`);
								return action;
							},
							async create(payload) {
								const { data: action } = await agent.post(`/project/${pathBase64}/case/${nameBase64}/action`, {
									data: payload
								});
								return action;
							},
							async update(id, payload) {
								const { data: action } = await agent.put(`/project/${pathBase64}/case/${nameBase64}/action/${id}`, {
									data: payload
								});
								return action;
							},
							async delete(id) {
								const { data: result } = await agent.delete(`/project/${pathBase64}/case/${nameBase64}/action/${id}`);
								return result;
							}
						}
					}
				}, {
					async get(caseName) {
						const nameBase64 = base64Encode(caseName);
						const { data: recordCase } = await agent.get(`/project/${pathBase64}/case/${nameBase64}`);

						return CaseResponse(recordCase);
					},
					async create(payload) {
						const { data: recordCase } = await agent.post(`/project/${pathBase64}/case`, {
							data: CasePayload(payload)
						});

						return CaseResponse(recordCase);
					},
					async update(caseName, payload) {
						const nameBase64 = base64Encode(caseName);
						const { data: recordCase } = await agent.put(`/project/${pathBase64}/case/${nameBase64}`, {
							data: CasePayload(payload)
						});

						return CaseResponse(recordCase);
					},
					async delete(caseName) {
						const nameBase64 = base64Encode(caseName);
						const { data: result } = await agent.delete(`/project/${pathBase64}/case/${nameBase64}`);
						return result;
					}
				}),
				traceList: {
					async query() {
						const { data: traceList } = await agent.get(`/project/${pathBase64}/trace`);
						return traceList;
					}
				},
				trace: {
					async getData(id) {
						const { data: traceData } = await agent.get(`/project/${pathBase64}/trace/data/${id}`);
						return traceData;
					},
					async getScreenshot(id) {
						const { data: traceScreenshot } = await agent.get(`/project/${pathBase64}/trace/screenshot/${id}`);
						return traceScreenshot;
					},
					async create(payload) {
						const { data: trace } = await agent.post(`/project/${pathBase64}/trace`, {
							data: payload
						});

						return trace;
					}
				}
			}
		}, {
			async get(pathname) {
				const pathBase64 = base64Encode(pathname);
				const { data: project } = await agent.get(`/project/${pathBase64}`);
				return ProjectResponse(project);
			},
			async create(payload) {
				const { data: project } = await agent.post('/project', {
					data: ProjectPayload(payload)
				});
	
				return ProjectResponse(project);
			},
			async patch(pathname, payload) {
				const pathBase64 = base64Encode(pathname);
				const { data: project } = await agent.patch(`/project/${pathBase64}`, {
					data: ProjectPayload(payload)
				});

				return ProjectResponse(project);
			},
			async delete(pathname) {
				const pathBase64 = base64Encode(pathname);
				const { data: result } = await agent.delete(`/project/${pathBase64}`);
				return result;
			}
		})
	};
}