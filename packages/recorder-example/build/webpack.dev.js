const merge = require('webpack-merge');
const { webpack } = require('../index');

const recorder = merge(webpack.recorder, {
	mode: 'development',
	devtool: '#inline-source-map'
});

const corper = merge(webpack.corper, {
	mode: 'development',
	devtool: '#inline-source-map'
});

const screenshot = merge(webpack.screenshot, {
	mode: 'development',
	devtool: '#inline-source-map'
});

module.exports = [
	recorder,
	corper,
	screenshot
]