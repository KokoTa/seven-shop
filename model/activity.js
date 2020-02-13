import { Http } from '../utils/http'

class Activity {
  static locationD = 'a-2'

  // 首页优惠券
  static async getHomeLocationD() {
    const data = await Http.request({
      url: `/activity/name/${this.locationD}`
    })
    return data.data
  }
}

export { Activity }
