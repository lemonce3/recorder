module.exports = function (router, context, { workspace }) {
	router.get('/trace', async ctx => {
		const { pathBase64 } = ctx.params;
		ctx.body = await workspace.Project.get(pathBase64).TraceList.query();
	}).get('/trace/:traceId', async ctx => {
		const { pathBase64 } = ctx.params;
		ctx.body = await workspace.Project.get(pathBase64).Trace.getData(traceId);
	}).get('/screenshot/:traceId', async ctx => {
		const { pathBase64 } = ctx.params;
		ctx.body = await workspace.Project.get(pathBase64).Trace.getScreenshot(traceId);
	});
}