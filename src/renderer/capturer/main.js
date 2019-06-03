import { ipcRenderer, nativeImage } from 'electron';
import { updateWindowSize, getScreenshot, getSnapshotByTimestamp } from './screenshot';
import { crop } from './crop';

const EVENT_PREFIX = 'ELECTRON_SCREENSHOT_WINDOW::';

window.addEventListener('resize', () => {
	const rect = document.body.getBoundingClientRect();
	updateWindowSize({ height: rect.height, width: rect.width });
});

ipcRenderer.on(EVENT_PREFIX + 'crop-image', async (event, size, image) => {
	if (!image) {
		image = await getScreenshot();
	}

	crop(size, image.toDataURL());

	document.addEventListener('crop-finish', ({ detail: rect }) => {
		ipcRenderer.send(EVENT_PREFIX + 'crop-image-reply', rect, image.crop(rect));
	}, { once: true });
});

ipcRenderer.on(EVENT_PREFIX + 'get-screenshot', async () => {
	const screenshot = await getScreenshot();
	ipcRenderer.send(EVENT_PREFIX + 'get-screenshot-reply', screenshot);
});

ipcRenderer.on(EVENT_PREFIX + 'get-snapshot-by-timestamp', (event, timestamp) => {
	const snapshot = getSnapshotByTimestamp(timestamp);
	ipcRenderer.send(EVENT_PREFIX + 'get-snapshot-by-timestamp', snapshot);
});