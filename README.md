# @renzp/build-info-webpack-plugin

将打包信息注入客户端环境变量中的webpack插件

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

`webpack-build-info.ts`
```ts
export interface ShowWebpackBuildInfoOptions {
  nameBlockColor?: string
  timeBlockColor?: string
  gitBlockColor?: string
}

export interface WebpackBuildInfo {
  name: string
  version: string
  branchName: string
  lastCommitHash8: string
  time: string
}

declare const WEBPACK_BUILD_INFO: WebpackBuildInfo

export const showWebpackBuildInfo = (options?: ShowWebpackBuildInfoOptions) => {
  const {
    nameBlockColor = '#4170FF',
    timeBlockColor = '#09b987',
    gitBlockColor = '#e19c0e',
  } = options ?? {}
  if (WEBPACK_BUILD_INFO) {
    console.log(
      `%c${WEBPACK_BUILD_INFO.name} v${WEBPACK_BUILD_INFO.version}%c${WEBPACK_BUILD_INFO.time}%c${WEBPACK_BUILD_INFO.branchName} ${WEBPACK_BUILD_INFO.lastCommitHash8}`,
      `background: ${nameBlockColor}; color: #fff; padding: 2px 4px; border-radius: 3px 0 0 3px;`,
      `background: ${timeBlockColor}; color: #fff; padding: 2px 4px;`,
      `background: ${gitBlockColor}; color: #fff; padding: 2px 4px; border-radius: 0 3px 3px 0;`
    )
  }
}
```

`main.ts`
```ts
showWebpackBuildInfo()
```