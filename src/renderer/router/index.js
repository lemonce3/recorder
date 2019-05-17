import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			// name: 'Record',
			// component: require('@/components/EditArea/Record').default
		},
		{
			path: '*',
			redirect: '/'
		}
	]
});
