import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

import App from './App.vue';
import router from './router';
import store from './store';
import openFile from './plugins/openFile';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(openFile);

window.onload = function () {
	new Vue({
		el: '#app',
		components: { App },
		template: '<App/>',
		router, store
	});
}
