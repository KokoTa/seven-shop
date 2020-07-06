import { Http } from '../utils/http'

class Banner {
  static locationB = 'b-1'
  static locationG = 'b-2'

  // 获取首页轮播
  static async getHomeLocationB () {
    return await Http.request({
      url: `/banner/name/${this.locationB}`
    })
  }

  // 获取热门列表
  static async getHomeLocationG () {
    return await Http.request({
      url: `/banner/name/${this.locationG}`
    })
  }
}

export { Banner }
