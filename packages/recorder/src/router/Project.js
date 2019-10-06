module.exports = function (router, context, { workspace }) {
	router.get('/', async ctx => {
		ctx.body = await workspace.Project.query();
	}).post('/', async ctx => {
		const payload = ctx.request.body;
		ctx.body = await workspace.Project.create(payload);
	}).get('/:pathBase64', async ctx => {
		const { pathBase64 } = ctx.params;
		ctx.body = await workspace.Project.get(pathBase64);
	}).put('/:pathBase64', async ctx => {
		const { pathBase64 } = ctx.params;
		const payload = ctx.request.body;
		ctx.body = await workspace.Project.update(pathBase64, payload);
	});
	
	// .del(':/pathBase64', async ctx => {
	// 	await workspace.Project.delete();
	// })
}