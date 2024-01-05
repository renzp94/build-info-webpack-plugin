<p align="center"><a href="https://github.com/renzp94/build-info-webpack-plugin" target="_blank" rel="noopener noreferrer"><img width="200" src="./logo.png" alt="build-info-webpack-plugin logo"></a></p>
<p align="center">
  <a href="https://codecov.io/github/@renzp/build-info-webpack-plugin"><img src="https://img.shields.io/codecov/c/github/@renzp/build-info-webpack-plugin.svg?sanitize=true" alt="Coverage Status"></a>
  <a href="https://npmcharts.com/compare/@renzp/build-info-webpack-plugin?minimal=true"><img src="https://img.shields.io/npm/dm/@renzp/build-info-webpack-plugin.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@renzp/build-info-webpack-plugin"><img src="https://img.shields.io/npm/v/@renzp/build-info-webpack-plugin.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@renzp/build-info-webpack-plugin"><img src="https://img.shields.io/npm/l/@renzp/build-info-webpack-plugin.svg?sanitize=true" alt="License"></a>
</p>
<p align="center">
  <a href="https://github.com/renzp94/build-info-webpack-plugin/watchers"><img src="https://img.shields.io/github/watchers/renzp94/build-info-webpack-plugin.svg?style=social" alt="watchers"></a>
  <a href="https://github.com/renzp94/build-info-webpack-plugin/stars"><img src="https://img.shields.io/github/stars/renzp94/build-info-webpack-plugin.svg?style=social" alt="stars"></a>
</p>

# @renzp/build-info-webpack-plugin

一款将打包信息打印在控制台的webpack插件

## Install

```sh
npm i @renzp/build-info-webpack-plugin -D 
```

## Usage

`webpack.config.js`

```js
import BuildInfoWebpackPlugin from '@renzp/build-info-webpack-plugin'
module.exports = {
    plugins: [BuildInfoWebpackPlugin]
}
```

### Options

```ts
interface Options {
  showName?:boolean
  showVersion?:boolean
  nameBlockColor?: string
  showTime?:boolean
  timeBlockColor?: string
  showGit?:boolean
  gitBlockColor?: string
}
```