import { desktopCapturer } from 'electron';

const screenshotStack = [];

const screenSize = {
	width: 0,
	height: 0
};

export async function getScreenshot() {
	return desktopCapturer.getSources({
		types: ['screen'],
		thumbnailSize: screenSize
	}).then(sources => ({ size: screenSize, image: sources.find(source => source.name === 'Entire screen').thumbnail }));
}

export function updateScreenSize(newSize) {
	screenSize.height = newSize.height;
	screenSize.width = newSize.width;
}

export const getScreenshotByTimestamp = timestamp => screenshotStack.find(item => item.time < timestamp);

async function updateScreenshotStack() {
	const screenshot = await getScreenshot(screenSize);

	if (screenshotStack.length >= 50) {
		screenshotStack.pop();
	}

	console.log(screenshotStack.length, 1);
	screenshot.time = Date.now();

	screenshotStack.unshift(screenshot);
}

setInterval(updateScreenshotStack, 100);