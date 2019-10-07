module.exports = function (router, context, { workspace, util }) {
	router.get('/', async ctx => {
		ctx.body = await workspace.Project(ctx.params.pathBase64).caseList.query();
	}).del('/', async ctx => {
		ctx.body = await workspace.Project(ctx.params.pathBase64).caseList.delete();
	});

	router.post('/', async ctx => {
		const payload = ctx.request.body.data;
		ctx.body = await workspace.Project(ctx.params.pathBase64).Case.create(payload);
	}).get('/:nameBase64', async ctx => {
		const { pathBase64, nameBase64 } = ctx.params;
		ctx.body = await workspace.Project(pathBase64).Case.get(nameBase64);
	}).put('/:nameBase64', async ctx => {
		const { pathBase64, nameBase64 } = ctx.params;
		const payload = ctx.request.body.data;
		ctx.body = await workspace.Project(pathBase64).Case.update(nameBase64, payload);
	}).del('/:nameBase64', async ctx => {
		const { pathBase64, nameBase64 } = ctx.params;
		ctx.body = await workspace.Project(pathBase64).Case.delete(nameBase64);
	})
}