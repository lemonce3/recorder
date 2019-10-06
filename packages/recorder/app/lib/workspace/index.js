import axios from 'axios';
import io from 'socket.io';


export default function install(Vue, { store }) {
	const origin = 'http://localhost:10110';

	const agent = axios.create({
		baseURL: origin + '/api/workspace'
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
	websocket.on('update', () => {
		console.log('workspace update');
		if (store) {
			store.dispatch('UPDATE_LAST_UPDATED', Date.now());
		}
	});

	Vue.prototype.$workspace = {
		status: {
			async query() {
				return await agent.get('/status');
			},
			async updateFocus(focus) {
				return await agent.put('/status', {
					data: {
						project: focus.project,
						case: focus.case
					}
				});
			}
		},
		projectList: {
			async query() {
				return await agent.get('/project');
			}
		},
		project: {
			async get(pathBase64) {
				return await agent.get(`/project/${pathBase64}`);
			},
			async create(payload) {
				return await agent.post('/project', {
					data: payload
				});
			},
			async update(pathBase64, payload) {
				return await agent.put(`/project/${pathBase64}`, {
					data: payload
				});
			},
			async delete(pathBase64) {
				return await agent.delete(`/project/${pathBase64}`);
			},
			traceList(pathBase64) {
				return {
					async query() {
						return await agent.get(`/project/${pathBase64}/trace`);
					}
				}
			},
			trace(pathBase64) {
				return {
					async getData(id) {
						return await agent.get(`/project/${pathBase64}/trace/${id}`);
					},
					async getScreenshot(id) {
						return await agent.get(`/project/${pathBase64}/screenshot/${id}`);
					},
					async create(payload) {
						return await agent.post(`/project/${pathBase64}/trace`, {
							data: payload
						});
					}
				}
			},
			caseList(pathBase64) {
				return {
					async query() {
						return await agent.get(`/project/${pathBase64}/case`);
					},
					async delete() {
						return await agent.delete(`/project/${pathBase64}/case`);
					}
				}
			},
			case(pathBase64) {
				return {
					async get(nameBase64) {
						return await agent.get(`/project/${pathBase64}/case/${nameBase64}`);
					},
					async create(payload) {
						return await agent.post(`/project/${pathBase64}/case`, {
							data: payload
						});
					},
					async update(nameBase64, payload) {
						return await agent.put(`/project/${pathBase64}/case/${nameBase64}`, {
							data: payload
						});
					},
					async delete(nameBase64) {
						return await agent.delete(`/project/${pathBase64}/case/${nameBase64}`);
					},
					actionList(nameBase64) {
						return {
							async query() {
								return await agent.get(`/project/${pathBase64}/case/${nameBase64}/action`);
							},
							async delete() {
								return await agent.delete(`/project/${pathBase64}/case/${nameBase64}/action`);
							}
						}
					},
					action(nameBase64) {
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