const Router = {
	Base: require('./Base'),
	Workspace: require('./Workspace'),
	Project: require('./Project'),
	Trace: require('./Trace'),
	Case: require('./Case'),
	Action: require('./Action')
}

module.exports = {
	prefix: '/api',
	Router: Router.Base,
	use: [
		{
			prefix: '/workspace',
			Router: Router.Workspace,
			use: [
				{
					prefix: '/project',
					Router: Router.Project,
					use: [
						{
							mount: '/:projectId',
							prefix: '/trace',
							Router: Router.Trace
						},
						{
							mount: '/:projectId',
							prefix: '/case',
							Router: Router.Case,
							use: [
								{
									mount: '/:caseName',
									prefix: '/action',
									Router: Router.Action
								}
							]
						}
					]
				}
			]
		}
	]
}