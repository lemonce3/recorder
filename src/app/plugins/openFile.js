import electron from 'electron';

const { dialog } = electron.remote;

export default function install(Vue) {
	Vue.prototype.$openFile = function (filters, callback) {

		return dialog.showOpenDialog(
			{ properties: ["openFile"], filters }, callback)
	}
}