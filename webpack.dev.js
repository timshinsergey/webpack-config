/*global require module __dirname*/

const path = require('path')
const root = path.resolve(__dirname, '.')
const cacheDir = path.resolve(__dirname, '.', 'node_modules', '.cache')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // generate html file
const CleanWebpackPlugin = require('clean-webpack-plugin') // clean dist repository before assembly

const getThreadLoader = name => ({
	loader: 'thread-loader',
	options: {
		workerParallelJobs: 50,
		poolRespawn: false,
		name,
	},
})

module.exports = {
	mode: 'development',
	context: root,
	entry: {
		main: path.resolve(root, 'src', 'main.js'),
	},
	output: {
		path: path.resolve(root, 'dist'),
		filename: '[name].bundle.js',
		chunkFilename: 'chunks/[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'cache-loader',
						options: {
							cacheDirectory: path.resolve(cacheDir, 'js'),
						},
					},
					getThreadLoader('js'),
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: path.resolve(cacheDir, 'babel'),
						},
					},
				],
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					{
						loader: 'cache-loader',
						options: {
							cacheDirectory: path.resolve(cacheDir, 'js'),
						},
					},
					getThreadLoader('css'),
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							config: {
								path: './src/js/postcss.config.js',
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'images/[name].[ext]',
						},
					},
				],
			},
			{
				test: /\.(ttf|eot|woff|woff2|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'fonts/[name].[ext]',
						},
					},
				],
			},
			{
				test: /\.(csv|tsv)$/,
				use: ['csv-loader'],
			},
			{
				test: /\.xml$/,
				use: ['xml-loader'],
			},
		],
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		hot: true,
		compress: true,
		overlay: true,
		clientLogLevel: 'error',
		open: 'Firefox',
		watchContentBase: true,
		port: 8082,
		historyApiFallback: true,
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
			hash: true,
		}),
		new webpack.ProvidePlugin({
			fetch:
				'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
		}),
	],
	optimization: {
		usedExports: true,
	},
}
