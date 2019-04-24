import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		actionList: []
	},
	mutations: {
		addAction(state, action) {
			state.actionList.push(action);
		},
		setAction(state, actionList) {
			state.actionList = actionList;
		}
	}
});