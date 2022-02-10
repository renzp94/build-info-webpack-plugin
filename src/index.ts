import { Compiler, DefinePlugin } from 'webpack'
import { ShowWebpackBuildInfoOptions, WebpackBuildInfo } from './types'
import { getBranchName, getLastCommitHash8 } from './utils'

const pluginName = 'build-info-webpack-plugin'

const padStartZero = (num: number) => num.toString().padStart(2, '0')

class BuildInfoWebpackPlugin {
  apply(complier: Compiler) {
    let pkg; let branchName; let lastCommitHash8;
    complier.hooks.beforeCompile.tapPromise(pluginName, async () => {
      if (!pkg) {
        pkg = await require(`${complier.context}/package.json`)
      }
      if (!branchName) {
        branchName = await getBranchName(complier.context)
      }
      if (!lastCommitHash8) {
        lastCommitHash8 = await getLastCommitHash8(complier.context)
      }
      const date = new Date()
      const time = `${date.getFullYear()}-${padStartZero(date.getMonth() + 1)}-${padStartZero(
        date.getDate()
      )} ${padStartZero(date.getHours())}:${padStartZero(date.getMinutes())}:${padStartZero(
        date.getSeconds()
      )}`
      const buildInfo: WebpackBuildInfo = {
        name: pkg?.name || pluginName,
        version: pkg?.version || '',
        branchName,
        lastCommitHash8,
        time,
      }
      new DefinePlugin({
        WEBPACK_BUILD_INFO: JSON.stringify(buildInfo),
      }).apply(complier)
    })
  }
}

export default BuildInfoWebpackPlugin
