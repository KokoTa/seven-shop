import { config } from '../config/config'
import { promisic } from '../miniprogram_npm/lin-ui/utils/util'
import { Token } from '../model/token'
import { codes } from '../config/errCode'

class Http {
  static async request ({ url, data = {}, method = 'GET', throwError = false }) {
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
      if (throwError) throw new Error(JSON.stringify(err))
      res = err
      this.showError(-1)
    }

    const code = res.statusCode.toString()

    // 2xx 404
    if (code.startsWith('2') || code === '404') {
      return res.data
    }
       
    // 401
    // token 过期，二次重发，且重发只会发生一次
    if (code === '401' && !data.refreshFlag) {
      return Http._refreshToken({ url, data, method })
    }

    // 4xx 5xx 二次重发失败
    if (throwError) throw new Error(JSON.stringify(res.data))
    const errorCode = res.data.code
    this.showError(errorCode, res.data)
  }

  static async _refreshToken(options) {
    options.data.refreshFlag = true
    const token = new Token()
    await token.getTokenFromServer()
    return await Http.request(options)
  }

  static showError(errCode, serverData) {
    let tip = ''

    if (codes[errCode]) {
      tip = codes[errCode]
    } else {
      tip = serverData.message
    }

    wx.showToast({
      title: tip,
      icon: 'none'
    })
  }
}

export { Http }
