module.exports = function (router, context, { workspace }) {
	router.get('/', async ctx => {
		const { projectPath, caseName } = ctx.state;
		ctx.body = await workspace.Project(projectPath).Case(caseName).actionList.query();
	}).del('/', async ctx => {
		const { projectPath, caseName } = ctx.state;
		ctx.body = await workspace.Project(projectPath).Case(caseName).actionList.delete();
	});

	router.post('/', async ctx => {
		const { projectPath, caseName } = ctx.state;
		const payload = ctx.request.body.data;
		ctx.body =  await workspace.Project(projectPath).Case(caseName).action.create(payload);
	}).param('actionId', async (actionId, ctx, next) => {
		ctx.state.actionId = actionId;

		return next();
	}).get('/:actionId', async ctx => {
		const { projectPath, caseName, actionId } = ctx.state;
		ctx.body = await workspace.Project(projectPath).Case(caseName).action.get(actionId);
	}).put('/:actionId', async ctx => {
		const { projectPath, caseName, actionId } = ctx.state;
		const payload = ctx.request.body.data;
		ctx.body = await workspace.Project(projectPath).Case(caseName).action.update(actionId, payload);
	}).del('/:actionId', async ctx => {
		const { projectPath, caseName, actionId } = ctx.state;
		ctx.body = await workspace.Project(projectPath).Case(caseName).action.delete(actionId);
	})
}