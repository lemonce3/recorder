import { ipcRenderer } from 'electron';
import { margeImage } from '../utils/marge-image';
import { updateScreenSize, getScreenshot, getScreenshotByTimestamp } from './screenshot';

const EVENT_PREFIX = 'ELECTRON_SCREENSHOT_CAPTURER::';

export async function ScreenshotReplyFactory(images) {
	return images.length > 1
		? await margeImage(images)
		: {
			bounds: images[0].bounds,
			dataURL: images[0].thumbnail.toDataURL()
		};
}

ipcRenderer.on(EVENT_PREFIX + 'update-screen-size', () => updateScreenSize());
ipcRenderer.on(EVENT_PREFIX + 'get-screenshot', async () => ipcRenderer.send(EVENT_PREFIX + 'get-screenshot-reply',await ScreenshotReplyFactory(await getScreenshot())));
ipcRenderer.on(EVENT_PREFIX + 'get-screenshot-by-timestamp', async (event, timestamp) => {
	const { screenshot, time } = getScreenshotByTimestamp(timestamp);
	const result = await ScreenshotReplyFactory(screenshot);
	result.time = time;
	
	ipcRenderer.send(EVENT_PREFIX + 'get-screenshot-by-timestamp', result);
});