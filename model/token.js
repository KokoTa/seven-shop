import { config } from "../config/config"
import { promisic } from "../miniprogram_npm/lin-ui/utils/util"

/**
 * 令牌类
 */
class Token {
  /**
   * token 状态
   * 1. token 不存在
   * 2. token 过期
   * 3. token 存在且未过期
   */

  constructor() {
    this.tokenUrl = config.apiBaseUrl + '/token'
    this.verifyUrl = config.apiBaseUrl + '/token/verify'
  }

  async verify() {
    const token = wx.getStorageSync('token')
    if (!token) {
      await this.getTokenFromServer()
    } else {
      await this.verifyFromServer(token)
    }
  }

  async getTokenFromServer() {
    const info = await wx.login()
    const code = info.code
    const res = await promisic(wx.request)({
      url: this.tokenUrl,
      method: 'post',
      data: {
        account: code,
        type: 0
      }
    })
    wx.setStorageSync('token', res.data.token)
    return res.token
  }

  async verifyFromServer(token) {
    const res = await promisic(wx.request)({
      url: this.verifyUrl,
      method: 'post',
      data: {
        token
      }
    })
    const valid = res.data.is_valid
    if (!valid) return this.getTokenFromServer()
  }
}

export {
  Token
}