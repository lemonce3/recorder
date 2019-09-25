module.exports = function(router, context, { workspace }) {
	router.get('/status', ctx => {
		ctx.body = workspace.status.query();
	});
}