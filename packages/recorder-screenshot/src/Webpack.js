const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (injection) {
	return {
		base: {
			entry: {
				croper: path.join(__dirname, '../app/index.js')
			},
			target: 'electron-renderer',
			plugins: [
				new HtmlWebpackPlugin({
					filename: 'screenshot.html',
					template: path.join(__dirname, './template.html'),
					inject: 'head'
				})
			]
		}
	}
};