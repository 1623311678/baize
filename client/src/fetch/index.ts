//fetch/index.js

import HFetch from "./hFetch"

/**
 * config 自定义配置项
 * @param withoutCheck 不使用默认的接口状态校验，直接返回 response
 * @param returnOrigin 是否返回整个 response 对象，为 false 只返回 response.data
 * @param showError 全局错误时，是否使用统一的报错方式
 * @param canEmpty 传输参数是否可以为空
 * @param mock 是否使用 mock 服务
 * @param timeout 接口请求超时时间，默认10秒
 */
let configDefault = {
  showError: true,
  canEmpty: false,
  returnOrigin: false,
  withoutCheck: false,
  mock: false,
  timeout: 10000
}
let hFetchInstace
if (!hFetchInstace) {
  hFetchInstace = new HFetch(window.fetch)
}

// 添加响应拦截器
hFetchInstace.interceptors.response(async response => {
  // TODO: 这里是复制一份结果处理，在这里可以做一些操作

  // HTTP 状态码 2xx 状态入口，data.code 为 200 表示数据正确，无任何错误
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    // 非 2xx 状态入口
    if (configDefault.withoutCheck) {
      // 不进行状态状态检测
      return Promise.reject(response)
    }
    return Promise.reject(response)
  }
})
// 添加请求拦截器
hFetchInstace.interceptors.request(config => {
  configDefault = Object.assign(
    {
      responseType: "json",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        credentials: "include"
      }
    },
    configDefault,
    config
  )
  console.log("添加请求拦截器 configDefalut ==>", configDefault)
  return configDefault
})
function request(method, path, data, config) {
  let initData = {
    method,
    ...configDefault,
    ...config,
    body: JSON.stringify(data)
  }
  if (method === "GET") {
    let params = ""
    if (data) {
      // 对象转url参数
      params = JSON.stringify(data)
        .replace(/:/g, "=")
        .replace(/"/g, "")
        .replace(/,/g, "&")
        .match(/\{([^)]*)\}/)[1]
    }
    return hFetchInstace.fetch(`${path}?${params}`, {
      ...configDefault,
      ...config
    })
  }

  return hFetchInstace.fetch(path, initData)
}

// get请求方法使用封装
function get(path, data, config) {
  return request("GET", path, data, config)
}

// post请求方法使用封装
function post(path, data, config) {
  return request("POST", path, data, config)
}

// put请求方法使用封装
function put(path, data, config) {
  return request("PUT", path, data, config)
}

// delete请求方法使用封装
function del(path, data, config) {
  return request("DELETE", path, data, config)
}
function newFetch() {
  return hFetchInstace.fetch
}

export { newFetch, get, post, put, del }
