import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Welcome from './pages/Welcome.vue';
import Recorder from './pages/Recorder.vue';

export default new VueRouter({
	routes: [
		{
			path: '/',
			component: Welcome
		},
		{
			path: '/recorder',
			component: Recorder
		}
	]
})