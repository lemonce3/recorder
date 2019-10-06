module.exports = function (router, context, { workspace }) {
	router.get('/', async ctx => {
		const { pathBase64 } = ctx.params;
		ctx.body = await workspace.Project.get(pathBase64).CaseList.query();
	}).del('/', async ctx => {
		const { pathBase64 } = ctx.params;
		ctx.body = await workspace.Project.get(pathBase64).CaseList.delete();
	});

	router.post('/', async ctx => {
		const { pathBase64 } = ctx.params;
		const payload = ctx.request.body;
		ctx.body = await workspace.Project.get(pathBase64).Case.create(payload);
	}).get('/:nameBase64', async ctx => {
		const { pathBase64, nameBase64 } = ctx.params;
		ctx.body = await workspace.Project.get(pathBase64).Case.get(nameBase64);
	}).put('/:nameBase64', async ctx => {
		const { pathBase64, nameBase64 } = ctx.params;
		const payload = ctx.request.body;
		ctx.body = await workspace.Project.get(pathBase64).Case.update(nameBase64, payload);
	}).del('/:nameBase64', async ctx => {
		const { pathBase64, nameBase64 } = ctx.params;
		ctx.body = await workspace.Project.get(pathBase64).Case.delete(nameBase64);
	})
}