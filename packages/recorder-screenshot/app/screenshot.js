import { desktopCapturer, remote } from 'electron';
import { createCapturer } from './screen-capturer';
import axios from 'axios';

const screenshotStack = [];
const displays = {};
const capturerList = [];
let intervalId = null;

function cacheDispalyMessage() {
	const screens = remote.screen.getAllDisplays();
	screens.forEach(display => displays[display.id] = display);
}

function initCapturerList() {
	cacheDispalyMessage();
	return desktopCapturer.getSources({ types: ['screen']	})
		.then(sources => {
			capturerList.length = 0;

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

export async function startCapture() {
	await initCapturerList();
	intervalId = setInterval(sendScreenshot, 100);
}

export function stopCapture() {
	clearInterval(intervalId);
	screenshotStack.length = 0;
}

async function sendScreenshot() {
	axios.post('/api/screenshot', {
		time: Date.now(),
		screenshot: await getScreenshot()
	});
}

startCapture();