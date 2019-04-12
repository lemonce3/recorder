import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueElectron from 'vue-electron'

import App from './App';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(VueElectron);

window.onload = function () {
	const app = new Vue(Object.assign(App));

	app.$mount('#app');
}
