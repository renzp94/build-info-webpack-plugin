import HtmlWebpackPlugin from 'html-webpack-plugin'
import type { Compilation, Compiler } from 'webpack'
import { getBranchName, getFirstCommitHash8, utcToGmt } from './utils'

export interface WebpackBuildInfo {
  name: string
  version: string
  branchName: string
  firstCommitHash8: string
  time: string
}

export interface Options {
  showName?: boolean
  showVersion?: boolean
  nameBlockColor?: string
  showTime?: boolean
  timeBlockColor?: string
  showGit?: boolean
  gitBlockColor?: string
}

const pluginName = 'build-info-webpack-plugin'

const yellow = (str: string) => {
  const start = 33
  const end = 39
  const open = `\x1b[${start}m`
  const close = `\x1b[${end}m`
  const regex = new RegExp(`\\x1b\\[${end}m`, 'g')
  return open + str.replace(regex, open) + close
}

const padStartZero = (num: number) => num.toString().padStart(2, '0')

class BuildInfoWebpackPlugin {
  showName: boolean
  showVersion: boolean
  nameBlockColor: string
  showTime: boolean
  timeBlockColor: string
  showGit: boolean
  gitBlockColor: string

  constructor(Options?: Options) {
    const {
      showName = true,
      showVersion = true,
      nameBlockColor = '#4170FF',
      showTime = true,
      timeBlockColor = '#09b987',
      showGit = true,
      gitBlockColor = '#e19c0e',
    } = Options ?? {}
    this.showName = showName
    this.showVersion = showVersion
    this.nameBlockColor = nameBlockColor
    this.showTime = showTime
    this.timeBlockColor = timeBlockColor
    this.showGit = showGit
    this.gitBlockColor = gitBlockColor
  }
  apply(compiler: Compiler) {
    let pkg
    let branchName
    let firstCommitHash8
    compiler.hooks.compilation.tap(pluginName, async (compilation: Compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapPromise(pluginName, async (data) => {
        try {
          if (!pkg) {
            pkg = await require(`${compiler.context}/package.json`)
          }
          if (!branchName) {
            branchName = await getBranchName(compiler.context)
          }
          if (!firstCommitHash8) {
            firstCommitHash8 = await getFirstCommitHash8(compiler.context)
          }
        } catch (err) {
          console.log(`${yellow(`WARNING[${pluginName}]: `)}${err.message.split('\n')[0]}`)
        }

        const date = utcToGmt(new Date())
        const time = `${date.getFullYear()}-${padStartZero(date.getMonth() + 1)}-${padStartZero(
          date.getDate()
        )} ${padStartZero(date.getHours())}:${padStartZero(date.getMinutes())}:${padStartZero(
          date.getSeconds()
        )}`
        const buildInfo: WebpackBuildInfo = {
          name: pkg?.name || pluginName,
          version: pkg?.version || '',
          branchName,
          firstCommitHash8,
          time,
        }
        const showGit = this.showGit && (branchName || firstCommitHash8)

        const msg =
          (this.showName || this.showVersion ? '%c' : '') +
          (this.showName ? buildInfo.name : '') +
          (this.showVersion ? ` v${buildInfo.version}` : '') +
          (this.showTime ? `%c${buildInfo.time}` : '') +
          (showGit ? `%c${buildInfo.branchName} ${buildInfo.firstCommitHash8}` : '')
        const nameBlock = `background: ${this.nameBlockColor}; color: #fff; padding: 2px 4px; border-radius: 3px 0 0 3px;`
        const timeBlock = `background: ${this.timeBlockColor}; color: #fff; padding: 2px 4px;margin-right: -1px;`
        const gitBlock = `background: ${this.gitBlockColor}; color: #fff; padding: 2px 4px; border-radius: 0 3px 3px 0;`

        const logInfo =
          `'${msg}'` +
          (this.showName || this.showVersion ? `,'${nameBlock}'` : '') +
          (this.showTime ? `,'${timeBlock}'` : '') +
          (showGit ? `,'${gitBlock}'` : '')

        data.html = data.html.replace(
          '</head>',
          `<script type="text/javascript">var WEBPACK_BUILD_INFO=${JSON.stringify(buildInfo)}; console.log(${logInfo});</script></head>`
        )

        return data
      })
    })
  }
}

export default BuildInfoWebpackPlugin
