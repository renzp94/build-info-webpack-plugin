import ChildProcess from 'node:child_process'
/**
 * 获取当前分支名
 * @param cwd 项目当前目录
 * @returns 无分支则返回空字符，否则返回当前分支名
 */
export const getBranchName = (cwd: string): Promise<string> => {
  return new Promise((resolve) => {
    ChildProcess.exec(
      'git rev-parse --abbrev-ref HEAD',
      { cwd },
      (err, stdout) =>
        resolve(
          err
            ? ''
            : stdout.replace('*', '').replace('\n', '').replace('\n\r', ''),
        ),
    )
  })
}
/**
 * 获取当前分支最后一次提交的Commit Hash前8位
 * @param cwd 项目当前目录
 * @returns 无提交信息则返回空字符串，否则返回Commit Hash后8位
 */
export const getFirstCommitHash8 = (cwd: string): Promise<string> => {
  return new Promise((resolve) => {
    ChildProcess.exec('git log -1 --format=%H', { cwd }, (err, stdout) =>
      resolve(err ? '' : stdout.replace(/\s+$/, '').slice(0, 8)),
    )
  })
}
/**
 * UTC时间转GMT时间
 * @param utcDate
 * @returns
 */
export const utcToGmt = (utcDate: Date) => {
  const timestamp = utcDate.getTime()
  const offset = utcDate.getTimezoneOffset()
  const utcTimestamp = timestamp + offset
  const GmtTimestamp = utcTimestamp + 3600000 * 8

  return new Date(GmtTimestamp)
}
