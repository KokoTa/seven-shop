import { config } from '../config/config'
class Http {
  static request({ url, data, callback, method = 'GET' }) {
    wx.request({
      url: `${config.apiBaseUrl}${url}`,
      data,
      method,
      header: {
        'content-type': 'application/json',
        appKey: config.appKey
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: result => {
        callback(result.data)
      },
      fail: () => {
        console.log('请求失败')
      }
    })
  }
}

export { Http }