import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
		},
		{
			path: '*',
			redirect: '/'
		},
		{
			path: '/genCode',
			name:'GenCode',
			component: require('@/components/EditArea/GenCode').default
		},
		{
			path: '/editDoc',
			name:'EditDoc',
			component: require('@/components/EditArea/EditDoc').default
		},
		{
			path: '/setting',
			name:'setting',
			component: require('@/components/Setting').default
		},
	]
});
