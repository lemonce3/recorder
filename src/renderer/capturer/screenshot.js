import { desktopCapturer } from 'electron';

const snapshotStack = [];

const windowSize = {
	height: 0,
	width: 0
};

export async function getScreenshot() {
	return desktopCapturer.getSources({
		types: ['screen'],
		thumbnailSize: windowSize
	}).then(sources => sources.find(source => source.name === 'Entire screen').thumbnail);
}

export function updateWindowSize(newSize) {
	windowSize.height = newSize.height;
	windowSize.width = newSize.width;
}

export function getSnapshotByTimestamp(timestamp) {
	return snapshotStack[9];
}

async function updateSnapshotStack() {
	const screenshot = await getScreenshot(windowSize);

	if (snapshotStack.length > 10) {
		snapshotStack.shift();
	}

	console.log(snapshotStack.length, 1);

	snapshotStack.push({ time: Date.now(), screenshot });
}

window.addEventListener('load', () => {
	updateWindowSize(document.body.getBoundingClientRect());
});

setInterval(updateSnapshotStack);