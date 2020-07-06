/**
 * Sku 请求类
 */
import { Http } from '../utils/http'

class Sku {
  static async getSkuByIds(ids) {
    const res = await Http.request({
      url: `/sku/skus?ids=${ids}`
    })
    return res
  }
}

export {
  Sku
}