import { Http } from '../utils/http'

class Spu {
  // 当只有一个 sku 且 sku 的 spec 为 0 时，表示该商品无规格
  static isNoSpec (spu) {
    if (spu.sku_list.length === 1 && spu.sku_list[0].specs.length === 0) {
      return true
    }
    return false
  }

  static getDetail (id) {
    return Http.request({
      url: `/spu/id/${id}/detail`
    }).then(res => res.data)
  }
}

export {
  Spu
}
