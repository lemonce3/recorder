export default function preResolve(action) {
	action.extend.property = {
		text: {
			key: 'text',
			value: action.element.text
		},
		tagName: {
			key: 'tagName',
			value: action.element.tagName.toLowerCase()
		}
	};

	if (action.element.value) {
		action.extend.property.value = {
			key: 'value',
			value: action.data.value
		};
	}

	if (action.element.type) {
		action.extend.property.type = {
			key: 'type',
			value: action.element.type.toLowerCase()
		};
	}

	return action;
}