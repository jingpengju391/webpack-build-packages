const { merge } = require("webpack-merge")
const webpackConfig = require("./webpack.config.prod.js")

module.exports = merge(webpackConfig, {
  mode: "none",
})
