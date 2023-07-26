const { merge } = require("webpack-merge")
const webpackConfig = require("./webpack.config.prod.js")
const glob = require("glob")
const path = require("path")

const componentsObject = glob
  .sync(`packages/**/index.ts`, {
    dot: true,
  })
  .map((x) => path.resolve(x))
  .map((x) => path.dirname(x).split(path.sep).pop())
  .reduce((p, name) => {
    console.log(name, 5555)
    p[name] = `../packages/${name}/index.ts`
    return p
  }, {})

module.exports = webpackConfig
