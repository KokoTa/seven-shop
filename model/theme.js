import { config } from '../config/config'
/**
 * 和后端的思想一样，定义业务对象
 */
class Theme {
  // 获取首页主题
  static getHomeLoacationA(callback) {
    wx.request({
      url: `${config.apiBaseUrl}/theme/by/names`,
      data: {
        names: 't-1'
      },
      header: {
        'content-type': 'application/json',
        appKey: config.appKey
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: result => {
        callback(result.data[0])
      },
      fail: () => {},
      complete: () => {}
    })
  }
}

export { Theme }
