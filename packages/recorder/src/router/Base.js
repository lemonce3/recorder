'use strict';
const { nativeImage } = require('electron');

module.exports = function(router, context, { workspace, screenshotQueue, resolver }) {
	router.post('/snapshot', ctx => {
		const snapshot = ctx.request.body;
		
		const { projectPath } = workspace.status.query();
		await workspace.Project.get(projectPath).Trace.create(snapshot);
		resolver.pushSnapshot(snapshot);

		ctx.status = 200;
	}).post('/action', ctx => {
		const action = ctx.request.body;
		
		if (!(action.type && action.data.rect)) {
			return ctx.throw(400, 'The "type" and "data.rect" is must.');
		}
		
		action.screenshot = await screenshotQueue.getScreenshotBytime(action.data.time);
		const { projectPath } = workspace.status.query();
		await workspace.Project.get(projectPath).Trace.create(action);
		resolver.pushAction(action);
		ctx.status = 200;
	});
}