const path = require("path");
let AssetComparePlugin = require('./asset-compare-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: '/assets/',
  },
  mode: "production",
  resolve: {
    extensions: ['*', '.css', '.js']
  },
  plugins: [
    new AssetComparePlugin({
      gist_id: '3372502a4187b06e810e07f1b20b6d24'
    })
  ]
};
