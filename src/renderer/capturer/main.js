import { ipcRenderer } from 'electron';
import { margeImage } from '../utils/marge-image';
import {
	updateScreenSize,
	getScreenshot,
	getScreenshotByTimestamp,
	startCapture,
	stopCapture
} from './screenshot';

const EVENT_PREFIX = 'ELECTRON_SCREENSHOT_CAPTURER::';

export async function ScreenshotReplyFactory(images) {
	return images.length > 1
		? await margeImage(images)
		: images[0];
}

ipcRenderer.on(EVENT_PREFIX + 'update-screen-size', () => updateScreenSize());
ipcRenderer.on(EVENT_PREFIX + 'get-screenshot', async () => ipcRenderer.send(EVENT_PREFIX + 'get-screenshot-reply',await ScreenshotReplyFactory(await getScreenshot())));
ipcRenderer.on(EVENT_PREFIX + 'get-screenshot-by-timestamp', async (event, timestamp) => {
	const { screenshot, time } = getScreenshotByTimestamp(timestamp);
	const result = await ScreenshotReplyFactory(screenshot);
	result.time = time;
	
	ipcRenderer.send(EVENT_PREFIX + 'get-screenshot-by-timestamp', result);
});

ipcRenderer.on(EVENT_PREFIX + 'start-capture', () => {
	startCapture();
	ipcRenderer.send(EVENT_PREFIX + 'start-capture-reply');
});
ipcRenderer.on(EVENT_PREFIX + 'stop-capture', () => {
	stopCapture();
	ipcRenderer.send(EVENT_PREFIX + 'stop-capture-reply');
});