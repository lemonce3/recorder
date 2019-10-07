module.exports = function(router, context, { workspace }) {
	router.get('/status', async ctx => {
		ctx.body = workspace.status.query();
	}).put('/status', async ctx => {
		ctx.body = workspace.status.updateFocus(ctx.request.body.data);
	});
}