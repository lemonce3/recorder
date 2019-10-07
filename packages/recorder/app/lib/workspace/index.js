import axios from 'axios';
import io from 'socket.io';

function base64Encode(string) {
	return btoa(string);
}

function base64Decode(base64) {
	return atob(base64);
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
				const { data: result } = await agent.put('/status', {
					data: {
						projectPath: focus.projectPath,
						caseName: focus.caseName
					}
				});

				return result;
			}
		},
		projectList: {
			async query() {
				const { data: projectList } = await agent.get('/project');

				return projectList;
			}
		},
		project: {
			async get(pathname) {
				const pathBase64 = base64Encode(pathname);
				const { data: project } = await agent.get(`/project/${pathBase64}`);
				return project;
			},
			async create(payload) {
				const { data: project } = await agent.post('/project', {
					data: payload
				});

				return project;
			},
			async patch(pathname, payload) {
				const pathBase64 = base64Encode(pathname);
				const { data: project } = await agent.patch(`/project/${pathBase64}`, {
					data: payload
				});
				return project;
			},
			async delete(pathname) {
				const pathBase64 = base64Encode(pathname);
				const { data: result } = await agent.delete(`/project/${pathBase64}`);
				return result;
			},
			traceList(pathname) {
				const pathBase64 = base64Encode(pathname);
				return {
					async query() {
						return await agent.get(`/project/${pathBase64}/trace`);
					}
				}
			},
			trace(pathname) {
				const pathBase64 = base64Encode(pathname);
				return {
					async getData(id) {
						return await agent.get(`/project/${pathBase64}/trace/data/${id}`);
					},
					async getScreenshot(id) {
						return await agent.get(`/project/${pathBase64}/trace/screenshot/${id}`);
					},
					async create(payload) {
						return await agent.post(`/project/${pathBase64}/trace`, {
							data: payload
						});
					}
				}
			},
			caseList(pathname) {
				const pathBase64 = base64Encode(pathname);
				return {
					async query() {
						return await agent.get(`/project/${pathBase64}/case`);
					},
					async delete() {
						return await agent.delete(`/project/${pathBase64}/case`);
					}
				}
			},
			case(pathname) {
				const pathBase64 = base64Encode(pathname);
				return {
					async get(caseName) {
						const nameBase64 = base64Encode(caseName);
						return await agent.get(`/project/${pathBase64}/case/${nameBase64}`);
					},
					async create(payload) {
						return await agent.post(`/project/${pathBase64}/case`, {
							data: payload
						});
					},
					async update(caseName, payload) {
						const nameBase64 = base64Encode(caseName);
						return await agent.put(`/project/${pathBase64}/case/${nameBase64}`, {
							data: payload
						});
					},
					async delete(caseName) {
						const nameBase64 = base64Encode(caseName);
						return await agent.delete(`/project/${pathBase64}/case/${nameBase64}`);
					},
					actionList(caseName) {
						const nameBase64 = base64Encode(caseName);
						return {
							async query() {
								return await agent.get(`/project/${pathBase64}/case/${nameBase64}/action/`);
							},
							async delete() {
								return await agent.delete(`/project/${pathBase64}/case/${nameBase64}/action`);
							}
						}
					},
					action(caseName) {
						const nameBase64 = base64Encode(caseName);
						return {
							async get(id) {
								return await agent.get(`/project/${pathBase64}/case/${nameBase64}/action/${id}`);
							},
							async create(payload) {
								return await agent.post(`/project/${pathBase64}/case/${nameBase64}/action`, {
									data: payload
								});
							},
							async update(id, payload) {
								return await agent.put(`/project/${pathBase64}/case/${nameBase64}/action/${id}`, {
									data: payload
								});
							},
							async delete(id) {
								return await agent.delete(`/project/${pathBase64}/case/${nameBase64}/action/${id}`);
							}
						}
					}
				}
			}
		}
	};
}