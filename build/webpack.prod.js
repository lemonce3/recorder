const webpackBase = require('./webpack.base');

module.exports = Object.assign({}, webpackBase, {
	mode: 'production'
});