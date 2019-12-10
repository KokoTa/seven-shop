import { Http } from '../utils/http'

class Banner {
  static locationB = 'b-1'

  // 获取首页轮播
  static async getHomeLocationB() {
    const data = await Http.request({
      url: `/banner/name/${this.locationB}`
    })

    return data.data
  }
}

export { Banner }
