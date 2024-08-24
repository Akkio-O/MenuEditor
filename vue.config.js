const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/MenuEditor',
  outputDir: 'dist',
  assetsDir: 'static',
  devServer: {
    historyApiFallback: true,
  },
});