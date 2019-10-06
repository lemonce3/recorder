const state = {
	project: '',
	case: '',
	traceArchived: false,
	lastUpdated: ''
};

const mutations = {
	UPDATE_EDITING_PROJECT_ID(state, payload) {
		state.project = payload;
	},
	UPDATE_EDITING_CASE_ID(state, payload) {
		state.case = payload;
	},
	UPDATE_ARCHIVED_STATUS(state, payload) {
		state.traceArchived = payload;
	},
	UPDATE_LAST_UPDATED(state, payload) {
		state.lastUpdated = payload;
	}
};

const actions = {
	UPDATE_EDITING_PROJECT_ID({ commit }, payload) {
		commit('UPDATE_EDITING_PROJECT_ID', payload);
	},
	UPDATE_EDITING_CASE_ID({ commit }, payload) {
		commit('UPDATE_EDITING_CASE_ID', payload);
	},
	UPDATE_ARCHIVED_STATUS({ commit }, payload) {
		commit('UPDATE_ARCHIVED_STATUS', payload);
	},
	UPDATE_LAST_UPDATED({ commit }, payload) {console.log(payload);
		commit('UPDATE_LAST_UPDATED', payload);
	}
};

export default {
	state,
	mutations,
	actions
};
