import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackPlugin from '../../src'
import path from 'node:path'

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname,'../index.js'),
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname,'../index.html') }),
    new WebpackPlugin(),
  ],
}
