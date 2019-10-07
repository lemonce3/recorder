'use strict';

const merge = require('webpack-merge');
const { webpack } = require('../index');
const { recorder, croper, screenshot } = webpack;

console.log(webpack);

module.exports = [
	merge(recorder, {
		name: 'recorder',
		mode: 'development',
		devtool: '#inline-source-map',
		output: {
			filename: '[name].js',
			libraryTarget: 'commonjs2',
		},
		devServer: {
			host: '0.0.0.0',
			proxy: {
				'/api': `http://localhost:10110`
			},
			port: 8080
		}
	}),
	merge(croper, {
		name: 'croper',
		mode: 'development',
		devtool: '#inline-source-map',
		output: {
			filename: '[name].js',
			libraryTarget: 'commonjs2',
		},
	}),
	merge(screenshot, {
		name: 'screenshot',
		mode: 'development',
		devtool: '#inline-source-map',
		output: {
			filename: '[name].js',
			libraryTarget: 'commonjs2',
		},
	})
];