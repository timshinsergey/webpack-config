/*global require module __dirname*/

const path = require('path')
const root = path.resolve(__dirname, '.')

const HtmlWebpackPlugin = require('html-webpack-plugin') // generate html file
const CleanWebpackPlugin = require('clean-webpack-plugin') // clean dist repository before assembly
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // Import css code into a separate file
const FaviconsWebpackPlugin = require('favicons-webpack-plugin') // Faviocns generation
const CompressionPlugin = require('compression-webpack-plugin') // gzip
const WebpackMd5Hash = require('webpack-md5-hash')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
	mode: 'production',
	context: root,
	entry: {
		main: path.resolve(root, 'src', 'main.js'),
	},
	output: {
		filename: '[name].bundle.[chunkhash].js',
		chunkFilename: 'chunks/[name].bundle.[chunkhash].js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['thread-loader', 'babel-loader'],
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					'thread-loader',
					'style-loader',
					MiniCssExtractPlugin.loader,
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
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: 65,
							},
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: '65-90',
								speed: 4,
							},
							gifsicle: {
								interlaced: false,
							},
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
	plugins: [
		new CleanWebpackPlugin(),
		new FaviconsWebpackPlugin({
			logo: './src/favicon.png',
			prefix: 'favicons.[hash]/',
			persistentCache: true,
			background: '#fefefe',
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
			hash: true,
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
		new CompressionPlugin({
			algorithm: 'gzip',
		}),
		new WebpackMd5Hash(),
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
			}),
		],
		// To prevent duplicate dependencies in js
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
	},
}
