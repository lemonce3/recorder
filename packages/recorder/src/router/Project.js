module.exports = function (router, context, { workspace, util }) {
	router.get('/', async ctx => {
		ctx.body = await workspace.ProjectList.query();
	}).post('/', async ctx => {
		const payload = ctx.request.body.data;
		ctx.body = await workspace.Project.create(payload);
	}).param('pathBase64', async (pathBase64, ctx, next) => {
		ctx.state = {
			projectPath: util.base64Decode(ctx.params.pathBase64)
		}

		return next();
	}).get('/:pathBase64', async ctx => {
		const projectPath = util.base64Decode(ctx.params.pathBase64);
		ctx.body = await workspace.Project.get(projectPath);
	}).patch('/:pathBase64', async ctx => {
		const projectPath = util.base64Decode(ctx.params.pathBase64);
		const payload = ctx.request.body.data;
		ctx.body = await workspace.Project.update(projectPath, payload);
	});
	
	// .del(':/pathBase64', async ctx => {
	// 	await workspace.Project.delete();
	// })
}