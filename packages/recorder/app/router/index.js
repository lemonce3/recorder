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
			component: require('@/components/EditArea/FileManage/FileManage').default
		},
		{
			path: '/resolve',
			name:'Resolve',
			component: require('@/components/EditArea/Resolve/Resolve').default
		},
		{
			path: '/genCode',
			name:'GenCode',
			component: require('@/components/EditArea/GenCode/GenCode').default
		},
		{
			path: '/editDoc',
			name:'EditDoc',
			component: require('@/components/EditArea/EditDoc/EditDoc').default
		},
		{
			path: '/setting',
			name:'setting',
			component: require('@/components/EditArea/Setting/Setting').default
		},
	]
});
