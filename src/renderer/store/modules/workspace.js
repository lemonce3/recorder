const state = {
	project: '',
	case: ''
};

const mutations = {
	UPDATE_EDITING_PROJECT_ID(state, payload) {
		state.project = payload;
	},
	UPDATE_EDITING_CASE_ID(state, payload) {
		state.case = payload;
	}
};

const actions = {
	UPDATE_EDITING_PROJECT_ID({ commit }, payload) {
		commit('UPDATE_EDITING_PROJECT_ID', payload);
	},
	UPDATE_EDITING_CASE_NAME({ commit }, payload) {
		commit('UPDATE_EDITING_CASE_ID', payload);
	}
};

export default {
	state,
	mutations,
	actions
};
