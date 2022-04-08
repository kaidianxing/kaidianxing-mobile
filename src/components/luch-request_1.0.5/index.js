/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息
 */
import Request from './request'

const test = new Request()
test.setConfig((config) => { /* 设置全局配置 */
  config.baseUrl = 'http://www.aaa.cn'
  config.header = {
    ...config.header,
    a: 1,
    b: 2
  }
  // config.custom = { auth: true }
  return config
})

test.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
  config.header = {
    ...config.header,
    a: 3
  }
  // if (config.custom.auth) {
  //   config.header.token = 'token'
  // }
  /*
  if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
    cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
  }
  */
  return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
test.validateStatus = (statusCode) => {
  return statusCode === 200
}

test.interceptor.response((response) => { /* 请求之后拦截器 */
  return response
}, (response) => { // 请求错误做点什么
  return response
})

const http = new Request()

http.setConfig((config) => { /* 设置全局配置 */
  config.baseUrl = 'http://www.bbb.cn' /* 根域名不同 */
  config.header = {
    ...config.header,
    a: 1,
    b: 2
  }
  return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
http.validateStatus = (statusCode) => {
  return statusCode === 200
}

http.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
  config.header = {
    ...config.header,
    b: 1
  }
  /*
  if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
    cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
  }
  */
  return config
})

http.interceptor.response((response) => { /* 请求之后拦截器 */
  // if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
  //   return Promise.reject(response)
  // }
  // if (response.config.custom.verification) { // 演示自定义参数的作用
  //   return response.data
  // }
  return response
}, (response) => { // 请求错误做点什么
  return response
})

export {
  http,
  test
}
