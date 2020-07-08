import { Http } from '../utils/http'

class Activity {
  static locationD = 'a-2'

  // 首页优惠券
  static async getHomeLocationD () {
    const data = await Http.request({
      url: `/activity/name/${this.locationD}`
    })
    return data
  }

  // 活动优惠券
  static async getActivityWithCoupon() {
    const data = await Http.request({
      url:  `/activity/name/${this.locationD}/with_coupon`
    })
    return data
  }
}

export { Activity }
