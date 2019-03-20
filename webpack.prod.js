const merge = require('webpack-merge')
const common = require('./webpack.common.js')

const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: 'dist/cache',
                parallel: true
            })
        ]
    },
    plugins: [
        new OptimizeCssAssetsPlugin()
    ]
})