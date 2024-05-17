import type { Compiler, Compilation } from 'webpack'
import { RawSource } from 'webpack-sources'
import { getBranchName, getFirstCommitHash8, utcToGmt } from './utils'

export interface WebpackBuildInfo {
  name: string
  version: string
  branchName: string
  firstCommitHash8: string
  time: string
}

export interface Options {
  html?: string
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
  html: string
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
      html = 'index.html',
    } = Options ?? {}
    this.html = html
    this.showName = showName
    this.showVersion = showVersion
    this.nameBlockColor = nameBlockColor
    this.showTime = showTime
    this.timeBlockColor = timeBlockColor
    this.showGit = showGit
    this.gitBlockColor = gitBlockColor
  }
  apply(compiler: Compiler) {
    let buildInfo: WebpackBuildInfo

    compiler.hooks.beforeCompile.tapPromise(pluginName, async () => {
      let pkg: any
      let branchName = ''
      let firstCommitHash8 = ''

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
      } catch (err: any) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(
          `${yellow(`WARNING[${pluginName}]: `)}${err.message.split('\n')[0]}`,
        )
      }

      const date = utcToGmt(new Date())
      const time = `${date.getFullYear()}-${padStartZero(
        date.getMonth() + 1,
      )}-${padStartZero(date.getDate())} ${padStartZero(
        date.getHours(),
      )}:${padStartZero(date.getMinutes())}:${padStartZero(date.getSeconds())}`
      buildInfo = {
        name: pkg?.name || pluginName,
        version: pkg?.version || '',
        branchName,
        firstCommitHash8,
        time,
      }
    })

    compiler.hooks.emit.tap(
      pluginName,
      async (compilation: Compilation) => {
        if (!compilation.assets[this.html]) {
          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log(
            `${yellow(`WARNING[${pluginName}]: `)}未找到${
              this.html
            }文件，如果html模板不是index.html，请在options中指定`,
          )
        }

        let htmlContent = compilation.assets[this.html].source() as string
        const showGit =
          this.showGit && (buildInfo.branchName || buildInfo.firstCommitHash8)

        const msg =
          (this.showName || this.showVersion ? '%c' : '') +
          (this.showName ? buildInfo.name : '') +
          (this.showVersion ? ` v${buildInfo.version}` : '') +
          (this.showTime ? `%c${buildInfo.time}` : '') +
          (showGit
            ? `%c${buildInfo.branchName} ${buildInfo.firstCommitHash8}`
            : '')
        const nameBlock = `background: ${this.nameBlockColor}; color: #fff; padding: 2px 4px; border-radius: 3px 0 0 3px;`
        const timeBlock = `background: ${this.timeBlockColor}; color: #fff; padding: 2px 4px;margin-right: -1px;`
        const gitBlock = `background: ${this.gitBlockColor}; color: #fff; padding: 2px 4px; border-radius: 0 3px 3px 0;`

        const logInfo = `'${msg}'${
          this.showName || this.showVersion ? `,'${nameBlock}'` : ''
        }${this.showTime ? `,'${timeBlock}'` : ''}${
          showGit ? `,'${gitBlock}'` : ''
        }`
        htmlContent = htmlContent.replace(
          '</head>',
          `<script type="text/javascript">var WEBPACK_BUILD_INFO=${JSON.stringify(
            buildInfo,
          )}; console.log(${logInfo});</script></head>`,
        )
        compilation.assets[this.html] = new RawSource(htmlContent)
      },
    )
  }
}

export default BuildInfoWebpackPlugin
