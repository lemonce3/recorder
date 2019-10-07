module.exports = function (router, context, { workspace }) {
	router.get('/trace', async ctx => {
		ctx.body = await workspace.Project(ctx.state.projectPath).TraceList.query();
	}).get('/data/:traceId', async ctx => {
		ctx.body = await workspace.Project(ctx.state.projectPath).Trace.getData(traceId);
	}).get('/screenshot/:traceId', async ctx => {
		ctx.body = await workspace.Project(ctx.state.projectPath).Trace.getScreenshot(traceId);
	});
}