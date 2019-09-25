export function createCapturer(stream, bounds) {
	const { width, height } = bounds;
	const video = document.createElement('video');
	video.style.width = width;
	video.style.height = height;
	video.srcObject = stream;
	video.play();

	
	return function capture() {
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext('2d');
		context.drawImage(video, 0, 0, width, height);
		return {
			bounds,
			dataURL: canvas.toDataURL('image/png')
		};
	};
}