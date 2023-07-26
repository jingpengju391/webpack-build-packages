const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { DefinePlugin } = require("webpack")
// const StyleResourcesLoader = require('style-resources-loader')
// const CopyPlugin = require('copy-webpack-plugin')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const isProduction = process.env.NODE_ENV === 'production'

const pathResolve = __path => path.resolve(__dirname, __path)

const excludeReg = isProduction ? /(node_modules|examples)/ : /node_modules/
const excludes = isProduction ? ["node_modules", "examples"] : ["node_modules"]

const getStyleLoaders = pre => {
    return [
        isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: ["postcss-preset-env"]
                }
            } 
        },
        pre && {
            loader: pre,
            options: pre === 'sass-loader' ? {
                additionalData: `@use "@/styles/element/index.scss" as *;`,
            } : {}
        }
    ].filter(Boolean)
}

module.exports = {
    output:{
        path: pathResolve('../dist'),
        filename: 'packages/[name].js',
        umdNamedDefine: true,
        clean: true,
        chunkFilename: '[name].chunk.js',
        // auxiliaryComment: 'auxiliaryComment',
        assetModuleFilename: 'static/media/[hash:10][ext][query]',
        library: 'ddztestlib01',
        libraryTarget: 'umd',
        libraryExport: 'default',
        globalObject: "typeof self !== 'undefined' ? self : this"// element-ui 写法,
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        alias: {
            '@': pathResolve('../packages'),
            '@examples': pathResolve('../examples'),
            'deep-light60': path.resolve(__dirname, '../node_modules/deep-light60'),
        },
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.css$/i,
                        use: getStyleLoaders(),
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        use: getStyleLoaders('sass-loader')
                    },
                    {
                        test: /\.styl$/,
                        use:  getStyleLoaders('stylus-loader')
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp)$/,
                        type:'asset',
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024
                            }
                        },
                        // generator: {
                        //     filename: 'static/images/[hash:10][ext][query]'
                        // }
                    },
                    {
                        test: /\.(ttf|woff2?|map3|map4|avi)$/,
                        type:'asset/resource',
                        // generator: {
                        //     filename: 'static/media/[hash:10][ext][query]'
                        // }
                    },
                    {
                        test: /\.(m?js|ts)$/,
                        exclude: excludeReg,
                        use: [
                            // {
                            //     loader: 'thread-loader',
                            //     options: {
                            //         works: threads
                            //     }
                            // },
                            {
                                loader: 'babel-loader',
                                options: {
                                    cacheDirectory: true,
                                    cacheCompression: false,
                                    plugins: ['@babel/plugin-transform-runtime']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                test: /\.vue$/,
                exclude: excludeReg,
                loader: 'vue-loader'
                // options: {
                //     // 使用 styleResources 选项来配置 style-resources-loader
                //     // 你可以在这里列出所有要注入的样式文件
                //     // 注意，这里使用了 glob 模式来匹配所有的样式文件
                //     // 如果你只有一个样式文件，可以直接指定它的路径
                //     styleResources: {
                //         patterns: [
                //         '/path/to/styles/*.scss',
                //         '/path/to/styles/*.css'
                //         ]
                //     }
                // }
            },
            {
                test: /\.ts$/,
                exclude: excludeReg,
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/] }
            }
        ]
    },
    plugins: [
        new ESLintPlugin({
            context: pathResolve('../packages'),
            exclude: excludes,
            // threads,
            cache: true,
            cacheLocation: pathResolve('../node_modules/.cache/eslintcache') // ???
        }),
        new HtmlWebpackPlugin({
            template: pathResolve('../public/index.html')
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "style/[name].css",
            chunkFilename: 'style/[name].chunk.css'
        }),
        // new CopyPlugin({
        //     patterns: [
        //         {
        //             from: pathResolve('../public'),
        //             to: pathResolve('../dist'),
        //             globOptions: {
        //                 ignore: ["**/index.html"]
        //             }
        //         }
        //     ]
        // }),
        new DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false
        }),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver({
                importStyle: "sass",
            })],
        })
    ]
}



