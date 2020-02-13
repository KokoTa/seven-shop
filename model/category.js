import { Http } from '../utils/http'

class Category {
  // 获取首页九宫格数据
  static async getHomeLocationC() {
    const data = await Http.request({
      url: '/category/grid/all'
    })
    return data.data
  }
}

export { Category }
