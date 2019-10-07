module.exports = function (router, context, { workspace }) {
	router.get('/trace', async ctx => {
		ctx.body = await workspace.Project.TraceList(ctx.state.projectPath).query();
	}).get('/data/:traceId', async ctx => {
		ctx.body = await workspace.Project.Trace(ctx.state.projectPath).getData(traceId);
	}).get('/screenshot/:traceId', async ctx => {
		ctx.body = await workspace.Project.Trace(ctx.state.projectPath).getScreenshot(traceId);
	});
}