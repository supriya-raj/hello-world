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
    new AssetComparePlugin()
  ]
};
