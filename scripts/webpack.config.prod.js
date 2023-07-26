const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
// const TerserWebpackPlugin = require("terser-webpack-plugin")
const baseConfig = require('./webpack.config.base')
const postBuild = require('./post.build')

// const os = require("os")
// const threads = os.cpus().length
baseConfig.plugins = [...baseConfig.plugins, ...postBuild.plugins]


module.exports = {
    entry: {
        index: './packages/index.ts',
    },
    ...baseConfig,
    // entry: {
    //     commonjs: './src/index.js',
    //     esm: './src/index.esm.js',
    //     umd: './src/index.umd.js'
    // },
    mode: 'production',
    devtool: 'source-map',
    performance: {
        hints: 'warning',
        maxAssetSize: 3000 * 1000,
        maxEntrypointSize: 3000 * 1000
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vue: {
                    test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
                    name: "vue/vue-chunk",
                    priority: 40,
                    chunks: 'all',
                    enforce: true
                },
                elementPlus: {
                    test: /[\\/]node_modules[\\/]element-plus[\\/]/,
                    name: "elementPlus/elementPlus-chunk",
                    priority: 30,
                    chunks: 'all',
                    enforce: true
                },
                libs: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "libs/libs-chunk",
                    priority: 20,
                    chunks: 'all',
                    enforce: true
                }
            }
        },
        runtimeChunk: {
            name: e => `runtime-${e.name}.js`
        },
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            // new ImageMinimizerPlugin({
            //     minimizerOptions: {
            //       // Lossless optimization with custom option
            //       // Feel free to experiment with options for better result for you
            //       plugins: [
            //         ["gifsicle", { interlaced: true }],
            //         ["jpegtran", { progressive: true }],
            //         ["optipng", { optimizationLevel: 5 }],
            //         // Svgo configuration here https://github.com/svg/svgo#configuration
            //         [
            //           "svgo",
            //           {
            //             plugins: extendDefaultPlugins([
            //               {
            //                 name: "removeViewBox",
            //                 active: false,
            //               },
            //               {
            //                 name: "addAttributesToSVGElement",
            //                 params: {
            //                   attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
            //                 },
            //               },
            //             ]),
            //           },
            //         ],
            //       ],
            //     },
            //   }),
            // new TerserWebpackPlugin({
            //     parallel: threads
            // })
        ]
    }
}