const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (injection) {
	return {
		entry: {
			croper: path.join(__dirname, '../app/index.js')
		},
		target: 'electron-renderer',
		module: {
			rules: [
				{
					test: /\.css$/,
					use: ['css-loader']
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: 'croper.html',
				template: path.join(__dirname, '../build/template.html'),
				inject: 'body'
			})
		]
	}
};