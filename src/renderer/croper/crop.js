import { Resizable } from '../../../../../webVdesk/ui-native';

import './style.css';

function drawCropAreaOnCanvas(canvas, rect) {
	const context = canvas.getContext('2d');

	context.fillStyle = 'rgba(0, 0, 0, 0.5)';
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillRect(0, 0, canvas.width, canvas.height);

	if (rect) {
		const { x, y, width, height } = rect;
		context.clearRect(x, y, width, height);
	}
}

let selecting = false;
let cropArea = null;

const backgroundCanvas = document.createElement('canvas');

document.body.appendChild(backgroundCanvas);
drawCropAreaOnCanvas(backgroundCanvas);

function reset() {
	selecting = false;
	if (cropArea) {
		cropArea.remove();
		cropArea = null;
	}
	drawCropAreaOnCanvas(backgroundCanvas);
}

function onMousedown(event) {
	const finishEvent = new CustomEvent('crop-result', { detail: { rect: null } });

	if (event.button === 2 && event.ctrlKey) {
		document.dispatchEvent(finishEvent);
		reset();
		return;
	}

	if (event.button !== 0) {
		return;
	}

	if (selecting) {
		return;
	}


	selecting = true;

	cropArea = document.createElement('div');
	cropArea.id = 'crop-area';
	new Resizable(cropArea);
	const start = {
		x: event.screenX,
		y: event.screenY
	};

	cropArea.style.left = start.x + 'px';
	cropArea.style.top = start.y + 'px';
	document.body.appendChild(cropArea);

	function onVdResize(event) {
		drawCropAreaOnCanvas(backgroundCanvas, event.target.getBoundingClientRect());
	}

	function onMousemove(event) {
		const { clientX: x, clientY: y } = event;
		if (x > start.x) {
			cropArea.style.left = start.x + 'px';
			cropArea.style.width = x - start.x + 'px';
		} else {
			cropArea.style.left = x + 'px';
			cropArea.style.width = start.x - x + 'px';
		}

		if (y > start.y) {
			cropArea.style.top = start.y + 'px';
			cropArea.style.height = y - start.y + 'px';
		} else {
			cropArea.style.top = y + 'px';
			cropArea.style.height = start.y - y + 'px';
		}

		drawCropAreaOnCanvas(backgroundCanvas, cropArea.getBoundingClientRect());
	}

	function onKeydown(event) {
		if (event.code === 'Escape') {
			reset();
			document.removeEventListener('keydown', onKeydown);
		}

		if (event.code === 'Enter') {
			const { x, y, width, height } = cropArea.getBoundingClientRect();
			finishEvent.detail.rect = { x, y, width, height };
			document.dispatchEvent(finishEvent);
			reset();

			document.removeEventListener('keydown', onKeydown);
		}
	}

	function onMouseup(event) {
		document.removeEventListener('mousemove', onMousemove);
		document.removeEventListener('mouseup', onMouseup);
		document.addEventListener('keydown', onKeydown);

		cropArea.addEventListener('vd-resize', onVdResize);
	}

	document.addEventListener('mousemove', onMousemove);
	document.addEventListener('mouseup', onMouseup);
}

document.addEventListener('mousedown', onMousedown);

export function crop(size, dataURL) {
	document.body.style.backgroundImage = `url(${dataURL})`;
	backgroundCanvas.height = size.height;
	backgroundCanvas.width = size.width;
	reset();
}