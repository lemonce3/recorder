module.exports = function (router, context, { workspace }) {
	router.get('/', async ctx => {
		await workspace.Project.get(projectPathBase64).CaseList.query();
	}).del('/', async ctx => {
		await workspace.Project.get(projectPathBase64).CaseList.delete();
	});

	router.post('/', async ctx => {
		await workspace.Project.get(projectPathBase64).Case.create();
	}).get('/:caseNameBase64', async ctx => {
		await workspace.Project.get(projectPathBase64).Case.get(caseNameBase64);
	}).put('/:caseNameBase64', async ctx => {
		await workspace.Project.get(projectPathBase64).Case.update();
	}).del('/:caseNameBase64', async ctx => {
		await workspace.Project.get(projectPathBase64).Case.delete(caseNameBase64);
	})
}