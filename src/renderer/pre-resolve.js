import { nativeImage } from 'electron';

const getId = (length = 5) =>
	Array(length)
		.fill('')
		.map(() =>
			Math.random()
				.toString(16)
				.substring(2, 8)
		)
		.join('-');

export function preResolve(action) {
	action.id = getId();

	const { bounds, dataURL } = action.screenshot;
	const { rect, text } = action.data;

	const offsetRect = {
		x: rect.x - bounds.x,
		y: rect.y - bounds.y,
		width: rect.width,
		height: rect.height
	};

	console.log(bounds, offsetRect, dataURL);

	action.resolve = {
		image: nativeImage
			.createFromDataURL(dataURL)
			.crop(offsetRect)
			.toDataURL(),
		property: {
			text: {
				key: 'text',
				value: text
			},
			tagName: {
				key: 'tagName',
				value: action.data.element.tagName.toLowerCase()
			}
		}
	};

	if (action.data.value) {
		action.resolve.property.value = {
			key: 'value',
			value: action.data.value
		};
	}

	if (action.data.element.type) {
		action.resolve.property.type = {
			key: 'type',
			value: action.data.element.type.toLowerCase()
		}
	}

	return action;
}