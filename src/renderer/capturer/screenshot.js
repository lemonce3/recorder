import { desktopCapturer, remote } from 'electron';
import { createCapturer } from './screen-capturer';

const screen = remote.screen;
window.desktopCapturer = desktopCapturer; window.scr = screen;

const screenshotStack = [];
const displays = {};
const capturerList = [];
let intervalId = null;

function cacheDispalyMessage() {
	const screens = screen.getAllDisplays();
	screens.forEach(display => displays[display.id] = display);
}

function initCapturerList() {
	return desktopCapturer.getSources({ types: ['screen']	})
		.then(sources => {
			sources.forEach(async source => {
				const bounds = displays[source.display_id].bounds;
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: source.id,
							minWidth: bounds.width,
							maxWidth: bounds.width,
							minHeight: bounds.height,
							maxHeight: bounds.height
						}
					}
				});
				capturerList.push(createCapturer(stream, bounds));
			});
		});
}

export function getScreenshot() {
	return capturerList.map(capturer => capturer());
}

export function updateScreenSize() {
	cacheDispalyMessage();
}

export const getScreenshotByTimestamp = timestamp => screenshotStack.find(item => item.time < timestamp);

//replace with Promise
export function startCapture() {
	intervalId = setInterval(updateScreenshotStack, 100);
}

export function stopCapture() {
	clearInterval(intervalId);
	screenshotStack.length = 0;
}

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
initCapturerList();
startCapture();