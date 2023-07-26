
const CopyPlugin = require('copy-webpack-plugin')
const unpkg = require('./defaultConfig/unpkg')
const defaultConfig = require('./defaultConfig/package.js')
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
module.exports = {
  plugins: [
    new PreloadWebpackPlugin({
        rel: 'preload',
        as: 'script'
    }),
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'README.md', to: '.' },
        {
          from: 'package.json', 
          to: '.',
          // The `content` argument is a [`Buffer`](https://nodejs.org/api/buffer.html) object, it could be converted to a `String` to be processed using `content.toString()`
          // The `absoluteFrom` argument is a `String`, it is absolute path from where the file is being copied
          transform(contents) {
            const pkg = { ...JSON.parse(contents.toString()), ...defaultConfig }
            Object.keys(pkg.dependencies).forEach((key) => {
              if (!unpkg[key]) {
                pkg.peerDependencies[key] = pkg.dependencies[key]
              }
            })
    
            delete pkg.scripts
            delete pkg.devDependencies
            delete pkg.dependencies
            delete pkg.jest
            return JSON.stringify(pkg, null, 2)
          }
        }
      ],
    }),   
  ]
}
