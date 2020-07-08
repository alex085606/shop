module.exports = {
  devServer: {
    port: 3000,
    open: true
  },
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios'
    }
  }
}
