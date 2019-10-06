const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (injection) {
	return {
		entry: {
			screenshot: path.join(__dirname, '../app/index.js')
		},
		target: 'electron-renderer',
		plugins: [
			new HtmlWebpackPlugin({
				filename: 'screenshot.html',
				template: path.join(__dirname, '../build/template.html'),
				inject: 'body'
			})
		]
	}
};