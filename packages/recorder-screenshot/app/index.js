import { ipcRenderer } from 'electron';
import { margeImage } from '../utils/marge-image';
import {
	startCapture,
	stopCapture
} from './screenshot';

const EVENT_PREFIX = 'ELECTRON_SCREENSHOT_CAPTURER::';

export async function ScreenshotReplyFactory(images) {
	return images.length > 1
		? await margeImage(images)
		: images[0];
}

ipcRenderer.on(EVENT_PREFIX + 'start-capture', () => {
	startCapture();
	ipcRenderer.send(EVENT_PREFIX + 'start-capture-reply');
});

ipcRenderer.on(EVENT_PREFIX + 'stop-capture', () => {
	stopCapture();
	ipcRenderer.send(EVENT_PREFIX + 'stop-capture-reply');
});