import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Compilation, Compiler } from 'webpack'
import { Options, WebpackBuildInfo } from './types'
import { getBranchName, getLastCommitHash8 } from './utils'
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
    let lastCommitHash8
    compiler.hooks.compilation.tap(pluginName, async (compilation: Compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapPromise(pluginName, async (data) => {
        try {
          if (!pkg) {
            pkg = await require(`${compiler.context}/package.json`)
          }
          if (!branchName) {
            branchName = await getBranchName(compiler.context)
          }
          if (!lastCommitHash8) {
            lastCommitHash8 = await getLastCommitHash8(compiler.context)
          }
        } catch (err) {
          console.log(`${yellow(`WARNING[${pluginName}]: `)}${err.message.split('\n')[0]}`)
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

        const msg =
          (this.showName || this.showVersion ? '%c' : '') +
          (this.showName ? buildInfo.name : '') +
          (this.showVersion ? ` v${buildInfo.version}` : '') +
          (this.showTime ? `%c${buildInfo.time}` : '') +
          (this.showGit ? `%c${buildInfo.branchName} ${buildInfo.lastCommitHash8}` : '')
        const nameBlock = `background: ${this.nameBlockColor}; color: #fff; padding: 2px 4px; border-radius: 3px 0 0 3px;`
        const timeBlock = `background: ${this.timeBlockColor}; color: #fff; padding: 2px 4px;`
        const gitBlock = `background: ${this.gitBlockColor}; color: #fff; padding: 2px 4px; border-radius: 0 3px 3px 0;`

        data.html = data.html.replace(
          '</head>',
          `<script type="text/javascript">console.log('${msg}','${nameBlock}','${timeBlock}','${gitBlock}')</script></head>`
        )

        return data
      })
    })
  }
}

module.exports = BuildInfoWebpackPlugin
