module.exports = {
  parser: require('postcss-comment'),
  plugins: [
    require('postcss-import'),
    /* 
     小程序不使用autoprefix，使用开发者工具的自动补全可以减少小程序构建包体积
     但是目前采用的小程序上传是api方式，不支持自动补全
     */
    require('autoprefixer')(),
    require('@dcloudio/vue-cli-plugin-uni/packages/postcss')
  ]
}
