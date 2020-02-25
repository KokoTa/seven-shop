import { Http } from '../utils/http';
/**
 * 商品补充说明
 */

class SaleExplain {
  static async getFixed() {
    const data = await Http.request({
      url: '/sale_explain/fixed'
    })
    return data.data.map(item => item.text)
  }
}

export {
  SaleExplain
}
