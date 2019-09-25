'use strict';

module.exports = {
	Action(store) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					data: { type: 'string' }
				}
			},
			methods: {
				async create() {
					await store.Action.create();
				},
				async get() {
					await store.Action.get();
				},
				async update() {
					await store.Action.update();
				},
				async delete() {
					await store.Action.delete();
				}
			}
		}
	},
	ActionList(store) {
		return {
			schemas: { type: 'model', symbol: 'Action' },
			methods: {
				async query() {
					await store.ActionList.query();
				},
				async delete() {
					await store.ActionList.delete();
				}
			}
		}
	}
}