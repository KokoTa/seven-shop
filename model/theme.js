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

  /**
   * 获取主题详情
   */
  async getThemes() {
    const names = `${Theme.locationA},${Theme.locationE},${Theme.locationF},${Theme.locationH}`
    const data = await Http.request({
      url: `/theme/by/names`,
      data: {
        names
      }
    })
    this.themes = data.data
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

  /**
   * 获取主题详情(带SPU)
   */
  static async getThemeSpuByName(name) {
    const data = await Http.request({
      url: `/theme/name/${name}/with_spu`
    })
    return data.data
  }

  static async getHomeLocationESpu() {
    return Theme.getThemeSpuByName(Theme.locationE)
  }
}

export { Theme }
