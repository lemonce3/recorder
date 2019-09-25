const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (injection) {
	return {
		base: {
			entry: {
				croper: path.join(__dirname, '../renderer/index.js')
			},
			target: 'electron-renderer',
			plugins: [
				new HtmlWebpackPlugin({
					filename: 'croper.html',
					template: path.join(__dirname, './template.html'),
					inject: 'head'
				})
			]
		}
	}
};