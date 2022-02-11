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