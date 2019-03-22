module.exports = {
    plugins: [
        require('postcss-import')(),
        require('css-mqpacker')(),
        require('autoprefixer'),
        require('cssnano')({
            preset: [
                'default', {
                    discardComments: {
                        removeAll: true
                    }
                }
            ]
        })
    ]
}