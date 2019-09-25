module.exports = function(options) {
	const { length } = options;
	const queue = [];

	return {
		getScreenshotBytime(time) {
			return queue.find(screenshot => screenshot.time < time);
		},
		pushScreenshot(screenshot) {
			if (queue.length >= length) {
				queue.pop();
			}

			queue.unshift(screenshot);
		}
	}
}