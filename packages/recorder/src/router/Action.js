module.exports = function (router, context, { workspace }) {
	router.get('/', async ctx => {
		await workspace.Project.get(projectPathBase64).Case.get(caseNameBase64).ActionList.query();
	}).del('/', async ctx => {
		await workspace.Project.get(projectPathBase64).Case.get(caseNameBase64).ActionList.delete();
	});

	router.post('/', async ctx => {
		await workspace.Project.get(projectPathBase64).Case.get(caseNameBase64).Action.create();
	}).get('/:actionId', async ctx => {
		await workspace.Project.get(projectPathBase64).Case.get(caseNameBase64).Action.get(actionId);
	}).put('/actionId', async ctx => {
		await workspace.Project.get(projectPathBase64).Case.get(caseNameBase64).Action.update(actionId, payload);
	}).del('/actionId', async ctx => {
		await workspace.Project.get(projectPathBase64).Case.get(caseNameBase64).Action.delete(actionId)
	})
}