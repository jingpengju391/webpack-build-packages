const baseConfig = require('./webpack.config.base')

module.exports = {
    ...baseConfig,
    entry: './examples/main.ts',
    output:{
        path: undefined
    },
    devtool: 'cheap-module-source-map',
    mode: 'development',
    devServer: {
        port: "3000",
        hot: true, 
        host: "localhost",
        open: true
    }
}