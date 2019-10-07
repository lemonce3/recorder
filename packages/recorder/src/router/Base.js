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
	
			snapshot.id = getId();
			await workspace.Project(projectPath).trace.create({
				id: snapshot.id,
				data: JSON.stringify({
					type: 'snapshot',
					data: snapshot
				})
			});
			resolver.pushSnapshot(snapshot);
		}

		ctx.status = 200;
	}).post('/action', async ctx => {
		const { recording, focus } = workspace.status.query();
		const { projectPath } = focus;

		if (recording) {
			const action = ctx.request.body;
	
			if (!(action.type && action.data.rect)) {
				return ctx.throw(400, 'The "type" and "data.rect" is must.');
			}
	
			const screenshot = await screenshotQueue.getScreenshotBytime(action.data.time);
	
			const { bounds, dataURL } = screenshot;
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
				width: Math.round(origin.width * 2),
				height: Math.round(origin.height * 3)
			};
	
			offsetRect.x = Math.round(center.x - offsetRect.width / 2);
			offsetRect.y = Math.round(center.y - offsetRect.height / 2);
	
			action.id = getId();
			action.screenshot = {
				bounds
			};
	
			const image = nativeImage.createFromDataURL(dataURL);
			action.extend = {
				image: image.crop(offsetRect).toDataURL()
			};
	
			await workspace.Project(projectPath).trace.create({
				id: action.id,
				data: JSON.stringify({
					type: 'action',
					data: action,
				}),
				image: image.toPNG()
			});
	
			resolver.pushAction(action);
		}

		ctx.status = 200;
	});
}