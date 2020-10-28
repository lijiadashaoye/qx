var path = require('path')
var webpack = require('webpack')


function getModuleName(module) {
  var sign = 'node_modules';
  var signIndex = module.resource.indexOf(sign);
  var pathSeparator = module.resource.slice(signIndex - 1, signIndex);
  var modulePath = module.resource.substring(signIndex + sign.length + 1);
  var moduleName = modulePath.substring(0, modulePath.indexOf(pathSeparator));
  moduleName = moduleName.toLowerCase();

  return moduleName
}


// 需要chunks的包列表，支持正则
let chunksPackage = {
  'polyfill': ['babel-polyfill'], //, 'babel-runtime','core-js', 'regenerator-runtime'],
  'axios': ['axios'], //,'follow-redirects'],
  'vue': ['vue'],
  'vue-router': ['vue-router'],
  "element-ui": ['element-ui'], //,'async-validator','babel-helper-vue-jsx-merge-props','deepmerge','normalize-wheel','resize-observer-polyfill','throttle-debounce'],
  'vuex': ['vuex'],
  'vuescroll': ['vuescroll'],
  'vue-svgicon': ['vue-svgicon'],
  'js-md5': ['js-md5'],
  'moment': ['moment'],
  'dsbridge': ['dsbridge']

}

exports.chunksWebpackConfig = {
  plugins: [
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // minChunks:20000,
      minChunks: Infinity,
      // minChunks: function (module, count) {
      //   // any required modules inside node_modules are extracted to vendor
      //   return (
      //     module.resource &&
      //     /\.js$/.test(module.resource) &&
      //     module.resource.indexOf(
      //       path.join(__dirname, '../node_modules')
      //     ) === 0
      //   )
      // },
      // children: true,
      //   async: 'children-async'
      async: true
    }),
    ...Object.keys(chunksPackage).map(packageName => {
      return new webpack.optimize.CommonsChunkPlugin({
        name: packageName,
        chunks: ['vendor'],
        minChunks: function (module, count) {
          // console.log(
          //   '  moduleResource:\n' +
          //   module.resource
          // )
          console.log(module.resource, `引用次数${count}`);
          return module.resource && chunksPackage[packageName].filter(item => new RegExp(item).test(getModuleName(module)))[0] && count >= 1

          // //"有正在处理文件" + "这个文件是 .js 后缀" + "这个文件是在 node_modules 中"
          // return (
          //     module.resource &&
          //     /\.js$/.test(module.resource) &&
          //     module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
          // )
        },
        // children: true,
        // async: 'children-async'
        async: true
      })
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   chunks:['page1','h5page'],
    //   minChunks:2,
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: Infinity,
    }),

  ],
}

exports.htmlWebpackConfig = {
  chunks: ['manifest', 'polyfill', 'vue', 'vue-router', 'element-ui', 'vuex', 'vuescroll', 'axios', 'vue-svgicon', 'js-md5', 'moment', 'dsbridge', 'vendor', 'app'],
}
