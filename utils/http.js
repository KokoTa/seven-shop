import { config } from '../config/config'
import { promisic } from '../miniprogram_npm/lin-ui/utils/util'

class Http {
  static request ({ url, data, method = 'GET' }) {
    return promisic(wx.request)({
      url: `${config.apiBaseUrl}${url}`,
      data,
      method,
      header: {
        'content-type': 'application/json',
        appKey: config.appKey
      }
    })
  }
}

export { Http }
