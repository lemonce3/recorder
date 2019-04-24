const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	target: 'electron-renderer',
	entry: {
		app: [
			path.resolve(__dirname, '../src/app/index.js')
		]
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract(['css-loader'])
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
			},
			{
				test: /\.(woff2?|eot|svg|ttf|otf)(\?.*)?$/,
				loader: 'url-loader'
			},
			{
				test: /\.yaml$/,
				loader: ['json-loader', 'yaml-loader']
			}
		]
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': path.resolve(__dirname, '../src')
		},
		extensions: ['.js', '.vue']
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './template/index.html'),
			inject: 'head'
		}),
		new ExtractTextPlugin('style.css')
	]
}