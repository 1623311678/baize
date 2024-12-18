/**
 * api地址管理
 */
const domain = ""
const apiMap = {
  login: `${domain}/users/register`,
  getInfo: `${domain}/user/getInfo`,
  getJsReportList: `${domain}/report`,
  getPvList: `${domain}/pv/list`,
  uvStatistics: `${domain}/user-view/statistics`,
  totalUv: `${domain}/user-view/daily-unique-visitors`,
}
export default apiMap
