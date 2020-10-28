// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    // page1: path.resolve(__dirname, '../dist/page1.html'),
    // h5page: path.resolve(__dirname, '../dist/h5page.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    host: 'http://localhsot:9530',
    port: 9530,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // 地址映射表，可以通过设置将复杂的url简化，还可以解决跨域问题
    proxyTable: {
      "/pdxfile": {
        target: 'http://local.trace.pdx.ltd',
        // changeOrigin: true,
        // pathRewrite: {
        // '/group*/': '/group*'
        // }
      },
      '/certapp': {
        // target:'http://local.trace.pdx.ltd',
        target: 'http://local.trace.pdx.ltd',
        changeOrigin: true
      },
      "/certadmin": {
        // target:'http://local.trace.pdx.ltd',
        target: 'http://local.trace.pdx.ltd',
        changeOrigin: true
      },
      '/certimg': {
        target: 'http://local.trace.pdx.ltd',
        changeOrigin: true,
        pathRewrite: {
          '^/certimg': '' //重写接口，去掉/api
        }
      },
      "/admin": {

        // target:"http://local.trace.pdx.ltd",
        target: 'http://local.trace.pdx.ltd',
        changeOrigin: true
      },
      "/model": {
        // target:"http://local.trace.pdx.ltd",
        target: 'http://local.trace.pdx.ltd',
        changeOrigin: true
      },
      "/user": {
        // target:"http://local.trace.pdx.ltd",
        target: 'http://local.trace.pdx.ltd',
        changeOrigin: true
      },

      "/product": {
        // target:"http://local.trace.pdx.ltd",
        target: 'http://local.trace.pdx.ltd',
        changeOrigin: true
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
