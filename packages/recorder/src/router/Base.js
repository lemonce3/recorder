'use strict';
const { nativeImage } = require('electron');
const fs = require('fs');

const getId = (length = 5) =>
		Array(length)
			.fill('')
			.map(() =>
				Math.random()
					.toString(16)
					.substring(2, 8)
			)
			.join('-');

module.exports = function (router, context, { workspace, screenshotQueue, resolver }) {
	router.post('/screenshot', async ctx => {
		screenshotQueue.pushScreenshot(ctx.request.body);
		// fs.promises.writeFile(`./${Date.now()}.png`, nativeImage.createFromDataURL(ctx.request.body.dataURL).toPNG());

		ctx.status = 200;
	}).post('/snapshot', async ctx => {
		const { recording, focus } = workspace.status.query();
		const { projectPath } = focus;
		console.log(recording, focus);
		if (recording) {
			const snapshot = ctx.request.body;
	
			await workspace.Project.Trace(projectPath).create(snapshot);
			resolver.pushSnapshot(snapshot);
		}

		ctx.status = 200;
	}).post('/action', async ctx => {
		const { recording, projectPath } = workspace.status.query();

		if (recording) {
			
		}

		const action = ctx.request.body;

		if (!(action.type && action.data.rect)) {
			return ctx.throw(400, 'The "type" and "data.rect" is must.');
		}

		action.screenshot = await screenshotQueue.getScreenshotBytime(action.data.time);
		await workspace.Project.Trace(projectPath).create(action);

		const { bounds, dataURL } = action.screenshot;
		const { rect } = action.data;

		const origin = {
			x: Math.floor(rect.x) - bounds.x,
			y: Math.floor(rect.y) - bounds.y,
			width: Math.round(rect.width),
			height: Math.round(rect.height)
		};

		const center = {
			x: origin.x + origin.width / 2,
			y: origin.y + origin.height / 2
		};

		const offsetRect = {
			width: origin.width * 2,
			height: origin.height * 3
		};

		offsetRect.x = center.x - offsetRect.width / 2;
		offsetRect.y = center.y - offsetRect.height / 2;

		action.id = getId();
		const image = nativeImage.createFromDataURL(dataURL);
		action.screenshot.id = action.id
		delete action.screenshot.dataURL;

		action.extend = {
			image: image.crop(offsetRect).toDataURL()
		};

		resolver.pushAction(action);
		ctx.status = 200;
	});
}