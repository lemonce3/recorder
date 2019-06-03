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
			path: '/fileManage',
			name:'FileManage',
			component: require('@/components/EditArea/FileManage/index').default
		},
		{
			path: '/resolve',
			name:'Resolve',
			component: require('@/components/EditArea/Resolve/index').default
		},
		{
			path: '/genCode',
			name:'GenCode',
			component: require('@/components/EditArea/GenCode/index').default
		},
		{
			path: '/editDoc',
			name:'EditDoc',
			component: require('@/components/EditArea/EditDoc/index').default
		},
		{
			path: '/setting',
			name:'setting',
			component: require('@/components/EditArea/Setting/index').default
		},
	]
});
