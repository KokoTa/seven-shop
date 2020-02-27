import { Http } from '../utils/http'

class Banner {
  static locationB = 'b-1'
  static locationG = 'b-2'

  // 获取首页轮播
  static async getHomeLocationB () {
    const data = await Http.request({
      url: `/banner/name/${this.locationB}`
    })
    return data.data
  }

  // 获取热门列表
  static async getHomeLocationG () {
    const data = await Http.request({
      url: `/banner/name/${this.locationG}`
    })
    return data.data
  }
}

export { Banner }
