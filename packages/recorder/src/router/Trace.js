module.exports = function (router, context, { workspace }) {
	router.get('/trace', async ctx => {
		await workspace.Project.get(projectPathBase64).TraceList.query();
	}).get('/trace/:traceId', async ctx => {
		await workspace.Project.get(projectPathBase64).Trace.getData(traceId);
	}).get('/screenshot/:traceId', async ctx => {
		await workspace.Project.get(projectPathBase64).Trace.getScreenshot(traceId);
	});
}