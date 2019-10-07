module.exports = function (router, context, { workspace, util }) {
	router.get('/', async ctx => {
		ctx.body = await workspace.Project.CaseList(ctx.state.projectPath).query();
	}).del('/', async ctx => {
		ctx.body = await workspace.Project.CaseList(ctx.state.projectPath).delete();
	});

	router.post('/', async ctx => {
		const projectPath = util.base64Decode(ctx.params.pathBase64);
		const payload = ctx.request.body.data;
		ctx.body = await workspace.Project.Case(projectPath).create(payload);
	}).param('nameBase64', async (nameBase64, ctx, next) => {
		ctx.state.caseName = util.base64Decode(nameBase64);
		return next();
	}).get('/:nameBase64', async ctx => {
		const { projectPath, caseName } = ctx.state;
		ctx.body = await workspace.Project.Case(projectPath).get(caseName);
	}).put('/:nameBase64', async ctx => {
		const { projectPath, caseName } = ctx.state;
		const payload = ctx.request.body.data;
		ctx.body = await workspace.Project.Case(projectPath).update(caseName, payload);
	}).del('/:nameBase64', async ctx => {
		const { projectPath, caseName } = ctx.state;
		ctx.body = await workspace.Project.Case(projectPath).delete(caseName);
	})
}