export function install(Vue, options) {
	const { store } = options;
	const projectList = {};

	Vue.prototype.$workspace = Workspace(projectList, store => {
		store.dispatch('', );
	});
}