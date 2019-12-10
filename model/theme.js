/**
 * 和后端的思想一样，定义业务对象
 */
import { Http } from '../utils/http'

class Theme {
  // 获取首页主题
  static async getHomeLoacationA() {
    const data = await Http.request({
      url: `/theme/by/names`,
      data: {
        names: 't-1'
      }
    })

    return data.data
  }
}

export { Theme }
