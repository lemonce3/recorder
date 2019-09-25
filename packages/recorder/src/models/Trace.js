'use strict';

module.exports = {
	Trace(store) {
		return {
			schemas: {
				type: 'object',
				properties: {
					type: { type: 'string' },
					data: { type: 'string' }
				}
			},
			methods: {
				async create() {
	
				},
				async query() {
	
				}
			}
		}
	},
	TraceList(store) {
		return {
			schemas: { type: 'model', symbol: 'Trace' },
			methods: {
				async query() {

				}
			}
		}
	}
}