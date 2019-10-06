import { ipcRenderer } from 'electron';
import {
	startCapture,
	stopCapture
} from './screenshot';

const EVENT_PREFIX = 'ELECTRON_SCREENSHOT_CAPTURER::';

ipcRenderer.on(EVENT_PREFIX + 'start-capture', () => {
	startCapture();
	ipcRenderer.send(EVENT_PREFIX + 'start-capture-reply');
});

ipcRenderer.on(EVENT_PREFIX + 'stop-capture', () => {
	stopCapture();
	ipcRenderer.send(EVENT_PREFIX + 'stop-capture-reply');
});