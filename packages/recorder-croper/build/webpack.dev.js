'use strict';

const merge = require('webpack-merge');
const { renderer } = require('../index');

module.exports = merge(renderer.Webpack(), {
	mode: 'development',
	devtool: '#inline-source-map',
	devServer: {
		host: '0.0.0.0',
		proxy: {
			'/api': `http://localhost:${config.server.port}`
		},
		port: config.devServer.port
	}
});