import Vue from 'vue';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';
import VueI18n from 'vue-i18n';
import Vuetify from 'vuetify';

import workspace from './lib/workspace';

import 'office-ui-fabric-core/dist/css/fabric.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'vuetify/dist/vuetify.min.css';
import './style.less';

import zh from './assets/i18n/zh-hans.yaml';

const messages = { zh };

Vue.use(workspace, { store });
Vue.use(VueI18n);

Vue.use(Vuetify, {
	icons: {
		iconfont: 'fa'
	}
});

Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.config.devtools = true;

const i18n = new VueI18n({
	locale: 'zh', // set locale
	messages, // set locale messages
});

/* eslint-disable no-new */
new Vue({
	i18n,
	components: { App },
	router,
	store,
	template: '<App/>'
}).$mount('#app');