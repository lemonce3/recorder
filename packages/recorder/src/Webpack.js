const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { dependencies } = require('../package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader')

const whiteListedModules = [];

module.exports = function (injection) {
	return {
		devtool: '#cheap-module-eval-source-map',
		entry: {
			recorder: path.join(__dirname, '../app/main.js')
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: path.join(__dirname, '../build/template.html'),
				inject: 'head'
			})
		],
		module: {
			rules: [
				{
					test: /\.less$/,
					use: ['vue-style-loader', 'css-loader', 'less-loader']
				},
				{
					test: /\.css$/,
					use: ['vue-style-loader', 'css-loader']
				},
				{
					test: /\.html$/,
					use: 'vue-html-loader'
				},
				// {
				//   test: /\.js$/,
				//   use: 'babel-loader',
				//   exclude: /node_modules/
				// },
				{
					test: /\.node$/,
					use: 'node-loader'
				},
				{
					test: /\.vue$/,
					use: {
						loader: 'vue-loader',
						options: {
							extractCSS: process.env.NODE_ENV === 'production',
							loaders: {
								sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
								scss: 'vue-style-loader!css-loader!sass-loader',
								less: 'vue-style-loader!css-loader!less-loader'
							}
						}
					}
				},
				{
					test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
					use: {
						loader: 'url-loader',
						query: {
							limit: 10000,
							name: 'imgs/[name]--[folder].[ext]'
						}
					}
				},
				{
					test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'media/[name]--[folder].[ext]'
					}
				},
				{
					test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
					use: {
						loader: 'url-loader',
						query: {
							limit: 10000,
							name: 'fonts/[name]--[folder].[ext]'
						}
					}
				},
				{
					test: /\.yaml$/,
					loader: 'json-loader!yaml-loader'
				},
			]
		},
		node: {
			__dirname: process.env.NODE_ENV !== 'production',
			__filename: process.env.NODE_ENV !== 'production'
		},
		plugins: [
			new VueLoaderPlugin(),
			new MiniCssExtractPlugin({ filename: 'styles.css' }),
			new HtmlWebpackPlugin({
				filename: 'recorder.html',
				template: path.resolve(__dirname, '../build/template.html'),
				templateParameters(compilation, assets, options) {
					return {
						compilation: compilation,
						webpack: compilation.getStats().toJson(),
						webpackConfig: compilation.options,
						htmlWebpackPlugin: {
							files: assets,
							options: options
						},
						process,
					};
				},
				chunks: ['recorder'],
				minify: {
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeComments: true
				},
				nodeModules: process.env.NODE_ENV !== 'production'
					? path.resolve(__dirname, '../node_modules')
					: false
			}),
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoEmitOnErrorsPlugin()
		],
		resolve: {
			alias: {
				'@': path.join(__dirname, '../app'),
				'vue$': 'vue/dist/vue.esm.js',
				'socket.io$': 'socket.io-client/dist/socket.io.js'
			},
			extensions: ['.js', '.vue', '.json', '.css', '.node']
		},
		target: 'electron-renderer'
	}
};