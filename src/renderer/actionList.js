import { remote } from 'electron';

const fs = remote.require('fs').promises;
const path = remote.require('path');

const dirName = path.join(tempPath, name);

const load = name => remote.require(path.join(dirName, name));

const loadCache = async name => load('index.json').map(id => load(id));


const socket = io('http://localhost:10100');

socket.on('disconnect', () => console.log('fuck'));
socket.on('error', error => console.log(error));
socket.on('connect_error', error => console.log(error));
socket.on('receive-snapshot', snapshot => {
	console.log(snapshot);
	activeFile.addTrace({ type: 'snapshot', data: snapshot });
	resolver.emit('snapshot', snapshot);
});
socket.on('receive-action', action => {
	if (!this.status.recording) {
		return;
	}

	pickScreenshot(action, this.status.file.name);
	activeFile.addTrace({ type: 'action', data: action });
	resolver.emit('action', action);
});

resolver.on('resolved-action', action => {
	activeFile.addAction(preResolve(action));
});

const tempPath = path.join(remote.app.getPath('temp'), 'recorder');

const getId = (length = 5) =>
	Array(length)
		.fill('')
		.map(() =>
			Math.random()
				.toString(16)
				.substring(2, 8)
		)
		.join('-');

function pickScreenshot(action, name) {
	const { bounds, dataURL } = action.screenshot;
	const { rect } = action.data;

	const offsetRect = {
		x: Math.floor(rect.x) - bounds.x,
		y: Math.floor(rect.y) - bounds.y,
		width: Math.round(rect.width),
		height: Math.round(rect.height)
	};

	console.log(action.id);

	const imageId = action.id;
	const image = nativeImage.createFromDataURL(dataURL);
	// const filename = path.join(tempPath, imageId) + '.png';
	// fs.writeFile(filename, image.toPNG()).catch(error => console.log(error));

	delete action.screenshot.dataURL;
	
	action.extend = {
		image: image.crop(offsetRect).toDataURL()
	};
}