'use strict';

module.exports = {
	Case(store) {
		return {
			schemas: {
				type: 'object',
				properties: {
					name: '',
					createAt: '',
					updateAt: ''
				}
			},
			methods: {
				async create() {
					await store.Case.create();
				},
				async get() {
					await store.Case.get();
				},
				async update() {
					await store.Case.update();
				},
				async delete() {
					await store.Case.delete();
				}
			}
		}
	},
	CaseList(store) {
		return {
			schemas: { type: 'model', symbol: 'Case' },
			methods: {
				async query() {
					await store.CaseList.query();
				},
				async delete() {
					await store.CaseList.delete();
				}
			}
		}
	}
}