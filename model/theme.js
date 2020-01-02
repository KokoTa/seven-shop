/**
 * 和后端的思想一样，定义业务对象
 */
import { Http } from '../utils/http'

class Theme {
  static locationA = 't-1' // 首页主题
  static locationE = 't-2' // 每周上新
  static locationF = 't-3' // 精选内容
  static locationH = 't-4' // 专题内容

  themes = []

  async getThemes() {
    const names = `${Theme.locationA},${Theme.locationE},${Theme.locationF},${Theme.locationH}`
    this.themes = await Http.request({
      url: `/theme/by/names`,
      data: {
        names
      }
    })
  }

  getHomeLocationA() {
    return this.themes.find(t => t.name === Theme.locationA)
  }
  getHomeLocationE() {
    return this.themes.find(t => t.name === Theme.locationE)
  }
  getHomeLocationF() {
    return this.themes.find(t => t.name === Theme.locationF)
  }
  getHomeLocationH() {
    return this.themes.find(t => t.name === Theme.locationH)
  }
}

export { Theme }
