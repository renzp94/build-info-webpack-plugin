export interface WebpackBuildInfo {
  name: string
  version: string
  branchName: string
  lastCommitHash8: string
  time: string
}

export interface Options {
  showName?:boolean
  showVersion?:boolean
  nameBlockColor?: string
  showTime?:boolean
  timeBlockColor?: string
  showGit?:boolean
  gitBlockColor?: string
}
