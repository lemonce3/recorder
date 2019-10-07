module.exports = function (router, context, { workspace, util }) {
	router.get('/', async ctx => {
		ctx.body = await workspace.projectList.query();
	}).post('/', async ctx => {
		const payload = ctx.request.body.data;
		ctx.body = await workspace.Project.create(payload);
	}).get('/:pathBase64', async ctx => {
		ctx.body = await workspace.Project.get(ctx.params.pathBase64);
	}).patch('/:pathBase64', async ctx => {
		ctx.body = await workspace.Project.update(ctx.params.pathBase64, payload);
	});
	
	// .del(':/pathBase64', async ctx => {
	// 	await workspace.Project.delete();
	// })
}