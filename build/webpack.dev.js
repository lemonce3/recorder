const webpackBase = require('./webpack.base');

module.exports = Object.assign({}, webpackBase, {
	mode: 'development',
	devtool: '#eval-source-map',
	devServer: {
		host: '0.0.0.0',
		port: 8081
	}
});