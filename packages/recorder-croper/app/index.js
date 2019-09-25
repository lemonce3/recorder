import { ipcRenderer } from 'electron';
import { crop } from './crop';

const EVENT_PREFIX = 'ELECTRON_CROPER_WINDOW::';

ipcRenderer.on(EVENT_PREFIX + 'get-crop-rect', async (event, size, image) => {
	crop(size, image);

	document.addEventListener('crop-result', ({ detail }) => {

		ipcRenderer.send(EVENT_PREFIX + 'get-crop-rect-reply', detail);
	}, { once: true });
});