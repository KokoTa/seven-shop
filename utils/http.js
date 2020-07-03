import { config } from '../config/config'
import { promisic } from '../miniprogram_npm/lin-ui/utils/util'

class Http {
  static async request ({ url, data, method = 'GET' }) {
    let res = null
    
    try {
      res = await promisic(wx.request)({
        url: `${config.apiBaseUrl}${url}`,
        data,
        method,
        header: {
          'content-type': 'application/json',
          appKey: config.appKey,
          authorization: `Bearer ${wx.getStorageSync('token')}`
        }
      })
    } catch(err) {
      // 这里只有断网的情况下才会触发，即 xhr 失败才会触发，返回 404、500 不会触发 catch
      res = err
    }

    const code = res.statusCode.toString()
    console.log(code)

    return res
  }
}

export { Http }
