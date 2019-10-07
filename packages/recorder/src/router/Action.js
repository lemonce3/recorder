module.exports = function (router, context, { workspace }) {
	router.get('/', async ctx => {
		const { projectPath, caseName } = ctx.state;
		ctx.body = await workspace.Project.Case(projectPath).ActionList(caseName).query();
	}).del('/', async ctx => {
		const { projectPath, caseName } = ctx.state;
		ctx.body = await workspace.Project.Case(projectPath).ActionList(caseName).delete();
	});

	router.post('/', async ctx => {
		const { projectPath, caseName } = ctx.state;
		const payload = ctx.request.body.data;
		ctx.body =  await workspace.Project.Case(projectPath).Action(caseName).create(payload);
	}).param('actionId', async (actionId, ctx, next) => {
		ctx.state.actionId = actionId;

		return next();
	}).get('/:actionId', async ctx => {
		const { projectPath, caseName, actionId } = ctx.state;
		ctx.body = await workspace.Project.Case(projectPath).Action(caseName).get(actionId);
	}).put('/:actionId', async ctx => {
		const { projectPath, caseName, actionId } = ctx.state;
		const payload = ctx.request.body.data;
		ctx.body = await workspace.Project.Case(projectPath).Action(caseName).update(actionId, payload);
	}).del('/:actionId', async ctx => {
		const { projectPath, caseName, actionId } = ctx.state;
		ctx.body = await workspace.Project.Case(projectPath).Action(caseName).delete(actionId);
	})
}