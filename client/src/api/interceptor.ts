/**
 * 生成基础axios对象，并对请求和响应做处理
 * 前后端约定接口返回解构规范
 * {
 *    code:200,
 *    data:"成功",
 *    message:""
 * }
 */
import axios from "axios"
import { message } from "antd"

// 创建一个独立的axios实例
const service = axios.create({
  // 设置baseUr地址,如果通过proxy跨域可直接填写base地址
  baseURL: "/api",
  // 定义统一的请求头部
  // 配置请求超时时间60s
  timeout: 60000,
  // 跨域携带cookie
  withCredentials: true
})
// 请求拦截

service.interceptors.request.use(config => {
  // 自定义header，可添加项目token
  console.log("config", config)
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
// 返回拦截
service.interceptors.response.use(
  response => {
    // 获取接口返回结果
    const res = response.data
    // code为0，直接把结果返回回去，这样前端代码就不用在获取一次data.
    if (res.code === 0) {
      return res
    } else if (res.code === 401) {
      // 401假设是未登录状态码
      message.warning(res.message)
      // 也可使用router进行跳转
      window.location.href = "/" //登录页面代码
      localStorage.removeItem("token")
      localStorage.removeItem("name")
      return res
    } else {
      // 错误显示可在service中控制，因为某些场景我们不想要展示错误
      // Message.error(res.message);
      return res
    }
  },
  (res2) => {
    if (res2.response.status === 401) {
      window.location.href = "/" //登录页面代码
      message.warning("登录过期，请重新登录")
      localStorage.removeItem("token")
      localStorage.removeItem("name")
    } else {
    console.log("res2", res2)
    message.error("网络请求异常，请稍后重试!")
    }
  }
)
export default service
