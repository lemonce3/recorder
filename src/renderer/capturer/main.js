import { ipcRenderer } from 'electron';
import { updateScreenSize, getScreenshot, getScreenshotByTimestamp } from './screenshot';

const EVENT_PREFIX = 'ELECTRON_SCREENSHOT_CAPTURER::';

ipcRenderer.on(EVENT_PREFIX + 'update-screen-size', (event, size) => updateScreenSize(size));

ipcRenderer.on(EVENT_PREFIX + 'get-screenshot', async () => {
	const screenshot = await getScreenshot();
	
	ipcRenderer.send(EVENT_PREFIX + 'get-screenshot-reply', {
		size: screenshot.size,
		dataURL: screenshot.image.toDataURL()
	});
});

ipcRenderer.on(EVENT_PREFIX + 'get-screenshot-by-timestamp', (event, timestamp) => {
	const screenshot = getScreenshotByTimestamp(timestamp);
	ipcRenderer.send(EVENT_PREFIX + 'get-screenshot-by-timestamp', {
		time: screenshot.time,
		size: screenshot.size,
		dataURL: screenshot.image.toDataURL()
	});
});

window.addEventListener('load', () => {
	ipcRenderer.send(EVENT_PREFIX + 'load');
});