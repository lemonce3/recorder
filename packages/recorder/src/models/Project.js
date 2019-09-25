'use strict';

module.exports = {
	Project(store) {
		return {
			schemas: {
				type: 'object',
				properties: {
					hash: '',
					name: '',
					traceArchived: { type: 'boolean' },
					ignoreList: {
						type: 'array',
						items: {
							type: 'string'
						}
					},
					createAt: { type: 'date' },
					updateAt: { type: 'date' }
				}
			},
			methods: {
				async create(payload) {
					await store.Project.create(payload);
				},
				async get() {
					await store.Project.get();
				},
				async update() {
					await store.Project.update();
				},
				async delete() {
					await store.Project.delete();
				}
			}
		}
	},
	ProjectList(store) {
		return {
			schemas: {
				type: 'array',
				item: { type: 'model', symbol: 'Project' }
			},
			methods: {
				async query() {
					await store.ProjectList.query();
				},
				async delete() {
					await store.ProjectList.delete();
				}
			}
		}
	}
}