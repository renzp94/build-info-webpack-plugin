export interface WebpackBuildInfo {
  name: string
  version: string
  branchName: string
  lastCommitHash8: string
  time: string
}

export interface ShowWebpackBuildInfoOptions {
  nameBlockColor?: string
  timeBlockColor?: string
  gitBlockColor?: string
}
