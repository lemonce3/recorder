import fastJson from 'fast-json-stringify';

const actionListSchema = {
	title: 'actionList',
	type: 'array',
	items: {
		title: 'action',
		type: 'object',
		properties: {
			id: {
				type: 'string'
			},
			type: {
				type: 'string'
			},
			data: {
				type: 'object',
				properties: {
					path: {
						type: 'string'
					},
					abstract: {
						type: 'string'
					},
					text: {
						type: 'string'
					},
					value: {
						type: 'string'
					},
					selectedIndex: {
						type: 'number'
					},
					label: {
						type: 'string'
					}
				}
			},
			element: {
				type: 'object',
				properties: {
					localName: {
						type: 'string'
					},
					type: {
						type: 'string'
					}
				}
			}
		}
	}
};


const stringify = fastJson(actionListSchema);

export function actionToBuffer(actionList) {
	return Buffer.from(stringify(actionList));
}

export function bufferToAction(buffer) {
	return JSON.parse(buffer.toString());
}