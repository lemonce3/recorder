import axios from 'axios';

const versionPrefix = '/v1';
const prefix = '' + versionPrefix;

const apiList = {
	getActionList() {
		axios.get('/action');
	},
	startRecord() {
		axios.post('/recorder/command');
	},
	stopRecord() {
		axios.post('/recorder/command');
	}
};

export default function install(Vue) {
	Vue.prototype.$api = apiList;
}

//TODO: actionDetail.element

//TODO: setting panel

//TODO: edit doc panel

//TODO: gen code panel (not now)

//TODO: action search ?


//TODO: insert assert

//TODO: status hint

//TODO: load case from fs




//TODO: crop screenshot by rect

//TODO: move screenshot module
