module.exports = function (router, context, { workspace }) {
	router.post('/', async ctx => {
		await workspace.Project.create();
	}).get('/:pathBase64', async ctx => {
		await workspace.Project.get();
	}).put('/:pathBase64', async ctx => {
		await workspace.Project.update();
	});
	
	// .del(':/pathBase64', async ctx => {
	// 	await workspace.Project.delete();
	// })
}