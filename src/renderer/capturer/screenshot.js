import { desktopCapturer, remote } from 'electron';
import { getMergeBounds } from '../utils/get-merge-bounds';

const screen = remote.screen;
window.desktopCapturer = desktopCapturer; window.scr = screen;

const screenshotStack = [];
const displays = {};
let mergeBounds;

function cacheDispalyMessage() {
	const screens = screen.getAllDisplays();
	screens.forEach(display => displays[display.id] = display);
	mergeBounds = getMergeBounds(screens);
}

// export async function getScreenshot() {
// 	return desktopCapturer.getSources({
// 		types: ['screen'],
// 		thumbnailSize: screenSize
// 	}).then(sources => ({ size: screenSize, image: sources.find(source => source.name === 'Entire screen').thumbnail }));
// }

export function getScreenshot(thumbnailSize = mergeBounds) {
	return desktopCapturer.getSources({ types: ['screen'],	thumbnailSize	})
		.then(sources => {
			sources.forEach(source => source.bounds = displays[source.display_id].bounds);
			return sources;
		});
}

export function updateScreenSize() {
	cacheDispalyMessage();
}

export const getScreenshotByTimestamp = timestamp => screenshotStack.find(item => item.time < timestamp);

async function updateScreenshotStack() {
	const result = {
		time: Date.now(),
		screenshot: await getScreenshot()
	};

	if (screenshotStack.length >= 50) {
		screenshotStack.pop();
	}

	console.log(screenshotStack.length, 1);

	screenshotStack.unshift(result);
}

cacheDispalyMessage();
setInterval(updateScreenshotStack, 100);