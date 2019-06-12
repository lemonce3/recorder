import { getMergeBounds } from './get-merge-bounds';

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

export function margeImage(images) {
	const mergeBounds = getMergeBounds(images);

	canvas.width = mergeBounds.width;
	canvas.height = mergeBounds.height;

	return Promise.all(images.map(image => new Promise(resolve => {
		const { x, y, width, height } = image.bounds;
		const imageElement = new Image(width, height);
		imageElement.src = image.thumbnail.toDataURL();

		requestAnimationFrame(() => {
			context.drawImage(imageElement, x - mergeBounds.x, y - mergeBounds.y, width, height);
			resolve();
		});
	}))).then(() => ({
		dataURL: canvas.toDataURL('image/png'),
		bounds: mergeBounds,
	}));
}