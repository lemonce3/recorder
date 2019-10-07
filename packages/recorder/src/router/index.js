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
							mount: '/:pathBase64',
							prefix: '/trace',
							Router: Router.Trace
						},
						{
							mount: '/:pathBase64',
							prefix: '/case',
							Router: Router.Case,
							use: [
								{
									mount: '/:nameBase64',
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