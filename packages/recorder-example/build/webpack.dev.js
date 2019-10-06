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