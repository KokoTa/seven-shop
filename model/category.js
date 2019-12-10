import { Http } from '../utils/http'

class Category {
  static async getGridCategory() {
    const data = await Http.request({
      url: '/category/grid/all'
    })

    return data.data
  }
}

export { Category }
